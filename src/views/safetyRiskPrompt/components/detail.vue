<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
    v-loading="dialogLoading"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-form ref="form" :model="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">{{form.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{form.issuerName}}[{{form.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围">{{form.applyScope}}</el-form-item>
      <el-form-item label="主题">{{form.title}}</el-form-item>
      <el-form-item label="背景">
        <htmlContent :html="form.background" />
      </el-form-item>
      <el-form-item label="安全风险">
        <htmlContent :html="form.existingRisk" />
      </el-form-item>
      <el-form-item label="风险防范" v-if="form.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in form.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="附件">
        <ul class="measuresVos">
          <li v-for="(item,index) in files" :key="index">
            <el-link
              type="primary"
              :underline="false"
              :href="baseApi+item.filePath"
              target="_blank"
            >{{item.originFileName}}</el-link>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="下发措施" v-if="form.firstLevelMeasure!=null">
        <childMeasures :data="form.firstLevelMeasure" :source="fullscreen?'smart':'myIssued'" />
      </el-form-item>
      <el-form-item label="处理记录" v-if="noticeComments.length>0">
        <leaderApprvalRecord
          key="leaderApprvalRecord"
          :data="noticeComments"
          type="safety_risk_notice"
        />
      </el-form-item>
      <el-form-item label="办理人" v-if="form.reviewerInfo!=null">
        <transactor :data="form.reviewerInfo" width="100%" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="primary" @click="cancel">取消</el-button>
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeDetail } from "@/api/risk";
import childMeasures from './childMeasures'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
import transactor from '@/components/common/transactor'
export default {
  components: { childMeasures, leaderApprvalRecord, htmlContent, transactor },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogLoading: false,
      form: {},
      files: [],
      baseApi: process.env.VUE_APP_BASE_API
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
      if (this.form.noticeComments) {
        return this.form.noticeComments;
      }
      return []
    },
  },
  methods: {
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

