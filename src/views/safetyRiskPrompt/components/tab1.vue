<template>
  <div>
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-button
        v-if="showBtn"
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-plus"
        @click="add"
      >新建</el-button>
    </div>
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
      <el-table-column label width="80">
        <template slot-scope="{ row }" v-if="row.pdfUrl != null">
          <el-link type="primary" :href="pdfUrl(row)" target="_blank">查看PDF</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="background" label="背景" min-width="150" show-overflow-tooltip />
      <el-table-column prop="existingRisk" label="安全风险" min-width="150" show-overflow-tooltip />
      <el-table-column prop="responseDept" label="责任单位" show-overflow-tooltip />
      <el-table-column label="拟制人">
        <template slot-scope="{ row }">{{ row.issueName }}[{{ row.issuer }}]</template>
      </el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="{ row }">{{ formatShortDate(row.publishTime) }}</template>
      </el-table-column>
      <el-table-column label="发布单位" prop="dept"></el-table-column>
      <el-table-column label="主题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="text" @click="detail(row)">{{ row.title }}</el-button>
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format, formatShortDate } from "@/utils/datetime";
import eform from "./form";
import edetail from "./detail";
import { riskNoticeDetail, getRiskNoticeNo, queryRiskMgrDept, verifyPerms } from "@/api/risk";
import { mapGetters } from "vuex";
export default {
  components: { eform, edetail },
  mixins: [initData],
  data() {
    return {
      showBtn: false
    };
  },
  props: ["queryForm"],
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.init();
      },
    },
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  created() {
    this.init();
    verifyPerms().then(res => {
      if (res.code != '200') {
        this.$message.error(res.msg);
      } else {
        this.showBtn = !!res.obj;
      }
    })
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      queryRiskMgrDept()
        .then((res) => {
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            if (res.obj.length > 0) {
              let _this = this.$refs.form;
              _this.deptList = res.obj;
              // 设置默认选中
              if (res.obj.length > 0) {
                _this.form.deptPath = res.obj[0].deptPath;
              }
              _this.dialog = true;
            }
          }
        })
    },
    detail(row) {
      riskNoticeDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.form = res.obj;
          _this.dialog = true;
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>
