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
        <el-table-column label="办理人">
          <template slot-scope="{row}">
            <div v-if="row.reviewerInfo==null">-</div>
            <el-popover v-else placement="left" width="800">
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
        <el-table-column label="管控清单" width="100">
          <template slot-scope="{row}">
            <el-button type="info" size="mini" @click="showList(row)">查看</el-button>
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
      </el-table>
    </el-card>
    <el-card header="审批记录" key="comments" v-if="comments.length>0">
      <approvalRecord :data="comments" />
    </el-card>
    <el-card header="办理人" key="reviewersInfo" v-if="reviewersInfo.length>0">
      <el-table :data="reviewersInfo" size="mini">
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
    </el-card>

    <fillinForm
      v-if="data.deptControlList!=null&&data.deptControlList.hiddenDangerControlList.length>0"
      ref="fillinForm"
      :disabled="true"
      :data="data"
      key="fillinForm"
    />

    <detailFillin
      ref="detailFillin"
      :data="detailData"
      :fillinData="detailFillinData"
      key="detailFillin"
    />
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import { queryControlListDetail } from '@/api/hazards'
import approvalRecord from '@/views/hazardsInvestigation/safetyHazardsReport/components/approvalRecord';
import fillinForm from '@/views/hazardsInvestigation/safetyHazardsReport/components/fillinForm';
import detailFillin from '@/views/hazardsInvestigation/safetyHazardsReport/components/detailFillin';
export default {
  components: { approvalRecord, detailFillin, fillinForm },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      detailData: {},
      detailFillinData: []
    }
  },
  props: ["data"],
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
    reviewersInfo() {
      if (this.data.reviewersInfo == null) {
        return []
      } else {
        return this.data.reviewersInfo
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.loadData();
      }
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    formatShortDate,
    format,
    showList(row) {
      queryControlListDetail(row.taskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detailFillin;
          this.detailData = res.obj;
          this.detailFillinData = res.obj.hiddenDangerControlList;
          _this.dialog = true;
        }
      })
    },
    loadData() {
      this.$nextTick(() => {
        if (this.data.deptControlList && this.$refs.fillinForm) {
          this.$refs.fillinForm.fillinData = this.data.deptControlList.hiddenDangerControlList;
          this.$refs.fillinForm.titleForm.reportName = this.data.deptControlList.fillerName;
          this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.data.deptControlList.fillDate);
          this.$refs.fillinForm.titleForm.title = this.data.controlListName;
          this.$refs.fillinForm.titleForm.approverName = this.data.deptControlList.approverName;
          this.$refs.fillinForm.titleForm.approveDate = this.formatShortDate(this.data.deptControlList.approveDate);
        }
      })
    },
  },
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