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
            <el-form-item label="发起人">{{data.founderName}}[{{data.founder}}]</el-form-item>
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
      <el-table :data="childTask" size="mini">
        <el-table-column prop="deptName" label="部门" />
        <el-table-column label="填报日期">
          <template slot-scope="{row}">
            <span>{{formatShortDate(row.fillDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="填报人">
          <template slot-scope="{row}">
            <span v-if="row.filler!=null">{{row.fillerName}}[{{row.filler}}}]</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <span v-if="row.status==2">待办</span>
            <span v-if="row.status==3">待办</span>
            <span v-if="row.status==4">已填报</span>
            <span v-if="row.status==5">通过</span>
            <span v-if="row.status==6">驳回</span>
            <span v-if="row.status==7">取消</span>
          </template>
        </el-table-column>
        <el-table-column label="管控清单" width="100">
          <template slot-scope="{row}">
            <el-button type="info" size="mini" @click="showList(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="办理人">
          <template slot-scope="{row}">
            <div v-if="row.reviewerInfo==null">-</div>
            <el-popover v-else placement="left" width="1000">
              <el-button type="text" slot="reference">详情</el-button>
              <el-table :data="row.reviewerInfo" size="mini">
                <el-table-column label="任务名称" prop="taskName"></el-table-column>
                <el-table-column label="分配人" width="135">
                  <template slot-scope="{row}">{{row.name||"-"}}</template>
                </el-table-column>
                <el-table-column label="角色">
                  <template slot-scope="{row}">{{row.groupName||"-"}}</template>
                </el-table-column>
                <el-table-column label="候选人">
                  <template slot-scope="{row}">{{row.users||"-"}}</template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card header="审批记录" key="comments" v-if="comments.length>0">
      <el-table :data="comments" size="mini">
        <el-table-column label="审批人">
          <template slot-scope="{row}">
            <span>{{row.name}}[{{row.sqlUserId}}}]</span>
          </template>
        </el-table-column>
        <el-table-column label="审批日期">
          <template slot-scope="{row}">
            <span>{{format(row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="结果">
          <template slot-scope="{row}">
            <span v-if="row.processFlag==1">同意</span>
            <span v-if="row.processFlag==2">驳回</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <fillinForm ref="fillinForm" :data="data" />
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import fillinForm from '../fillinForm'
export default {
  components: { fillinForm, },
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
  mounted() { this.loadData(); },
  methods: {
    formatShortDate,
    format,
    showList(row) { },
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