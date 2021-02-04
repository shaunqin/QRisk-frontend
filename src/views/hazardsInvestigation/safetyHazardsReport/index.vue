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
            <el-option label="单次任务" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <department
            class="mini"
            :value="form.deptPath"
            @change="deptChange"
            style="width:180px;"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-radio-group v-model="dateType" size="mini">
            <el-radio-button label="year">年</el-radio-button>
            <el-radio-button label="month">年月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            key="year"
            v-model="form.date"
            value-format="yyyy-MM"
            type="year"
            v-if="dateType=='year'"
            style="width:130px"
          ></el-date-picker>
          <el-date-picker
            key="month"
            v-model="form.date"
            value-format="yyyy-MM"
            type="month"
            v-if="dateType=='month'"
            style="width:130px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button type="success" icon="el-icon-search" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="form" size="mini" inline v-if="tabIndex==2||tabIndex==3">
        <el-form-item label="任务名称">
          <el-input v-model="form.businessTitle"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <department
            class="mini"
            :value="form.deptPath"
            @change="deptChange"
            style="width:180px;"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-radio-group v-model="dateType" size="mini">
            <el-radio-button label="year">年</el-radio-button>
            <el-radio-button label="month">年月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            key="year"
            v-model="form.date"
            value-format="yyyy-MM"
            type="year"
            v-if="dateType=='year'"
            style="width:130px"
          ></el-date-picker>
          <el-date-picker
            key="month"
            v-model="form.date"
            value-format="yyyy-MM"
            type="month"
            v-if="dateType=='month'"
            style="width:130px"
          ></el-date-picker>
          <!-- <el-date-picker
            key="daterange"
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            style="width:230px"
          ></el-date-picker>-->
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button type="success" icon="el-icon-search" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="form" size="mini" inline v-if="tabIndex==4">
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
      <el-tab-pane name="2">
        <el-badge
          slot="label"
          :value="count.all"
          class="item"
          :type="count.emergency>0?'danger':'success'"
          :hidden="!count.all"
        >
          <span>待办</span>
        </el-badge>
        <tab2 v-if="tabIndex==2" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="3">
        <tab3 v-if="tabIndex==3" :queryForm="queryForm" />
      </el-tab-pane>
      <el-tab-pane label="驳回记录" name="4">
        <tab4 v-if="tabIndex==4" :queryForm="queryForm" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1'
import tab2 from './components/tabs/tab2'
import tab3 from './components/tabs/tab3'
import tab4 from './components/tabs/tab4'
import { queryTodoCount } from '@/api/hazards'
import { mapGetters } from 'vuex'
import department from '@/components/Department'
export default {
  components: { tab1, tab2, tab3, tab4, department },
  data() {
    return {
      isAdd: false,
      query: '',
      tabIndex: '1',
      form: {},
      queryForm: {},
      date: "",
      count: 0,
      dateType: 'year'
    };
  },
  created() {
    this.loadCount();
  },
  mounted() {
    // 是否从导航栏点进来
    if (this.$store.getters.hiddenDangerTabIndex != '1')
      this.tabIndex = this.$store.getters.hiddenDangerTabIndex;
    // 重置
    this.$store.dispatch("riskSettings/setHiddenDangerTabIndex", "1");
  },
  computed: {
    ...mapGetters(["roles"]),
    onlyLeader() {
      if (this.roles.length == 2 && this.roles.includes('RISK_MANAGER_LEADER')) {
        this.tabIndex = "2";
        return true;
      } else {
        this.tabIndex = "1";
        return false;
      }
    }
  },
  watch: {
    tabIndex() {
      this.form = {};
      this.date = "";
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
    },
    deptChange(val) {
      this.form.deptPath = val;
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
/deep/ .vue-treeselect--append-to-body {
    z-index: 1 !important;
}
</style>