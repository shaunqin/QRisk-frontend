<template>
  <div class="app-container">
    <el-row>
      <!-- <el-col :span="3">
        <div class="next-menu">
          <router-link
            :to="'/riskManagerment/page/riskAssessment?assType='+item.type"
            class="next-menu-item pan-btn blue-btn"
            v-for="item in options"
            :key="item.name"
            :class="item.type==assessmentType?'active':''"
          >
            <el-popover v-if="item.tip" :content="item.tip" placement="right" trigger="hover">
              <span slot="reference">{{item.name}}</span>
            </el-popover>
            <span v-else>{{item.name}}</span>
          </router-link>
        </div>
      </el-col>-->
      <el-col :span="24">
        <!-- <el-scrollbar class="page-scrollbar" wrap-class="scrollbar-wrapper"> -->
          <div class="head-container">
            <el-form :model="form" size="mini" inline v-if="tabIndex==1||tabIndex==2||tabIndex==3">
              <el-form-item label="编号">
                <el-input v-model="form.no" placeholder="请输入编号" style="width:120px"></el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="请输入主题" style="width:120px"></el-input>
              </el-form-item>
              <el-form-item label="下发单位" v-if="assessmentType !='1' && assessmentType !='3'">
                <department
                  class="form-dept-tree mini"
                  :value="form.responsePath"
                  @change="deptChange($event,'responsePath')"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="发布日期" v-if="assessmentType !='1' && assessmentType !='3'">
                <el-date-picker
                  v-model="date"
                  unlink-panels
                  type="daterange"
                  placeholder
                  value-format="yyyy-MM-dd"
                  style="width:220px"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="分析单位" v-if="assessmentType =='1' || assessmentType =='3'">
                <department
                  class="form-dept-tree mini"
                  :value="form.analysisDept"
                  @change="deptChange($event,'analysisDept')"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="评估日期" v-if="assessmentType =='1' || assessmentType =='3'">
                <el-date-picker
                  v-model="date"
                  unlink-panels
                  type="daterange"
                  placeholder
                  value-format="yyyy-MM-dd"
                  style="width:220px"
                ></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="发布单位">
              <department
                class="form-dept-tree mini"
                :value="form.deptPath"
                @change="deptChange($event,'deptPath')"
                style="width:220px"
              />
              </el-form-item>-->
              <el-form-item label key="query">
                <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
                <el-button
                  class="filter-item"
                  size="mini"
                  type="success"
                  icon="el-icon-refresh"
                  @click="refresh"
                >{{$t('global.reset')}}</el-button>
              </el-form-item>
            </el-form>
            <el-form :model="form" size="mini" inline v-if="tabIndex==4||tabIndex==5">
              <!-- <el-form-item label="任务名称">
              <el-input v-model="form.name" placeholder="请输入任务名称" style="width:120px"></el-input>
              </el-form-item>-->
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
                <el-button
                  class="filter-item"
                  size="mini"
                  type="success"
                  icon="el-icon-refresh"
                  @click="refresh"
                >{{$t('global.reset')}}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-tabs v-model="tabIndex">
            <el-tab-pane name="1" label="全部">
              <tab1 v-if="tabIndex=='1'" :assessmentType="assessmentType" :queryForm="queryForm" />
            </el-tab-pane>
            <el-tab-pane name="2" label="草稿" v-if="!onlyLeader">
              <tab2 v-if="tabIndex=='2'" :assessmentType="assessmentType" :queryForm="queryForm" />
            </el-tab-pane>
            <el-tab-pane name="3" label="我拟制的" v-if="!onlyLeader">
              <tab3 v-if="tabIndex=='3'" :assessmentType="assessmentType" :queryForm="queryForm" />
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
              <tab4 v-if="tabIndex=='4'" :assessmentType="assessmentType" :queryForm="queryForm" />
            </el-tab-pane>
            <el-tab-pane name="5" label="已办">
              <tab5 v-if="tabIndex=='5'" :assessmentType="assessmentType" :queryForm="queryForm" />
            </el-tab-pane>
          </el-tabs>
        <!-- </el-scrollbar> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tab1 from './components/tabs/tab1';
import tab2 from './components/tabs/tab2';
import tab3 from './components/tabs/tab3';
import tab4 from './components/tabs/tab4';
import tab5 from './components/tabs/tab5';
import { specialRiskQueryTodoCount } from '@/api/risk'
import department from '@/components/Department'
export default {
  components: { tab1, tab2, tab3, tab4, tab5, department },
  data() {
    return {
      selections: [],
      type: "",
      options: [
        { name: "流程/标准", type: 1, tip: '来源于Q-Doc任务' },
        { name: "变革管理", type: 2 },
        { name: "维修能力", type: 3, tip: '来源于Q-Cap任务' },
        { name: "航站审定", type: 4 },
        { name: "全员风险", type: 6 },
        { name: "其他评估", type: 7 },
      ],
      assessmentType: this.$route.query.assType || "1",
      tabIndex: "1",
      count: 0,
      queryForm: {},
      form: {
        no: "", title: "", analysisDept: null
      },
      date: ""
    };
  },
  computed: {
    ...mapGetters(["roles"]),
    onlyLeader() {
      if ((this.roles.length == 2 || this.roles.length > 2) && this.roles.includes('RISK_MANAGER_LEADER')) {
        this.tabIndex = "4";
        return true;
      } else {
        this.tabIndex = "1";
        return false;
      }
    }
  },
  watch: {
    $route(route) {
      this.assessmentType = route.query.assType;
    },
    date(val) {
      if (val) {
        this.form.startTime = val[0];
        this.form.endTime = val[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    tabIndex(val) {
      this.form = {};
      this.date = "";
      this.toQuery();
      if (val == '4') {
        this.loadCount()
      }
    },
    assessmentType(val) {
      this.loadCount()
    }
  },
  created() {
    this.loadCount();
  },
  methods: {
    toQuery(name) {
      this.queryForm = Object.assign({}, this.form);
    },
    refresh() {
      this.queryForm = {},
        this.form = {},
        this.date = ""
      this.toQuery()
    },
    loadCount() {
      const params = {
        assType: this.assessmentType
      }
      specialRiskQueryTodoCount(params).then(res => {
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
/deep/ .form-dept-tree {
  z-index: 100 !important;
}
</style>