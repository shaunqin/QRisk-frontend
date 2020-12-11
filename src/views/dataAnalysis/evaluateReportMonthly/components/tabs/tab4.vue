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
      <el-table-column prop="name" label="流程状态" width="260">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column label="操作" width="100">
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
import { riskControlQueryDetailTask } from "@/api/risk";
import handle from "../handle";
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
        this.init();
      }
    }
  },
  methods: {
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    subHandle(row) {
      this.loading = true;
      riskControlQueryDetailTask(row.taskId, row.formId).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = res.obj.id;
          if (res.obj.riskVoList && res.obj.riskVoList.length > 0) {
            _this.form.riskControlRisk = res.obj.riskVoList;
          }
          _this.dialog = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>