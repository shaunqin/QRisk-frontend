<template>
  <div>
    <riskNoticeHanfle v-if="processType==1" ref="riskNoticeHanfle" :fullscreen="true" />
  </div>
</template>

<script>
import riskNoticeHanfle from '@/views/safetyRiskPrompt/components/handle'
import { riskNoticeQueryTask } from "@/api/risk";
export default {
  components: {
    riskNoticeHanfle,
  },
  data() {
    return {
      /** 1:风险提示 2: */
      processType: this.$route.query.processType,
      taskId: this.$route.query.businessNo,
      formId: 0
    }
  },
  mounted() {
    switch (this.processType) {
      case "1": this.riskNotice(); break;
      default: break;
    }
  },
  methods: {
    riskNotice() {
      let _this = this.$refs.riskNoticeHanfle;
      _this.dialog = true;
      _this.dialogLoading = true
      riskNoticeQueryTask(this.taskId, this.formId).then((res) => {
        this.loading = false;
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
          setTimeout(() => {
            _this.dialogLoading = false
          }, 500);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>