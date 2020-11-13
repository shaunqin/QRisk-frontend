<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="3">
        <div class="next-menu">
          <router-link
            :to="'/riskManagerment/page/riskAssessment?type='+item.type"
            class="next-menu-item pan-btn blue-btn"
            v-for="item in options"
            :key="item.name"
            :class="item.type==assessmentType?'active':''"
          >{{item.name}}</router-link>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="head-container"></div>
        <el-tabs v-model="tabIndex">
          <el-tab-pane name="1" label="已下发">
            <tab1 v-if="tabIndex=='1'" :assessmentType="assessmentType" />
          </el-tab-pane>
          <el-tab-pane name="2" label="草稿">
            <tab2 v-if="tabIndex=='2'" />
          </el-tab-pane>
          <el-tab-pane name="3" label="我拟制的">
            <tab3 v-if="tabIndex=='3'" />
          </el-tab-pane>
          <el-tab-pane name="4" label="待办">
             <tab4 v-if="tabIndex=='4'" />
          </el-tab-pane>
          <el-tab-pane name="5" label="已办">
             <tab5 v-if="tabIndex=='5'" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1';
import tab2 from './components/tabs/tab2';
import tab3 from './components/tabs/tab3';
import tab4 from './components/tabs/tab4';
import tab5 from './components/tabs/tab5';
export default {
  components: { tab1, tab2, tab3, tab4, tab5 },
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
      assessmentType: this.$route.query.type || "",
      tabIndex: "1"
    };
  },
  watch: {
    $route(route) {
      this.assessmentType = route.query.type;
    },
  },
  created() { },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    }
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
</style>