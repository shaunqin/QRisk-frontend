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
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{ data.no }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年份">{{ `${data.year}-${data.month}` }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="拟制人">{{ data.issueName }}[{{ data.issuer }}]</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-link
              v-if="data.filePath"
              type="primary"
              target="_blank"
              :href="baseUrl+data.filePath"
            >{{data.fileName}}</el-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题">{{ data.title }}</el-form-item>
      <el-form-item label="风险措施">
        <cmpRiskControl :data="data.riskControlExpVoList||[]" :measuresEnable="measuresEnable" />
      </el-form-item>
      <!-- 下发记录 -->
      <el-form-item label="下发记录">
        <cmpIssueRecord :data="data.treeDataList" />
      </el-form-item>
      <!-- 审批记录 -->
      <el-form-item label="审批记录" key="apprvalRecord" v-if="noticeComments.length > 0">
        <apprvalRecord :data="noticeComments" />
      </el-form-item>
      <!-- 下发措施 -->
      <el-form-item key="childRisk" label="下发措施" v-if="childRisk.length > 0">
        <childRisk :data="childRisk" />
      </el-form-item>
      <!-- 落实情况 -->
      <el-form-item key="riskMeasuresExpVoList" label="落实情况" v-if="riskMeasuresExpVoList.length>0">
        <cmpImplement :data="riskMeasuresExpVoList" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from "@/utils/datetime";
import childRisk from "./childRisk";
import apprvalRecord from "./apprvalRecord";
import cmpRiskControl from './cmpRiskControl'
import cmpImplement from './cmpImplement'
import cmpIssueRecord from './cmpIssueRecord'
export default {
  components: { childRisk, apprvalRecord, cmpRiskControl, cmpImplement, cmpIssueRecord },
  data() {
    return {
      dialog: false,
      dialogLoading: false,
      data: {},
      baseUrl: process.env.VUE_APP_BASE_API,
    };
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    childRisk() {
      if (this.data.childRiskControlExpVoList) {
        return this.data.childRiskControlExpVoList;
      }
      return [];
    },
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      } else {
        return [];
      }
    },
    riskMeasuresExpVoList() {
      if (this.data.riskControlMeasuresVoList) {
        return this.data.riskControlMeasuresVoList
      } return []
    },
    measuresEnable() {
      try {
        return this.data.deptRisk.tag == '1'
      } catch (e) {
        return false
      }
    },
  },
  mounted() { },
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
    },
  },
};
</script>

<style lang="scss" scoped>
.ul-risk {
  list-style: decimal;
  text-align: left;
  margin: 0;
}
</style>
