<template>
  <div>
    <el-card header="详情">
      <baseinfo :data="data" />
    </el-card>
    <el-card header="下发任务" key="childTask" v-if="childTask.length>0">
      <childTask :data="childTask" :hiddenField="[]" :source="fullscreen?'smart':''" />
    </el-card>
    <el-select v-model="form.noHiddenDanger" placeholder size="mini" style="margin:10px 0">
      <el-option label="本月有新增" value="0"></el-option>
      <el-option label="本月无新增" value="1"></el-option>
    </el-select>
    <fillinForm ref="fillinForm" :data="data" v-if="form.noHiddenDanger!=1" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import childTask from '../childTask'
import baseinfo from './baseinfo'
export default {
  components: { fillinForm, childTask, baseinfo },
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
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    childTask() {
      if (this.data.childTask == null) {
        return []
      } else {
        return this.data.childTask
      }
    }
  },
  methods: {
    formatShortDate,
    showList(row) {
      queryControlListDetail(row.taskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.list2copy;
          _this.tbSource = res.obj.hiddenDangerControlList;
          _this.dialog = true;
        }
      })
    },
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