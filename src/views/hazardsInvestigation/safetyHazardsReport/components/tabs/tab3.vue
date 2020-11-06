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
          <el-button type="primary" size="mini" @click="detail(row)">查看</el-button>
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
    <!-- 详情 -->
    <edetail ref="edetail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { queryHasDoneDetail } from "@/api/hazards";
import edetail from "../detail";
export default {
  mixins: [initData],
  components: { edetail },
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
      this.url = `/riskmgr_mgr/hidden_danger/query/hasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm }
      return true;
    },
    detail(row) {
      queryHasDoneDetail(row.taskId, row.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>