<template>
  <div class="app-container">
    <div class="head-container">
      <el-button type="success" icon="el-icon-s-data" size="mini">生成报表</el-button>
      <!-- <el-button type="success" icon="el-icon-s-data" size="mini">生成局方报表</el-button> -->
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
          <el-button type size="mini" @click="detail(scope.row.id)">详情</el-button>
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
export default {
  components: { detail },
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
      return true;
    },
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    detail(id) {
      getHiddenControlDetail(id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.data = res.obj;
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