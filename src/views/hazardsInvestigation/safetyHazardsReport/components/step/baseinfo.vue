<template>
  <div>
    <el-form inline class="detail-form">
      <el-row>
        <el-col :span="24" class="full-row">
          <el-form-item label="任务名称">{{data.taskName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="反馈日期">{{formatShortDate(data.dueDate)}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="月份">{{data.month}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门">{{data.deptName}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下发人">{{data.founderName}}[{{data.founder}}]</el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="附件">
            <ul class="file-ul">
              <li v-for="item in data.acc" :key="item.id">
                <el-link
                  type="primary"
                  :href="baseApi+item.filePath"
                  target="_blank"
                >{{item.originFileName}}</el-link>
              </li>
            </ul>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="管控清单">
            <el-button type="text" @click="showHistoryList">查询历史管控清单</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <onlyList ref="onlyList" :taskId="taskId" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import onlyList from '../hazardsList/onlyList'
export default {
  components: { onlyList, },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      taskId: ""
    }
  },
  props: ["data"],
  methods: {
    formatShortDate,
    showHistoryList() {
      this.taskId = this.data.id;
      this.$refs.onlyList.dialog = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.file-ul {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>