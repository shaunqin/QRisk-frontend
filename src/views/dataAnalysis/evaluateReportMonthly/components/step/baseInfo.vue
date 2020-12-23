<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form-item label="编号">{{data.no}}</el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="年份">{{`${data.year}-${data.month}`}}</el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="拟制人">{{data.issueName}}[{{data.issuer}}]</el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label-width="0">
          <el-link
            v-if="data.filePath"
            type="primary"
            target="_blank"
            :href="baseUrl+data.filePath"
          >{{data.fileName}}</el-link>
          <el-button type="primary" size="mini" v-if="noticeEnable" @click="noticeManager">提醒风险管理员办理</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { riskControlrNoticeRiskManger } from '@/api/risk'
export default {
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  computed: {
    noticeEnable() {
      if (this.data.hiddenFill && (this.data.childRiskControlExpVoList == null || this.data.childRiskControlExpVoList.length == 0) && this.data.step == 3) {
        return true;
      } return false;
    }
  },
  methods: {
    noticeManager() {
      this.$parent.$parent.$refs.selectManager.dialog = true;
    },
  }
}
</script>

<style lang="scss" scoped>
</style>