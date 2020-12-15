<template>
  <div class="app-container">
    <div class="head-container">
      <esearch ref="search" />
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" :stripe="true" style="width: 100%;">
      <el-table-column prop="no" label="编号" />
      <el-table-column prop="hiddenName" label="隐患名称" />
      <el-table-column prop="deptName" label="部门" />
      <el-table-column prop="findTime" label="发现时间" />
      <el-table-column prop="sourceName" label="来源" />
      <el-table-column prop="typeName" label="类型" />
      <el-table-column prop="levelsName" label="等级" />
      <el-table-column prop="businessName" label="涉及业务" />
      <el-table-column prop="processName" label="涉及流程" />
      <el-table-column prop="supervisoryUnit" label="监管单位" />
      <el-table-column prop="rectificationProgress" label="整改进展" />
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row.id)" icon="el-icon-edit"></el-button>
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
    <!-- 统计 -->
    <detail ref="detail"></detail>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import detail from "./components/detail";
import { getHiddenControlDetail } from '@/api/hazards'
import esearch from './components/search'
export default {
  components: { detail, esearch },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/getMyControlList/${this.page}/${this.size}`;
      let _this = this.$refs.search;
      if (_this)
        this.params = _this.form;
      return true;
    },
    detail(id) {
      getHiddenControlDetail(id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.form = res.obj;
          _this.form.modifyTimes = 1;
          _this.dialog = true;
        }
      })
    },
    edit() { },
    subDelete() { }
  }
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  margin-bottom: 20px;
}
</style>