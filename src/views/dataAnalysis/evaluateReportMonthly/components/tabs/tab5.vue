<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column prop="businessName" label="流程名称" width="200">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.businessName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" width="180">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column label width="100">
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
    <!-- <edetail ref="edetail" /> -->
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import { specialRiskGasDoneDetail } from '@/api/risk';
// import edetail from '../detail'
export default {
  // components: { edetail },
  mixins: [initData],
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
    format,
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/hasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      specialRiskGasDoneDetail(row.taskId, row.formId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>