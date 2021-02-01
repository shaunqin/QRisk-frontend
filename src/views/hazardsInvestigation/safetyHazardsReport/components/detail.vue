<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="任务详情"
    custom-class="big_dialog"
    v-loading="dialogLoading"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-card header="详情">
      <bsseinfo :data="data" />
    </el-card>

    <el-card header="下发任务" key="childTask" v-if="childTask.length>0">
      <childTask :data="childTask" :hiddenField="['审核']" :readonly="true" />
    </el-card>
    <!-- <el-card header="审批记录" key="comments" v-if="comments.length>0">
      <approvalRecord :data="comments" />
    </el-card>-->
    <!-- <el-card header="办理人" key="reviewersInfo" v-if="reviewersInfo.length>0">
      <transactor :data="reviewersInfo" width="100%" />
    </el-card>-->

    <fillinForm
      v-if="data.deptControlList!=null&&data.deptControlList.hiddenDangerControlList.length>0"
      ref="fillinForm"
      :disabled="true"
      :data="data"
      key="fillinForm"
    />
    <detailFillin
      ref="detailFillin"
      :data="detailData"
      :fillinData="detailFillinData"
      key="detailFillin"
    />

    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="primary" @click="cancel">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import fillinForm from './fillinForm'
import detailFillin from './detailFillin'
import approvalRecord from './approvalRecord'
import childTask from './childTask'
import transactor from '@/components/common/transactor'
import bsseinfo from './step/baseinfo'
export default {
  components: { fillinForm, detailFillin, approvalRecord, childTask, transactor, bsseinfo },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogLoading: false,
      data: {}, // 父组件赋值
      baseApi: process.env.VUE_APP_BASE_API,
      detailData: {},
      detailFillinData: [],
      statusAndreviewerInfo: []
    }
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    childTask() {
      if (this.data.childTask == null) {
        return []
      } else {
        return this.data.childTask
      }
    },
    comments() {
      if (this.data.comments == null) {
        return []
      } else {
        return this.data.comments
      }
    },
    reviewersInfo() {
      if (this.data.reviewersInfo == null) {
        return []
      } else {
        return this.data.reviewersInfo
      }
    }
  },
  watch: {
    data() {
      this.loadData();
    }
  },
  methods: {
    formatShortDate,
    format,
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    loadData() {
      this.$nextTick(() => {
        if (this.data.deptControlList && this.$refs.fillinForm) {
          this.$refs.fillinForm.fillinData = this.data.deptControlList.hiddenDangerControlList;
          this.$refs.fillinForm.titleForm.reportName = this.data.deptControlList.fillerName;
          this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.data.deptControlList.fillDate);
          this.$refs.fillinForm.titleForm.title = this.data.controlListName;
          this.$refs.fillinForm.titleForm.approverName = this.data.deptControlList.approverName;
          this.$refs.fillinForm.titleForm.approveDate = this.formatShortDate(this.data.deptControlList.approveDate);
        }
      })
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
/deep/ .el-card__header {
  padding: 10px 20px;
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>