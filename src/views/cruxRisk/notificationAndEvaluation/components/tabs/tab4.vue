<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="{row}">
          <el-tag type="success">{{renderType(row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="流程状态" width="180">
        <template slot-scope="{row}">
          <el-tag class="noborder" :color="getStatusColor(row)" effect="dark">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="assignor" label="分配人" width="130" />
      <el-table-column label="分配时间" width="140">
        <template slot-scope="{row}">{{format(row.assignorTime)}}</template>
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column prop="daysRemained" label="剩余天数" width="140" show-overflow-tooltip />
      <el-table-column label="操作" width="100" fixed="right">
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { keyRiskFill } from "@/api/risk";
import handle from "../handle";
import { format, formatShortDate } from '@/utils/datetime'
export default {
  mixins: [initData],
  components: { handle },
  props: ["queryForm"],
  mounted() {
    this.init();
  },
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
    format,
    beforeInit() {
      this.url = `/risk_mgr/key_risk_mgr/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = '5';
      return true;
    },
    subHandle(row) {
      this.loading = true;
      let _this = this.$refs.handle;
      _this.dialogLoading = true;
      keyRiskFill(row.taskId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj
          _this.data.approvalDate = formatShortDate(res.obj.approvalDate);
          if (res.obj.keyRiskListVoLists && res.obj.keyRiskListVoLists.length > 0) {
            _this.data.keyRiskLists = res.obj.keyRiskListVoLists.map(item => {
              if (item.appliance == '0') {
                item.disabledRisk = false
                item.disabledAppliance = false
              } else if (item.appliance == '1') {
                item.disabledRisk = true
                item.disabledAppliance = true
              }
              item.hazardList.map(hazardItem => {
                hazardItem.specialRiskMeasureList.map(childItem => {
                  childItem.deadline = formatShortDate(childItem.deadline)
                  childItem.reponsibleDept = [childItem.reponsibleDept]
                })
              })
              return item
            })
          } else { _this.data.keyRiskLists = [] }
          _this.form.taskId = row.taskId;
          _this.form.formId = res.obj.id;
          this.loading = false;
          _this.dialog = true;
          _this.dialogLoading = false;
        }
      });
    },
    renderType(row) {
      let type = "";
      switch (row.type) {
        case '1': type = "通知"; break;
        case '2': type = "评估"; break;
        default: break;
      }
      return type;
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