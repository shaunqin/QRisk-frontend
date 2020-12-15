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
      <el-table-column prop="title" label="标题" min-width="140" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="text" @click="detail(row)">{{row.title}}</el-button>
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
    <edetail ref="detail" :showChildNotes="true" :showChildMeasures="true" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import edetail from "../detail";
import { specialRiskDetail } from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { edetail },
  mixins: [initData],
  data() {
    return {
    };
  },
  mounted() {
    this.init();
  },
  props: ["assessmentType", "queryForm"],
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
      this.url = `/risk_mgr/special_risk_notice_mgr/query/myIssued/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = this.assessmentType
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      specialRiskDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          if(this.assessmentType == '4') {
            _this.assessmentType = this.assessmentType;
            _this.data = { ...res.obj }
            if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
              // _this.list = [...res.obj.hazardVoList]
              _this.list.map((item, index) => {
                item.possibility = res.obj.hazardVoList[index].possibility
                item.rootCauseAnalysis = res.obj.hazardVoList[index].rootCauseAnalysis
                item.specialRiskMeasureList[0].controlMeasure = res.obj.hazardVoList[index].specialRiskMeasureList[0].controlMeasure
                item.specialRiskMeasureList[0].reponsibleDept = res.obj.hazardVoList[index].specialRiskMeasureList[0].reponsibleDept
                item.specialRiskMeasureList[0].completion = res.obj.hazardVoList[index].specialRiskMeasureList[0].completion
              })
            }
            _this.dialog = true;
          } else {
            _this.data = res.obj;
            _this.assessmentType = this.assessmentType
            _this.dialog = true;
          }
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`
    }
  },
};
</script>

<style lang="scss" scoped>
</style>