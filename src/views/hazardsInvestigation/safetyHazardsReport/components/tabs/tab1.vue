<template>
  <div>
    <div class="head-container">
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-plus"
        @click="add"
      >新建任务</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="index" width="50" :index="getIndex" />
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column label="任务类型">
        <template slot-scope="{row}">
          <span v-if="row.taskType==1">年度任务</span>
          <span v-if="row.taskType==2">月度任务</span>
        </template>
      </el-table-column>
      <el-table-column prop="dueDate" label="反馈时间" />
      <el-table-column label="安全隐患管控清单">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showHazardsList(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="安全隐患统计表">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showHazardsStatistics(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span v-if="row.taskType==2">
            <span v-if="row.status==1">初始化</span>
            <span v-if="row.status==2">待完成</span>
            <span v-if="row.status==3">待完成</span>
            <span v-if="row.status==4">待完成</span>
            <span v-if="row.status==5">已完成</span>
            <span v-if="row.status==6">待完成</span>
            <span v-if="row.status==7">已取消</span>
          </span>
          <span v-else>
            <span v-if="row.status==1">初始化</span>
            <span v-if="row.status==2">待完成</span>
            <span v-if="row.status==3">已完成</span>
            <span v-if="row.status==4">已取消</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" @click="subDelete(scope.row.id)"></el-button>
            <el-button size="mini">取消任务</el-button>
          </el-button-group>
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
    <task ref="task" :is-add="isAdd" />
    <hazardsList ref="hazardsList" :taskId="taskId" :type="type" />
  </div>
</template>

<script>
import { detail } from "@/api/hazards";
import task from '../task';
import initData from "@/mixins/initData";
import hazardsList from '../hazardsList/list'
export default {
  mixins: [initData],
  components: { task, hazardsList },
  data() {
    return {
      taskId: "",
      type: ""
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/query/pageList/${this.page}/${this.size}`;
      return true;
    },
    add() {
      this.isAdd = true;
      this.$refs.task.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.task;
      detail(row.id, row.taskType).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = obj;
          _this.form2 = obj.dueDates;
          _this.files = obj.acc;
          _this.dialog = true;
        }
      })
    },
    showHazardsList(row) {
      this.taskId = row.id;
      this.type = row.taskType;
      this.$refs.hazardsList.dialog = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>