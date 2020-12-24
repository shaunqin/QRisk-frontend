<template>
  <div>
    <!-- 风险提示 -->
    <riskNoticeDetail ref="riskNoticeDetail" v-if="processType==1" :fullscreen="true" />
    <!-- 专项风险 -->
    <speciaRiskDetail ref="speciaRiskDetail" v-if="processType==2" :fullscreen="true" />
  </div>
</template>

<script>
import riskNoticeDetail from '@/views/safetyRiskPrompt/components/detail'
import speciaRiskDetail from '@/views/riskManagerment/riskAssessment/components/detail'

import { riskNoticeSubDetail, specialRiskDetail } from '@/api/risk'
export default {
  components: {
    riskNoticeDetail, speciaRiskDetail
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
      //   case "5": this.hazards(); break;
      //   case "6":
      //   case "7": this.hazards2(); break;
      //   case "3": this.monthEvaluateReport(); break;
      case "2": this.speciaRisk(); break;
      default: break;
    }
  },
  methods: {
    riskNotice() {
      let _this = this.$refs.riskNoticeDetail;
      _this.dialog = true;
      _this.dialogLoading = true;
      riskNoticeSubDetail(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.form = res.obj;
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>