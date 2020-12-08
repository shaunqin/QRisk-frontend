<template>
  <div>
    <div class="head-container">
      <!-- <el-button
        size="mini"
        type="success"
        icon="el-icon-plus"
        :disabled="!assessmentType"
        @click="add"
      >新建通知</el-button> -->
      <el-button
        size="mini"
        type="success"
        icon="el-icon-plus"
        @click="addAssessment"
        :disabled="!assessmentType"
      >新建</el-button>
      <!-- <el-button type="primary" size="mini" @click="newAdd">新建</el-button> -->
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column prop="no" label="编号" width="140" />
      <el-table-column label="标题" min-width="140" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="detail(row)">{{row.title}}</el-button>
        </template>
      </el-table-column>
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
    <edetail ref="detail" />
    <eform ref="form" :is-add="isAdd"></eform>
    <formSp ref="formSp" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { formatShortDate } from "@/utils/datetime";
import eform from "../form";
import edetail from "../detail";
import formSp from '../formSp'
import { specialRiskDetail, queryRiskListMgr } from "@/api/risk";
export default {
  components: { eform, edetail, formSp },
  mixins: [initData],
  data() {
    return {
      selections: []
    };
  },
  props: ["assessmentType", "queryForm"],
  mounted() {
    this.init();
  },
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.init();
      }
    },
    assessmentType(val) {
      this.init()
    }
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = this.assessmentType
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    /* add() {
      this.isAdd = true;
      let _this = this.$refs.form;
      _this.form.assType = this.assessmentType;
      _this.form.type = "1"; // 通知
      _this.dialog = true;
    }, */
    async addAssessment() {
      if(this.assessmentType == '4') {
        this.$refs.formSp.dialog = true;
      } else {
        this.isAdd = true;
        let _this = this.$refs.form;
        _this.form.assType = this.assessmentType;
        _this.form.type = "1";
        await this.getRiskListMgr()
        _this.dialog = true;
      }
    },
    detail(row) {
      specialRiskDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`
    },
    async getRiskListMgr() {
      let _this = this.$refs.form;
      await queryRiskListMgr().then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.form.hazardList[0].possibleRisks = res.obj[0].riskNo
          _this.possibleRisksList = res.obj
        }
      })
    },
    newAdd() {
      this.$refs.formSp.dialog = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>