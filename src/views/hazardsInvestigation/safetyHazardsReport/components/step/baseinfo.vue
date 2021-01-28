<template>
  <div>
    <el-form inline class="detail-form">
      <el-row :gutter="16">
        <el-col :span="18" class="full-row">
          <el-form-item label="任务名称">{{data.taskName}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label>
            <el-button type="info" size="mini" @click="showHandleAndApproval">办理&审批记录</el-button>
          </el-form-item>
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
    <handleApproval ref="handleApproval" :statusAndreviewerInfo="statusAndreviewerInfo" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import onlyList from '../hazardsList/onlyList'
import handleApproval from '../cptHandleApproval'
import { queryApproveHistory } from '@/api/hazards'
export default {
  components: { onlyList, handleApproval },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      taskId: "",
      statusAndreviewerInfo: []
    }
  },
  props: ["data"],
  methods: {
    formatShortDate,
    showHistoryList() {
      this.taskId = this.data.id;
      this.$refs.onlyList.dialog = true;
    },
    showHandleAndApproval() {
      // 状态和下一办理人
      let statusAndreviewerInfo = [];
      if (this.data.reviewersInfo != null && this.data.reviewersInfo.length > 0) {
        this.data.reviewersInfo.map(item => {
          statusAndreviewerInfo.push({
            status: this.data.status,
            ...item
          })
        })
      } else {
        statusAndreviewerInfo.push({
          status: this.data.status,
        })
      }
      this.statusAndreviewerInfo = statusAndreviewerInfo;

      let _this = this.$refs.handleApproval;
      _this.dialog = true;
      _this.tbLoading = true;
      queryApproveHistory(this.data.id).then(res => {
        _this.tbLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
        }
      })
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