<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column prop="no" label="编号" width="130" />
      <el-table-column label="主题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-link
            size="mini"
            v-if="row.pdfUrl"
            type="primary"
            :href="pdfUrl(row)"
            target="_blank"
          >{{ row.title }}</el-link>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="background" label="背景" min-width="150" show-overflow-tooltip />
      <el-table-column prop="existingRisk" label="安全风险" min-width="150" show-overflow-tooltip />-->
      <el-table-column prop="responseDept" label="责任单位" show-overflow-tooltip />
      <el-table-column label="拟制人">
        <template slot-scope="{ row }">{{ row.issueName }}[{{ row.issuer }}]</template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="detail(row)">详情</el-button>
          <el-button size="mini" type="primary" @click="genPdf(row)">手动生成PDF</el-button>
          <el-button size="mini" type="warning" @click="issueAgain(row)">再次发起</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px; text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <edetail ref="detail" />
    <eform ref="form" :isAdd="isAdd" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import edetail from "./detail";
import eform from './form'
import { riskNoticeSubDetail, riskNoticeGenPdf, riskNoticeIssueAgain } from "@/api/risk";
export default {
  components: { edetail, eform },
  mixins: [initData],
  data() {
    return {};
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
      },
    },
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/myIssued/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      // this.loading = true;
      let _this = this.$refs.detail;
      _this.dialogLoading = true;
      _this.dialog = true;
      riskNoticeSubDetail(row.id).then((res) => {
        // this.false = true;
        _this.dialogLoading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.form = res.obj;
          _this.files = res.obj.files;
          _this.dialog = true;
        }
      });
    },
    genPdf(row) {
      this.loading = true;
      riskNoticeGenPdf(row.id).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("生成成功,请稍后刷新页面查看");
        }
      })
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`;
    },
    issueAgain(row) {
      this.isAdd = false;
      let id = row.id;
      let _this = this.$refs.form;
      riskNoticeIssueAgain(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = {
            id: obj.id,
            no: obj.no,
            title: obj.title,
            background: obj.background,
            existingRisk: obj.existingRisk,
            measures: obj.measuresVos,
            deptPath: obj.deptPath,
            pdf: obj.pdf
          };
          _this.id = obj.id;
          _this.files = res.obj.files;
          _this.dialog = true;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped></style>
