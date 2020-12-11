<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
  >
    <el-form
      ref="form"
      :model="form"
      size="small"
      label-width="80px"
      v-if="type=='safety_risk_notice'"
    >
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
    </el-form>
    <el-form v-else size="mini" label-width="80px">
      <el-form-item label="落实情况">
        <span style="white-space: pre-wrap;">{{form.implementStatus}}</span>
      </el-form-item>
      <el-form-item label="附件">
        <template v-if="form.accessory ? form.accessory.length!=0 : false">
          <div v-for="(item, index) in form.accessory" :key="index">
            <el-link
              type="primary"
              :href="getUrl(item.filePath)"
              target="_blank"
            >{{item.originFileName}}</el-link>
          </div>
        </template>
        <span v-else>未上传附件</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import htmlContent from '@/components/common/htmlContent'
export default {
  components: {
    htmlContent
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
    };
  },
  props: ["type"],
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

