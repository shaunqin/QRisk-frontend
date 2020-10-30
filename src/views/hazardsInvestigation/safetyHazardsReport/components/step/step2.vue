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
      </el-table>
    </el-card>

    <fillinForm ref="fillinForm" :disabled="disabled" :data="data" />
    <el-card>
      <el-radio-group v-model="form.processFlag">
        <el-radio label="1">同意</el-radio>
        <el-radio label="2">驳回</el-radio>
      </el-radio-group>
      <el-input
        v-model="form.comment"
        type="textarea"
        rows="3"
        placeholder="请输入备注"
        style="margin-top:10px"
      ></el-input>
    </el-card>
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import dictSelect from '@/components/common/dictSelect'
export default {
  components: { fillinForm, dictSelect },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      disabled: true,
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
    _form() {
      return this.form
    }
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

.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
/deep/ .is-disabled {
  color: #000;
}
</style>