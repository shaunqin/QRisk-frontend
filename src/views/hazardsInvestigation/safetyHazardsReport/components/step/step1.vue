<template>
  <div>
    <el-card header="详情">
      <div slot="header" class="cd-header">
        详情
        <el-button
          class="right"
          type="primary"
          size="mini"
          v-if="noticeEnable"
          @click="noticeManager"
        >提醒风险管理员办理</el-button>
      </div>
      <baseinfo :data="data" />
    </el-card>
    <el-card header="下发任务" key="childTask" v-if="childTask.length>0">
      <childTask :data="childTask" :hiddenField="[]" :source="fullscreen?'smart':''" />
    </el-card>
    <el-select
      v-model="form.noHiddenDanger"
      placeholder
      size="mini"
      style="margin:10px 0"
      v-if="!hiddenFill"
    >
      <el-option label="本月有新增" value="0"></el-option>
      <el-option label="本月无新增" value="1"></el-option>
    </el-select>
    <fillinForm ref="fillinForm" :data="data" v-if="form.noHiddenDanger!=1&&!hiddenFill" />
    <selectManager ref="selectManager" :deptPath="data.deptPath" @on-submit="doSubmit" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import childTask from '../childTask'
import baseinfo from './baseinfo'
import selectManager from '@/components/common/selectManager'
import { noticeRiskManger } from '@/api/risk'
export default {
  components: { fillinForm, childTask, baseinfo, selectManager },
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
    },
    /** 填报开关,领导不需要填报 */
    hiddenFill() {
      return this.data.hiddenFill
    },
    noticeEnable() {
      if (this.hiddenFill && this.childTask.length == 0) {
        return true;
      } return false;
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
    noticeManager() {
      this.$refs.selectManager.dialog = true;
    },
    doSubmit(params) {
      params.id = this.data.id;
      console.log(params)
      noticeRiskManger(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提醒发送成功");
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
.el-card + .el-card {
  margin-top: 20px;
}
.cd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>