<template>
  <div id="loading">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @sort-change="sortChange"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      lazy
      :load="loadTree"
    >
      <el-table-column prop="businessTitle" label="主题" show-overflow-tooltip align="left" />
      <el-table-column prop="content" label="措施内容" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" width="120" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column prop="name" label="流程状态" width="260">
        <template slot-scope="{row}">
          <el-tag class="noborder" :color="getStatusColor(row)" effect="dark">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="剩余天数" width="120" sortable="custom">
        <template slot-scope="{row}">
          <span :style="{color:row.emergency?getStatusColor(row):'#606266'}">{{row.daysRemained}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="subHandle(row)">办理</el-button>
        </template>
      </el-table-column>
      <el-table-column label width="80">
        <template slot-scope="{ row }" v-if="row.pdfUrl != null">
          <el-link type="primary" :href="pdfUrl(row)" target="_blank">查看PDF</el-link>
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
import { riskNoticeQueryTask } from "@/api/risk";
import handle from "./handle";
export default {
  mixins: [initData],
  components: { handle },
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
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.params, ...this.queryForm };
      return true;
    },
    subHandle(row) {
      this.loading = true;
      let _this = this.$refs.handle;
      _this.dialogLoading = true
      riskNoticeQueryTask(row.taskId, row.formId).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = { ...res.obj, measures: res.obj.measuresVos };
          _this.form.taskId = row.taskId;
          _this.form.formId = row.formId;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          } else {
            _this.form.comment = "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          _this.dialog = true;
          setTimeout(() => {
            _this.dialogLoading = false
          }, 500);
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`;
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
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      riskNoticeLazyLoadIssueTree(tree.id).then(res => {
        resolve(res.obj)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.noborder {
  border-color: transparent;
}
</style>