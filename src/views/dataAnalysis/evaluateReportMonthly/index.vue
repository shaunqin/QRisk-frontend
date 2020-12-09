<template>
  <div class="app-container">
    <div class="head-container"></div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane name="1" label="全部">
        <tab1 v-if="tabIndex=='1'" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane name="2" label="草稿">
        <tab2 v-if="tabIndex=='2'" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane name="3" label="我拟制的">
        <tab3 v-if="tabIndex=='3'" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane name="4">
        <el-badge slot="label" :value="count" class="item" :hidden="!count">
          <span>待办</span>
        </el-badge>
        <tab4 v-if="tabIndex=='4'" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane name="5" label="已办">
        <tab5 v-if="tabIndex=='5'" :queryForm="queryForm" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1';
import tab2 from './components/tabs/tab2';
import tab3 from './components/tabs/tab3';
import tab4 from './components/tabs/tab4';
import tab5 from './components/tabs/tab5';
import { riskControlQueryTodoCount } from '@/api/risk'
import department from '@/components/Department'
export default {
  components: { tab1, tab2, tab3,tab4, tab5,
  //   department 
  },
  data() {
    return {
      selections: [],
      type: "",
      options: [
        { name: "流程/标准", type: 1 },
        { name: "变革管理", type: 2 },
        { name: "维修能力", type: 3 },
        { name: "航站审定", type: 4 },
        { name: "关键风险", type: 5 },
        { name: "全员风险", type: 6 },
        { name: "其他评估", type: 7 },
      ],
      tabIndex: "1",
      count: 0,
      queryForm: {},
      form: {
        no: "", title: "", responsePath: null
      },
      date: ""
    };
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startTime = val[0];
        this.form.endTime = val[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    tabIndex() {
      this.form = {};
      this.date = "";
      this.toQuery();
    }
  },
  created() {
    this.loadCount();
  },
  methods: {
    toQuery(name) {
      this.queryForm = Object.assign({}, this.form);
    },
    loadCount() {
      riskControlQueryTodoCount().then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.count = res.obj;
        }
      })
    },
    deptChange(val, key) {
      this.form[key] = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  // margin-bottom: 20px;
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
.mt-0 {
  margin-top: 0;
}
/deep/ .el-badge__content.is-fixed {
  top: 10px;
}
</style>