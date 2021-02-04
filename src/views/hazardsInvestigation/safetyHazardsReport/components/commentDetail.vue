<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
  >
    <el-select v-model="form.noHiddenDanger" placeholder size="mini" style="margin:10px 0" disabled>
      <el-option label="本月有新增" value="0"></el-option>
      <el-option label="本月无新增" value="1"></el-option>
    </el-select>
    <fillinForm ref="fillinForm" :disabled="true" :data="form" v-show="form.noHiddenDanger!=1" />

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import fillinForm from './fillinForm'
import { formatShortDate } from '@/utils/datetime'
export default {
  components: {
    fillinForm,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
    };
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.fillinForm.fillinData = this.form.hiddenDangerControlList;
          this.$refs.fillinForm.titleForm.reportName = this.form.fillerName;
          this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.form.fillDate);
          this.$refs.fillinForm.titleForm.title = this.form.controlListName;
          this.$refs.fillinForm.titleForm.approverName = this.form.approverName;
          this.$refs.fillinForm.titleForm.approveDate = this.formatShortDate(this.form.approveDate);
        })
      }
    }
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.form = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>

