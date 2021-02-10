<template>
  <div class="dangerManagerment-container">
    <el-row :gutter="8">
      <el-col :span="3">
        <div class="index-menu">
          <template v-for="item in routes">
            <router-link
              :to="`/riskManagerment/page/${item.path}`"
              class="index-menu-item pan-btn blue-btn"
              :class="$route.meta.title==item.meta.title?'is-active':''"
              :key="item.path"
            >{{generateTitle(item.meta.title)}}</router-link>
            <template v-if="item.path=='riskAssessment'">
              <div class="sec-menu" :key="item.path+'div'">
                <router-link
                  :to="'/riskManagerment/page/riskAssessment?assType='+iitem.type"
                  class="next-menu-item pan-btn blue-btn"
                  v-for="iitem in options"
                  :key="iitem.name"
                  :class="$route.meta.title=='riskAssessment'&&iitem.type==assessmentType?'active':''"
                >
                  <el-popover
                    v-if="iitem.tip"
                    :content="iitem.tip"
                    placement="right"
                    trigger="hover"
                  >
                    <span slot="reference">{{iitem.name}}</span>
                  </el-popover>
                  <span v-else>{{iitem.name}}</span>
                </router-link>
              </div>
            </template>
          </template>
        </div>
      </el-col>
      <!-- <el-col :span="3">
        <div class="index-menu" ref="indexMenu">
          <router-link
            :to="'/riskManagerment/page/'+item.path"
            class="index-menu-item pan-btn blue-btn"
            v-for="item in routes"
            :key="item.path"
          >
            {{generateTitle(item.meta.title)}}
          </router-link>
        </div>
      </el-col>-->
      <el-col :span="21">
        <el-scrollbar class="page-scrollbar" wrap-class="scrollbar-wrapper">
          <router-view></router-view>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-backtop target=".page-scrollbar .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { generateTitle } from "@/utils/i18n";
export default {
  data() {
    return {
      routes: [],
      assessmentType: this.$route.query.assType || "1",
      options: [
        { name: "流程/标准", type: 1, tip: '来源于Q-Doc任务' },
        { name: "变革管理", type: 2 },
        { name: "维修能力", type: 3, tip: '来源于Q-Doc任务' },
        { name: "航站审定", type: 4 },
        { name: "全员风险", type: 6 },
        { name: "其他评估", type: 7 },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission_routes"])
  },
  watch: {
    $route(route) {
      this.assessmentType = route.query.assType;
    },
  },
  created() {
    this.permission_routes.map(route => {
      if (route.path === "/riskManagerment") {
        this.routes = route.children[0].children;
      }
    });
  },
  methods: {
    generateTitle
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.dangerManagerment-container {
  min-height: calc(100vh - 56px);
  padding: 20px 0 0 20px;
  .index-menu {
    min-height: calc(100vh - 90px);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 0;
    .index-menu-item {
      padding: 10px 10px;
      text-align: left;
      margin: 0 0 10px;
      display: block;
      &.router-link-active {
        background: $pageMenuBg;
        color: #fff;
      }
    }
  }
  .sec-menu {
    //padding: 10px 0;
    .next-menu-item {
      padding: 10px 30px;
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
  /deep/ .scrollbar-wrapper {
    height: calc(100vh - 77px);
  }
}
</style>
