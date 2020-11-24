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
      <el-table :data="childTask" size="mini">
        <el-table-column prop="deptName" label="部门" />
        <el-table-column label="填报日期">
          <template slot-scope="{row}">
            <span>{{formatShortDate(row.fillDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="填报人">
          <template slot-scope="{row}">
            <span v-if="row.filler!=null">{{row.fillerName}}[{{row.filler}}]</span>
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
        <el-table-column label="办理人" width="80">
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
        <el-table-column label="审批记录" width="80">
          <template slot-scope="{row}">
            <div v-if="row.comments==null">-</div>
            <el-popover v-else placement="left" width="1000">
              <el-button type="text" slot="reference">详情</el-button>
              <approvalRecord :data="row.comments" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核" width="80">
          <template slot-scope="{row}">
            <span v-if="!row.reviewing">-</span>
            <el-button v-else type="primary" size="mini" @click="doHandle(row)">办理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <fillinForm ref="fillinForm" :data="data" />
    <list2copy ref="list2copy" />
    <handle ref="handle" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import { queryControlListDetail, queryHazards } from '@/api/hazards'
import list2copy from '../list2copy'
import approvalRecord from '../approvalRecord'
import handle from '../handlTo2'
export default {
  components: { fillinForm, list2copy, approvalRecord, handle },
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
    doHandle(row) {
      queryHazards(row.runTaskId, row.formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.runTaskId;
          _this.form.formId = row.formId;
          _this.parentTaskId = row.parentTaskId;
          if (res.obj.step != 4) {
            _this.form.comment = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          }
          _this.form.implementStatus = res.obj.deptMeasure ? (res.obj.deptMeasure.implementStatus || "") : "";
          _this.dialog = true;
        }
      });
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