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
      <el-table-column prop="no" label="编号" width="140" />
      <el-table-column prop="title" label="标题" min-width="140" show-overflow-tooltip />
      <el-table-column prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip />
      <el-table-column prop="issueDept" label="下发部门" />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
      </el-table-column>
          <el-table-column label="发布日期" width="100">
        <template slot-scope="{row}">{{formatShortDate(row.createDate)}}</template>
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
    <!-- <edetail ref="detail" /> -->
  </div>
</template>

<script>
import initData from "@/mixins/initData";
// import edetail from "./detail";
import { riskNoticeSubDetail } from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
export default {
  // components: { edetail },
  mixins: [initData],
  data() {
    return {
    };
  },
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
    formatShortDate,
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/myIssued/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = '5'
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      riskNoticeSubDetail(row.id).then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.form = res.obj;
          _this.dialog = true;
        }
      })
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`
    }
  },
};
</script>

<style lang="scss" scoped>
</style>