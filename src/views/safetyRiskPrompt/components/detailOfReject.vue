<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="驳回详情"
  >
    <el-form ref="form" size="small" label-width="80px" label-position="left">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="部门">{{data.deptName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期">{{data.deadline}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下发人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="填报人">{{data.fillerName}}[{{data.filler}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容">{{data.content}}</el-form-item>
      <el-form-item label="落实情况">{{data.implementStatus}}</el-form-item>

      <el-form-item label="附件">
        <ul class="measuresVos">
          <li v-for="(item,index) in data.accessory" :key="index">
            <el-link
              type="primary"
              :underline="false"
              :href="baseApi+item.filePath"
              target="_blank"
            >{{item.originFileName}}</el-link>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { format } from '@/utils/datetime'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
import transactor from '@/components/common/transactor'
export default {
  components: { leaderApprvalRecord, htmlContent, transactor },
  data() {
    return {
      dialog: false,
      dialogLoading: false,
      data: {},
      files: [],
      baseApi: process.env.VUE_APP_BASE_API
    };
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