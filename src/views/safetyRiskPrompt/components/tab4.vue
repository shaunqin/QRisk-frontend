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
      <el-table-column prop="name" label="任务名称" min-width="110" show-overflow-tooltip />
      <el-table-column prop="businessName" label="流程名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="subHandle(row)">处理待办</el-button>
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
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/queryTodo/${this.page}/${this.size}`;
      return true;
    },
    subHandle(row) {
      riskNoticeQueryTask(row.taskId, row.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = row.formId;
          _this.dialog = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>