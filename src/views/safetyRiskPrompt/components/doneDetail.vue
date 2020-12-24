<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="已办详情"
    custom-class="big_dialog"
    v-loading="dialogLoading"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-form ref="form" size="small" label-width="80px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围">{{data.applyScope}}</el-form-item>
      <el-form-item label="主题">{{data.title}}</el-form-item>
      <el-form-item label="背景">
        <htmlContent :html="data.background" />
      </el-form-item>
      <el-form-item label="安全风险">
        <htmlContent :html="data.existingRisk" />
      </el-form-item>
      <el-form-item label="风险防范" v-if="data.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in data.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="部门措施">
        <childMeasures :data="data.deptsMeasures" :hiddenField="['审核']" />
      </el-form-item>
      <el-form-item label="风险提示处理记录" v-if="noticeComments.length>0">
        <leaderApprvalRecord
          key="leaderApprvalRecord"
          :data="noticeComments"
          type="safety_risk_notice"
        />
      </el-form-item>
      <el-form-item key="reviewerInfo" label="办理人" v-if="reviewerInfo.length>0">
        <transactor :data="reviewerInfo" width="100%" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { format } from '@/utils/datetime'
import childMeasures from './childMeasures'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
import transactor from '@/components/common/transactor'
export default {
  components: { childMeasures, leaderApprvalRecord, htmlContent, transactor },
  data() {
    return {
      dialog: false,
      dialogLoading:false,
      data: {}
    };
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      }
      return []
    },
    childMeasures() {
      if (this.data.childMeasures) {
        return this.data.childMeasures;
      }
      return []
    },
    reviewerInfo() {
      if (this.data.reviewerInfo) {
        return this.data.reviewerInfo;
      }
      return []
    }
  },
  mounted() { },
  methods: {
    format,
    success(res) {
      console.log(res);
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    }
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