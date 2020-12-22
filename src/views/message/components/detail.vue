<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
  >
    <hiddenDanger v-if="msgType=='hidden_danger_control'" ref="hiddenDanger" :data="data" />
    <safetyRiskPrompt v-if="msgType=='safety_risk_notice'" ref="safetyRiskPrompt" :data="data" />
    <specialRiskNote v-if="msgType=='special_risk_note'" ref="specialRiskNote" :data="data" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import hiddenDanger from './hiddenDanger';
import safetyRiskPrompt from './safetyRiskPrompt';
import specialRiskNote from './specialRiskNote';
export default {
  components: { hiddenDanger, safetyRiskPrompt, specialRiskNote },
  data() {
    return {
      loading: false,
      dialog: false,
      data: {}, // 父组件赋值
    }
  },
  props: ["msgType"],
  methods: {
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.data = {};
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.file-ul {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}

.el-card + .el-card {
  margin-top: 20px;
}
</style>