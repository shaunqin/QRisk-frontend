<template>
  <div class="app-container">
        <div class="head-container">
          <el-form :model="form" size="mini" inline v-if="tabIndex==1||tabIndex==2||tabIndex==3">
            <el-form-item label="编号">
              <el-input v-model="form.no" placeholder="请输入编号" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="form.title" placeholder="请输入主题" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="下发单位">
              <department
                class="form-dept-tree mini"
                :value="form.responsePath"
                @change="deptChange($event,'responsePath')"
                style="width:220px"
              />
            </el-form-item>
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="date"
                unlink-panels
                type="daterange"
                placeholder
                value-format="yyyy-MM-dd"
                style="width:220px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="发布单位">
              <department
                class="form-dept-tree mini"
                :value="form.deptPath"
                @change="deptChange($event,'deptPath')"
                style="width:220px"
              />
            </el-form-item>
            <el-form-item label>
              <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
            </el-form-item>
          </el-form>
          <el-form :model="form" size="mini" inline v-if="tabIndex==4||tabIndex==5">
            <el-form-item label="任务名称">
              <el-input v-model="form.name" placeholder="请输入任务名称" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="发起人">
              <el-input v-model="form.starter" placeholder="请输入发起人" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="发起时间">
              <el-date-picker
                v-model="date"
                unlink-panels
                type="daterange"
                placeholder="请选择发起时间"
                value-format="yyyy-MM-dd"
                style="width:260px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label>
              <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <tab1 v-if="tabIndex=='1'" :queryForm="queryForm" />
        <!-- <el-tabs v-model="tabIndex">
          <el-tab-pane name="1" label="已下发">
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
        </el-tabs> -->
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1';
// import tab2 from './components/tabs/tab2';
// import tab3 from './components/tabs/tab3';
// import tab4 from './components/tabs/tab4';
// import tab5 from './components/tabs/tab5';
import { specialRiskQueryTodoCount } from '@/api/risk'
import department from '@/components/Department'
export default {
  components: { tab1, department },
  data() {
    return {
      selections: [],
      type: "",
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
      specialRiskQueryTodoCount().then(res => {
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
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-container {
  min-height: calc(100vh - 56px);
  padding: 20px 0 0 20px;
}
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
// .head-container {
//   margin-bottom: 20px;
// }
.next-menu {
  min-height: calc(100vh - 90px);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 0;
  .next-menu-item {
    padding: 10px 10px;
    text-align: left;
    margin-bottom: 10px;
    display: block;
    &.active {
      background: $pageMenuBg;
      color: #fff;
    }
  }
}
.blue-btn {
  background: transparent;
  color: #000;
  border-radius: 0;
}

/deep/ .el-badge__content.is-fixed {
  top: 10px;
}
/deep/ .vue-treeselect--append-to-body {
    z-index: 99 !important;
}
</style>