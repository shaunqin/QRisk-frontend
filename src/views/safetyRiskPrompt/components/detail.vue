<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
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
      <el-form-item label="安全风险">
        <span style="white-space: pre-wrap;">{{form.existingRisk}}</span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;">{{form.background}}</span>
      </el-form-item>
      <el-form-item label="风险防范">
        <ul class="measuresVos">
          <li v-for="(item,index) in data" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeDetail } from "@/api/risk";
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      data: [],
    };
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  watch: {
    id(val) {
      if (!!val) {
        riskNoticeDetail(val).then((res) => {
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            this.form = res.obj;
            this.data = res.obj.measuresVos;
          }
        });
      }
    },
  },
  methods: {
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

