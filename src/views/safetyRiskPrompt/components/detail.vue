<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
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
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="form.existingRisk"></span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="form.background"></span>
      </el-form-item>
      <el-form-item label="风险防范" v-if="form.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in form.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="下发措施" v-if="form.firstLevelMeasure!=null">
        <childMeasures :data="form.firstLevelMeasure" source="myIssued" />
      </el-form-item>
      <el-form-item label="办理人" v-if="form.reviewerInfo!=null">
        <el-table :data="form.reviewerInfo" size="mini">
          <el-table-column label="任务名称" prop="taskName"></el-table-column>
          <el-table-column label="分配人" width="135">
            <template slot-scope="{row}">{{row.name||"-"}}</template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="{row}">{{row.groupName||"-"}}</template>
          </el-table-column>
          <el-table-column label="候选人">
            <template slot-scope="{row}">{{row.users||"-"}}</template>
          </el-table-column>
        </el-table>
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
import childMeasures from './childMeasures'
export default {
  components: { childMeasures },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
    };
  },
  props: {
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

