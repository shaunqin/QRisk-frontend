<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="任务详情"
    custom-class="big_dialog"
  >
    <fillinForm ref="fillinForm" :disabled="true" :data="data" key="fillinForm" />

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import fillinForm from './fillinForm'
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { fillinForm, },
  data() {
    return {
      loading: false,
      dialog: false,
    }
  },
  props: ["data", "fillinData"],
  watch: {
    fillinData: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.fillinForm.fillinData = this.fillinData;
          this.$refs.fillinForm.titleForm.reportName = this.data.fillerName;
          this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.data.fillDate);
          this.$refs.fillinForm.titleForm.title = this.data.controlListName;
          this.$refs.fillinForm.titleForm.approverName = this.data.approverName;
          this.$refs.fillinForm.titleForm.approveDate = this.formatShortDate(this.data.approveDate);
        })
      }
    }
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    }
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