<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column prop="name" label="流程状态" min-width="150">
        <template slot-scope="{row}">
          <el-tag class="noborder" :color="getStatusColor(row)" effect="dark">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="deptName" label="部门" show-overflow-tooltip />
      <el-table-column prop="month" label="月份" show-overflow-tooltip />
      <el-table-column label="上报人" width="130">
        <template slot-scope="{row}">
          <div>{{renderTbCol(row)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="taskTime" label="任务时间" width="140">
        <template slot-scope="{row}">
          <div>{{formatDate(row.taskTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column prop="daysRemainedHD" label="剩余天数" width="120" sortable="custom">
        <template slot-scope="{row}">
          <span :style="{color:row.emergency?getStatusColor(row):'#606266'}">{{row.daysRemainedHD}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="subHandle(row)">办理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <!-- 处理待办 -->
    <handle ref="handle" />
    <handleRun ref="handleRun" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { queryHazards, queryHazards2 } from "@/api/hazards";
import { format, formatShortDate } from "@/utils/datetime"
import handle from "../handle";
import handleRun from "../handleRun";
export default {
  mixins: [initData],
  components: { handle, handleRun },
  mounted() {
    this.init();
  },
  props: ["queryForm"],
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.page = 1;
        this.init();
      }
    }
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.params, ...this.queryForm }
      return true;
    },
    subHandle(row) {
      if (row.businessType == 5) {
        queryHazards(row.taskId, row.formId).then((res) => {
          let _this = this.$refs.handle;
          _this.dialogLoading = true;
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            _this.data = res.obj;
            _this.form.taskId = row.taskId;
            _this.form.formId = row.formId;
            _this.form.noHiddenDanger = res.obj.noHiddenDanger;
            if (res.obj.step != 4) {
              _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
            }
            _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
            _this.dialog = true;
            this.$nextTick(() => {
              if (_this.$refs.step1 && _this.$refs.step1.$refs.fillinForm) {
                _this.$refs.step1.$refs.fillinForm.fillinData = res.obj.deptControlList.hiddenDangerControlList;
                _this.$refs.step1.$refs.fillinForm.titleForm.reportName = res.obj.deptControlList.fillerName;
                _this.$refs.step1.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(res.obj.deptControlList.fillDate);
                _this.$refs.step1.$refs.fillinForm.titleForm.title = res.obj.controlListName;
              }
            })
          }
          setTimeout(() => {
            _this.dialogLoading = false
          }, 500);
        });
      } else {
        queryHazards2({ runTaskId: row.taskId }).then((res) => {
          let _this = this.$refs.handleRun;
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            _this.data = res.obj;
            _this.form.taskId = row.taskId;
            _this.dialog = true;
          }
        });
      }
    },
    formatDate(time) {
      return format(time)
    },
    renderTbCol(row) {
      if (row.fillerName && row.filler) {
        return `${row.fillerName}[${row.filler}]`;
      } else if (row.fillerName || row.filler) {
        return row.fillerName ? row.fillerName : row.filler;
      } else {
        return ""
      }
    },
    getStatusColor(row) {
      let color = "";
      if (row.emergency) {
        color = "#f56c6c"; //红色
      } else {
        switch (row.customStep) {
          case 0: color = "#FF9800"; break; // 橙色
          case 1: color = "#4CAF50"; break; // 绿色
          case 2: color = "#FFEB3B"; break; // 黄色
          default: color = "#FF9800"; break;
        }
      }
      return color
    }
  },
};
</script>

<style lang="scss" scoped>
.noborder {
  border-color: transparent;
}
</style>