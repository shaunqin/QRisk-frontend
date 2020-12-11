<template>
  <div>
    <el-card header="详情">
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
        </el-row>
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
      </el-form>
    </el-card>
    <el-card header="下发任务" key="childTask" v-if="childTask.length>0">
      <childTask :data="childTask" :hiddenField="['审核']" />
    </el-card>
    <el-card header="审批记录" key="comments" v-if="comments.length>0">
      <approvalRecord :data="comments" />
    </el-card>
    <fillinForm ref="fillinForm" :data="data" />
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import approvalRecord from '../approvalRecord'
import childTask from '../childTask'
export default {
  components: { fillinForm, approvalRecord, childTask },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    form: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    data() {
      this.loadData();
    }
  },
  computed: {
    childTask() {
      if (this.data.childTask == null) {
        return []
      } else {
        return this.data.childTask
      }
    },
    comments() {
      if (this.data.comments == null) {
        return []
      } else {
        return this.data.comments
      }
    },
  },
  mounted() { 
    this.loadData();
   },
  methods: {
    formatShortDate,
    format,
    loadData() {
      this.$refs.fillinForm.fillinData = this.data.deptControlList.hiddenDangerControlList;
      this.$refs.fillinForm.titleForm.reportName = this.data.deptControlList.fillerName;
      this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.data.deptControlList.fillDate);
      this.$refs.fillinForm.titleForm.title = this.data.controlListName;
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
.el-card + .el-card {
  margin-top: 20px;
}
</style>