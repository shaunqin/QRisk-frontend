<template>
  <div class="app-container">
    <div class="head-container">
      <el-form :model="form" size="mini" inline v-if="tabIndex==1">
        <el-form-item label="任务名称">
          <el-input v-model="form.taskName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="form.taskType" style="width:130px" clearable>
            <el-option label="年度任务" value="1"></el-option>
            <el-option label="月度任务" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈时间">
          <el-date-picker
            key="month"
            v-model="form.date"
            value-format="yyyy-MM"
            type="month"
            style="width:130px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status2" style="width:130px" clearable>
            <el-option label="初始化" value="0"></el-option>
            <el-option label="待完成" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="form" size="mini" inline v-else>
        <el-form-item label="任务名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input v-model="form.starter"></el-input>
        </el-form-item>
        <el-form-item label="发起时间">
          <el-date-picker
            key="daterange"
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            style="width:230px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="已下发" name="1">
        <tab1 v-if="tabIndex==1" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane name="2">
        <el-badge slot="label" :value="count" class="item" :hidden="!count">
          <span>待办</span>
        </el-badge>
        <tab2 v-if="tabIndex==2" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="3">
        <tab3 v-if="tabIndex==3" :queryForm="queryForm" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1'
import tab2 from './components/tabs/tab2'
import tab3 from './components/tabs/tab3'
import { queryTodoCount } from '@/api/hazards'
export default {
  components: { tab1, tab2, tab3 },
  data() {
    return {
      isAdd: false,
      query: '',
      tabIndex: '1',
      form: {},
      queryForm: {},
      date: "",
      count: 0
    };
  },
  created() {
    queryTodoCount().then(res => {
      if (res.code != '200') {
        this.$message.error(res.msg);
      } else {
        this.count = res.obj;
      }
    })
  },
  watch: {
    tabIndex() {
      this.form = {};
      this.toQuery();
    },
    date(val) {
      if (val) {
        this.form.startTime = val[0];
        this.form.endTime = val[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    }
  },
  methods: {
    toQuery() {
      this.queryForm = Object.assign({}, this.form);
    }
  },
};
</script>

<style lang="scss" scoped>
// .head-container {
//   margin-bottom: 10px;
// }

/deep/ .el-badge__content.is-fixed {
  top: 10px;
}
</style>