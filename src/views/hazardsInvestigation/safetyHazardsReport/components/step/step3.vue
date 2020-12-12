<template>
  <div>
    <el-card header="详情">
      <baseinfo :data="data" />
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
import baseinfo from './baseinfo'
export default {
  components: { fillinForm, approvalRecord, childTask, baseinfo },
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