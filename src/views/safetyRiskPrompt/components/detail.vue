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
        <span style="white-space: pre-wrap;">{{form.existingRisk}}</span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;">{{form.background}}</span>
      </el-form-item>
      <el-form-item label="风险防范" v-if="form.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in form.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="下发措施" v-if="form.firstLevelMeasure!=null">
        <el-table :data="form.firstLevelMeasure">
          <el-table-column label="内容" prop="content" />
          <el-table-column label="截止日期" prop="deadline" />
          <el-table-column label="部门" prop="deptName" />
          <el-table-column label="上报人">
            <template slot-scope="{row}" v-if="row.filler">{{row.fillerName}}[{{row.filler}}]</template>
          </el-table-column>
          <el-table-column label="落实情况" prop="implementStatus" />
          <el-table-column label="附件预览" >
            <template slot-scope="{row}">
              <el-link
                type="primary"
                v-if="row.accessory!=null"
                :href="getUrl(row.accessory.filePath)"
                target="_blank"
              >{{row.accessory.originFileName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="{row}">
              <span v-if="row.status==0">待填</span>
              <span v-if="row.status==1">待填</span>
              <span v-if="row.status==2">待审核</span>
              <span v-if="row.status==3">通过</span>
              <span v-if="row.status==4">驳回</span>
            </template>
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
export default {
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

