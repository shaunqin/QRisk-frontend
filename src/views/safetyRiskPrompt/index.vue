<template>
  <div class="app-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="head-container">
        <el-form :model="form" size="mini" inline v-if="tabIndex==1||tabIndex==2||tabIndex==3">
          <el-form-item label="编号">
            <el-input v-model="form.no" placeholder="请输入编号" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="主题">
            <el-input v-model="form.title" placeholder="请输入主题" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="责任单位">
            <department
              class="form-dept-tree"
              :value="form.responsePath"
              @change="deptChange($event,'responsePath')"
              style="width:220px"
            />
          </el-form-item>
          <el-form-item label="发布日期" v-if="tabIndex==1">
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
              class="form-dept-tree"
              :value="form.deptPath"
              @change="deptChange($event,'deptPath')"
              style="width:220px"
            />
          </el-form-item>
          <el-form-item label>
            <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
            <el-button type="success" icon="el-icon-search" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="form" size="mini" inline v-if="tabIndex==4">
          <el-form-item label="流程状态">
            <el-input v-model="form.name" placeholder="请输入任务名称" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="发起人">
            <el-input v-model="form.starter" placeholder="请输入发起人" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="措施内容">
            <el-input v-model="form.content" placeholder="请输入措施内容" style="width:120px"></el-input>
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
            <el-button type="success" icon="el-icon-search" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="form" size="mini" inline v-if="tabIndex==5">
          <el-form-item label="主题">
            <el-input v-model="form.title" placeholder="请输入主题" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="发起人">
            <el-input v-model="form.createBy" placeholder="请输入发起人" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <department
              class="form-dept-tree"
              :value="form.dept"
              @change="deptChange($event,'dept')"
              style="width:220px"
            />
          </el-form-item>
          <el-form-item label>
            <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="form" size="mini" inline v-if="tabIndex==6">
          <el-form-item label="内容">
            <el-input v-model="form.remark" placeholder="请输入内容" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="date"
              unlink-panels
              type="daterange"
              placeholder
              value-format="yyyy-MM-dd"
              style="width:220px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label>
            <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="全部" name="1" v-if="!onlyLeader">
          <tab1 v-if="tabIndex==1" :queryForm="queryForm" />
        </el-tab-pane>
        <el-tab-pane label="草稿" name="2" v-if="!onlyLeader">
          <tab2 v-if="tabIndex==2" :queryForm="queryForm" />
        </el-tab-pane>
        <el-tab-pane label="我拟制的" name="3" v-if="!onlyLeader">
          <tab3 v-if="tabIndex==3" :queryForm="queryForm" />
        </el-tab-pane>
        <el-tab-pane name="4">
          <el-badge
            slot="label"
            :value="count.all"
            class="item"
            :type="count.emergency>0?'danger':'success'"
            :hidden="!count.all"
          >
            <span>待办</span>
          </el-badge>
          <tab4 v-if="tabIndex==4" :queryForm="queryForm" />
        </el-tab-pane>
        <el-tab-pane label="已办" name="5">
          <tab5 v-if="tabIndex==5" :queryForm="queryForm" />
        </el-tab-pane>
        <el-tab-pane label="驳回记录" name="6">
          <tab6 v-if="tabIndex==6" :queryForm="queryForm" />
        </el-tab-pane>
      </el-tabs>
      <edetail ref="detail"></edetail>
    </el-scrollbar>
  </div>
</template>

<script>
import edetail from "./components/detail";
import tab1 from "./components/tab1";
import tab2 from "./components/tab2";
import tab3 from "./components/tab3";
import tab4 from "./components/tab4";
import tab5 from "./components/tab5";
import tab6 from "./components/tab6";
import department from '@/components/Department'
import { queryTodoCount } from '@/api/risk'
import { mapGetters } from 'vuex'
export default {
  components: { edetail, tab1, tab2, tab3, tab4, tab5, tab6, department },
  data() {
    return {
      isAdd: false,
      selections: [],
      form: {
        no: "", title: "", responsePath: null
      },
      tabIndex: "1",
      queryForm: {},
      date: "",
      count: {}
    };
  },
  computed: {
    ...mapGetters(["roles"]),
    onlyLeader() {
      if (this.roles.length == 2 && this.roles.includes('RISK_MANAGER_LEADER')) {
        this.tabIndex = "4";
        return true;
      } else {
        this.tabIndex = "1";
        return false;
      }

    }
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
  mounted() {
    // 是否从导航栏点进来
    if (this.$store.getters.riskNoticeTabIndex != '1')
      this.tabIndex = this.$store.getters.riskNoticeTabIndex;
    // 重置
    this.$store.dispatch("riskSettings/setRiskNoticeTabIndex", "1");
  },
  methods: {
    toQuery() {
      this.queryForm = Object.assign({}, this.form);
    },
    detail(row) {
      let _this = this.$refs.detail;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    deptChange(val, key) {
      this.form[key] = val;
    },
    loadCount() {
      queryTodoCount().then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.count = res.obj;
        }
      })
    },
    reset() {
      this.form = {};
      this.date = "";
      this.toQuery();
    }
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
// .head-container {
//   margin-bottom: 20px;
// }
.title {
  color: #1890ff;
}
.app-container {
  padding: 20px 10px 0 10px;
}
.form-dept-tree {
  z-index: 1 !important;
  /deep/ .vue-treeselect__control {
    height: 30px;
    .vue-treeselect__single-value,
    .vue-treeselect__placeholder {
      line-height: 30px;
    }
  }
}
/deep/ .scrollbar-wrapper {
  height: calc(100vh - 77px);
}
/deep/ .el-badge__content.is-fixed {
  top: 10px;
}
</style>