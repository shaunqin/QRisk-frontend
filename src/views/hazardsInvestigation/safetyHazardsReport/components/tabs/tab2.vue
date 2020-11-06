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
      <el-table-column prop="businessName" label="流程名称">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.businessName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" />
      <el-table-column prop="createTime" label="发起时间" />
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { queryHazards } from "@/api/hazards";
import handle from "../handle";
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
        this.init();
      }
    }
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.queryForm }
      return true;
    },
    subHandle(row) {
      queryHazards(row.taskId, row.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = row.formId;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          _this.dialog = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>