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
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="deptName" label="部门" show-overflow-tooltip />
      <el-table-column prop="month" label="月份" show-overflow-tooltip />
      <el-table-column label="上报人" width="130">
        <template slot-scope="{row}">
          <div>{{renderTbCol(row)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">查看详情</el-button>
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
    <edetail2 ref="edetail2" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { queryHasDoneDetail, queryHasDoneDetail2 } from "@/api/hazards";
import edetail from "../detail";
import edetail2 from "../detail2";
export default {
  mixins: [initData],
  components: { edetail, edetail2 },
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
      this.url = `/riskmgr_mgr/hidden_danger/query/hasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm }
      return true;
    },
    detail(row) {
      if (row.businessType == 5) {
        queryHasDoneDetail(row.formId).then((res) => {
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            let _this = this.$refs.edetail;
            _this.data = res.obj;
            _this.dialog = true;
          }
        });
      } else {
        queryHasDoneDetail2(row.id).then((res) => {
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            let _this = this.$refs.edetail2;
            _this.data = res.obj;
            _this.queryForm.runTaskId = res.obj.runTaskId;
            _this.dialog = true;
          }
        });
      }
    },
    renderTbCol(row) {
      if (row.fillerName && row.filler) {
        return `${row.fillerName}[${row.filler}]`;
      } else if (row.fillerName || row.filler) {
        return row.fillerName ? row.fillerName : row.filler;
      } else {
        return ""
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>