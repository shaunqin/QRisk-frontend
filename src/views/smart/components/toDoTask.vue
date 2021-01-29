<template>
  <div>
    <!-- 风险提示 -->
    <riskNoticeHanfle v-if="processType==1" ref="riskNoticeHanfle" :fullscreen="true" />
    <!-- 隐患排查 -->
    <hazardsHandle v-if="processType==5" ref="hazardsHandle" :fullscreen="true" />
    <hazardsHandleRun
      v-if="processType==6||processType==7"
      ref="hazardsHandleRun"
      :fullscreen="true"
    />
    <!-- 月度评价报告 -->
    <monthEvaluateReportHandle
      v-if="processType==3"
      ref="monthEvaluateReportHandle"
      :fullscreen="true"
    />
    <!-- 专项风险 -->
    <riskAssessmentHandle v-if="processType==2" ref="riskAssessmentHandle" :fullscreen="true" />
    <!-- 关键风险 -->
    <keyRiskHandle v-if="processType==8" ref="keyRiskHandle" :fullscreen="true" />
  </div>
</template>

<script>
import riskNoticeHanfle from '@/views/safetyRiskPrompt/components/handle'
import hazardsHandle from '@/views/hazardsInvestigation/safetyHazardsReport/components/handle'
import hazardsHandleRun from '@/views/hazardsInvestigation/safetyHazardsReport/components/handleRun'
import monthEvaluateReportHandle from '@/views/dataAnalysis/evaluateReportMonthly/components/handle'
import riskAssessmentHandle from '@/views/riskManagerment/riskAssessment/components/handle'
import keyRiskHandle from '@/views/cruxRisk/notificationAndEvaluation/components/handle'
import { riskNoticeQueryTask, riskControlQueryDetailTask, specialRiskFill, keyRiskFill } from "@/api/risk";
import { queryHazards, queryHazards2 } from "@/api/hazards";
import { formatShortDate } from '@/utils/datetime'
export default {
  components: {
    riskNoticeHanfle, hazardsHandle, hazardsHandleRun, monthEvaluateReportHandle,
    riskAssessmentHandle, keyRiskHandle
  },
  data() {
    return {
      /** 1:风险提示 5,6,7:隐患排查 2:专项风险 3:月度评价报告 */
      processType: this.$route.query.processType,
      taskId: this.$route.query.businessNo,
      formId: 0
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
      case "8": this.keyRisk(); break;
      default: break;
    }
  },
  methods: {
    formatShortDate,
    riskNotice() {
      let _this = this.$refs.riskNoticeHanfle;
      _this.dialog = true;
      _this.dialogLoading = true
      riskNoticeQueryTask(this.taskId, this.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = { ...res.obj, measures: res.obj.measuresVos };
          _this.form.taskId = this.taskId;
          _this.form.formId = this.formId;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          } else {
            _this.form.comment = "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
        }
        _this.dialogLoading = false;
      });
    },
    hazards() {
      let _this = this.$refs.hazardsHandle;
      _this.dialog = true;
      _this.dialogLoading = true;
      queryHazards(this.taskId, this.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.form.taskId = this.taskId;
          _this.form.formId = this.formId;
          _this.form.noHiddenDanger = res.obj.noHiddenDanger;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
        }
        _this.dialogLoading = false;
      });
    },
    hazards2() {
      let _this = this.$refs.hazardsHandleRun;
      _this.dialog = true;
      _this.dialogLoading = true;
      queryHazards2({ runTaskId: this.taskId }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.form.taskId = this.taskId;
        }
        _this.dialogLoading = false;
      });
    },
    monthEvaluateReport() {
      let _this = this.$refs.monthEvaluateReportHandle;
      _this.dialog = true;
      _this.dialogLoading = true;
      riskControlQueryDetailTask(this.taskId, this.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.form.taskId = this.taskId;
          _this.form.formId = res.obj.id;
          if (res.obj.riskVoList && res.obj.riskVoList.length > 0) {
            _this.form.riskControlRisk = res.obj.riskVoList;
          }
        }
        _this.dialogLoading = false;
      });
    },
    speciaRisk() {
      let _this = this.$refs.riskAssessmentHandle;
      _this.dialog = true;
      _this.dialogLoading = true;
      specialRiskFill(this.taskId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.assessmentType = this.assessmentType;
          _this.data = res.obj
          _this.data.endTime = formatShortDate(res.obj.endTime)
          _this.data.approvalDate = formatShortDate(res.obj.approvalDate);
          if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
            _this.data.hazardList = res.obj.hazardVoList.map(item => {
              item.specialRiskMeasureList.map(childItem => {
                childItem.deadline = formatShortDate(childItem.deadline)
              })
              return item
            })
          } else { _this.data.hazardList = [] }
          _this.form.taskId = this.taskId;
          _this.form.formId = res.obj.id;
        }
        _this.dialogLoading = false;
      });
    },
    keyRisk() {
      let _this = this.$refs.keyRiskHandle;
      _this.dialog = true;
      _this.dialogLoading = true;
      keyRiskFill(this.taskId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj
          _this.data.approvalDate = formatShortDate(res.obj.approvalDate);
          if (res.obj.keyRiskListVoLists && res.obj.keyRiskListVoLists.length > 0) {
            _this.data.keyRiskLists = res.obj.keyRiskListVoLists.map(item => {
              if (item.appliance == '0') {
                item.disabledRisk = false
                item.disabledAppliance = false
              } else if (item.appliance == '1') {
                item.disabledRisk = true
                item.disabledAppliance = true
              }
              item.hazardList.map(hazardItem => {
                hazardItem.specialRiskMeasureList.map(childItem => {
                  childItem.deadline = formatShortDate(childItem.deadline)
                  childItem.reponsibleDept = [childItem.reponsibleDept]
                })
              })
              return item
            })
          } else { _this.data.keyRiskLists = [] }
          _this.form.taskId = this.taskId;
          _this.form.formId = res.obj.id;
          _this.dialogLoading = false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>