<template>
  <div>
    <!-- 风险提示 -->
    <riskNoticeDoneDetail ref="riskNoticeDoneDetail" v-if="processType==1" :fullscreen="true" />
    <!-- 隐患排查 -->
    <hazardsDoneDetail ref="hazardsDoneDetail" v-if="processType==5" :fullscreen="true" />
    <hazardsDoneDetail2
      ref="hazardsDoneDetail2"
      v-if="processType==6||processType==7"
      :fullscreen="true"
    />
    <!-- 专项风险 -->
    <speciaRiskDetail ref="speciaRiskDetail" v-if="processType==2" :fullscreen="true" />
    <!-- 月度评价报告 -->
    <monthEvaluateReportDoneDetail
      ref="monthEvaluateReportDoneDetail"
      v-if="processType==3"
      :fullscreen="true"
    />
  </div>
</template>

<script>
import riskNoticeDoneDetail from '@/views/safetyRiskPrompt/components/doneDetail'
import hazardsDoneDetail from '@/views/hazardsInvestigation/safetyHazardsReport/components/detail'
import hazardsDoneDetail2 from '@/views/hazardsInvestigation/safetyHazardsReport/components/detail2'
import speciaRiskDetail from '@/views/riskManagerment/riskAssessment/components/detail'
import monthEvaluateReportDoneDetail from '@/views/dataAnalysis/evaluateReportMonthly/components/doneDetail'
import { riskNoticeDoneDetail2, specialRiskDetail, riskControlHasDoneDetailByFormId } from '@/api/risk'
import { queryHasDoneDetail, queryHasDoneDetail2 } from "@/api/hazards";
export default {
  components: {
    riskNoticeDoneDetail, hazardsDoneDetail, hazardsDoneDetail2, speciaRiskDetail, monthEvaluateReportDoneDetail
  },
  data() {
    return {
      /** 1:风险提示 5,6,7:隐患排查 2:专项风险 3:月度评价报告 */
      processType: this.$route.query.processType,
      id: this.$route.query.businessKey,
    }
  },
  mounted() {
    switch (this.processType) {
      case "1": this.riskNotice(); break;
      case "5": this.hazards(); break;
      case "6":
      case "7": this.hazards2(); break;
      case "3": this.monthEvaluateReport(); break;
      case "2": this.speciaRisk(); break;
      default: break;
    }
  },
  methods: {
    riskNotice() {
      let _this = this.$refs.riskNoticeDoneDetail;
      _this.dialog = true;
      _this.dialogLoading = true;
      riskNoticeDoneDetail2(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
        }
        _this.dialogLoading = false;
      });
    },
    hazards() {
      let _this = this.$refs.hazardsDoneDetail;
      _this.dialog = true;
      _this.dialogLoading = true;
      queryHasDoneDetail(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
        }
        _this.dialogLoading = false;
      });
    },
    hazards2() {
      let _this = this.$refs.hazardsDoneDetail2;
      _this.dialog = true;
      _this.dialogLoading = true;
      queryHasDoneDetail2(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.queryForm.runTaskId = res.obj.runTaskId;
        }
        _this.dialogLoading = false;
      });
    },
    speciaRisk() {
      let _this = this.$refs.speciaRiskDetail;
      _this.dialog = true;
      _this.dialogLoading = true;
      specialRiskDetail(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let assessmentType = res.obj.assType;
          if (assessmentType == '4') {
            _this.assessmentType = assessmentType;
            _this.data = { ...res.obj }
            if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
              // _this.list = [...res.obj.hazardVoList]
              _this.list.map((item, index) => {
                item.possibility = res.obj.hazardVoList[index].possibility
                item.rootCauseAnalysis = res.obj.hazardVoList[index].rootCauseAnalysis
                item.specialRiskMeasureList = res.obj.hazardVoList[index].specialRiskMeasureList
              })
            }
          } else {
            _this.data = res.obj;
            _this.assessmentType = assessmentType
          }
          _this.dialogLoading = false;
        }
      });
    },
    monthEvaluateReport() {
      let _this = this.$refs.monthEvaluateReportDoneDetail;
      _this.dialog = true;
      _this.dialogLoading = true;
      riskControlHasDoneDetailByFormId(this.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
        }
        _this.dialogLoading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>