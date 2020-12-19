<template>
  <div>
    <info :data="data" :form="form" :assessmentType="assessmentType" :source="source" />
    <el-card>
      <el-radio-group v-model="form.processFlag">
        <el-radio label="1">同意</el-radio>
        <el-radio label="2">驳回</el-radio>
      </el-radio-group>
      <el-input class="com" v-model="form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
    </el-card>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import info from './step1';
export default {
  components: {
    info,
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    form: {
      type: Object,
      default: () => { }
    },
    assessmentType: {
      type: String,
      default: ""
    },
    source: {
      type: String,
      default: ""
    }
  },
  methods: {
    formatShortDate,
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
  .com {
    margin-top: 8px;
  }
}
</style>