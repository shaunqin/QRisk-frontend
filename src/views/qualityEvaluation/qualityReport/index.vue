<template>
  <div class="app-container">
    <eform ref="form" :isAdd="isAdd" />
    <approval ref="approval" :isApprove="isApprove" />
    <div class="head-container">
      <search />
      <!-- <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新增</el-button> -->
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" :stripe="true" style="width: 100%;">
      <el-table-column type="index" width="50" />
      <el-table-column prop="taskNo" label="编号" />
      <el-table-column prop="taskName" label="名称" min-width="130" />
      <el-table-column prop="departmentName" label="部门" />
      <el-table-column prop="year" label="年度" />
      <el-table-column prop="month" label="月度" />
      <el-table-column label="截止日期">
        <template slot-scope="{row}">{{formatShortDate(row.dueDate)}}</template>
      </el-table-column>
      <el-table-column prop="productValue" label="产品">
        <template slot-scope="{row}">
          <span v-if="row.productValue == '1'">定检产品</span>
          <span v-if="row.productValue == '2'">发动机/APU产品</span>
          <span v-if="row.productValue == '3'">附件修理产品</span>
          <span v-if="row.productValue == '4'">航线维修产品</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button-group v-if="scope.row.status==2">
            <el-button size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-view" @click="view(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" @click="subDelete(scope.row.id)"></el-button>
          </el-button-group>
          <el-button-group v-if="scope.row.status==3 && onlyLeader">
            <el-button
              size="mini"
              type="primary"
              @click="approval(scope.row)"
            >审批</el-button>
            <el-button size="mini" @click="view(scope.row)">详情</el-button>
          </el-button-group>
          <el-button v-if="scope.row.status!=2 && !(scope.row.status==3 && onlyLeader)" size="mini" icon="el-icon-view" @click="view(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import initData from "@/mixins/initData";
import { formatShortDate } from "@/utils/datetime";
import eform from "./components/form";
import approval from "./components/approval";
import { monthTaskDetail, fillInMonthTask } from '@/api/quality'
import search from './components/search'
export default {
  components: { eform, search, approval },
  mixins: [initData],
  data() {
    return {
      isApprove: true
    };
  },
  computed: {
    ...mapGetters(["roles"]),
    onlyLeader() {
      if ((this.roles.length == 2 || this.roles.length > 2) && this.roles.includes('QUALITY_EVALUATION_FEEDBACK_LEADER')) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/task_mgr/query/monthTask/pageList/${this.page}/${this.size}`;
      this.params = { noStatus: 1, type: 2, ...this.params };
      return true;
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      monthTaskDetail(row.monthTaskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          const { obj } = res;
          _this.product = obj.productValue;
          _this.fillInDate = formatShortDate(obj.fillInDate);
          _this.monthTaskId = obj.monthTaskId;
          _this.params = obj.params || {};
          if(obj.year >= 2020 && obj.month >= 10) {
            _this.isNew = true
          } else {
            _this.isNew = false
          }
          _this.dialog = true;
        }
      })
    },
    subDelete(id) { },
    view(row) {
      this.isApprove = false
      let _this = this.$refs.approval;
      monthTaskDetail(row.monthTaskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          const { obj } = res;
          _this.product = obj.productValue;
          _this.fillInDate = formatShortDate(obj.fillInDate);
          _this.monthTaskId = obj.monthTaskId;
          _this.params = obj.params || {};
          if(obj.year >= 2020 && obj.month >= 10) {
            _this.isNew = true
          } else {
            _this.isNew = false
          }
          _this.dialog = true;
        }
      })
    },
    approval(row) {
      this.isApprove = true
      let _this = this.$refs.approval;
      monthTaskDetail(row.monthTaskId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          const { obj } = res;
          _this.product = obj.productValue;
          _this.fillInDate = formatShortDate(obj.fillInDate);
          _this.monthTaskId = obj.monthTaskId;
          _this.params = obj.params || {};
          if(obj.year >= 2020 && obj.month >= 10) {
            _this.isNew = true
          } else {
            _this.isNew = false
          }
          _this.dialog = true;
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 20px;
}
</style>