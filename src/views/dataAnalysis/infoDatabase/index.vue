<template>
  <div class="infodatabase-container">
    <el-row :gutter="8">
      <el-col :span="3">
        <sideMenu :routes="routes" base-url="dataAnalysis" sec-url="infoDatabase" />
      </el-col>
      <!-- <el-col :span="3">
        <div class="index-menu">
          <router-link
            :to="'/dataAnalysis/'+item.path"
            class="index-menu-item pan-btn blue-btn"
            v-for="item in routes"
            :key="item.path"
          >{{generateTitle(item.meta.title)}}</router-link>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="next-menu">
          <router-link
            :to="'/dataAnalysis/infoDatabase/'+item.path"
            class="next-menu-item pan-btn blue-btn"
            v-for="item in routes.find(a=>a.path=='infoDatabase').children"
            :key="item.path"
          >
            <el-popover v-if="item.meta.tip" :content="item.meta.tip" placement="right" trigger="hover">
              <span slot="reference">{{generateTitle(item.meta.title)}}</span>
            </el-popover>
            <span v-else>{{generateTitle(item.meta.title)}}</span>
          </router-link>
        </div>
      </el-col>-->
      <el-col :span="21">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <router-view></router-view>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { generateTitle } from "@/utils/i18n";
import sideMenu from '@/components/common/sideMenu'
export default {
  components: { sideMenu },
  data() {
    return {
      routes: []
    };
  },
  computed: {
    ...mapGetters(["permission_routes"])
  },
  created() {
    this.permission_routes.map(route => {
      if (route.path === "/dataAnalysis") {
        this.routes = route.children;
      }
    });
  },
  mounted() {
    // 点击待办数字进来
    if (this.$store.getters.evaluateReportTabIndex == '4') {
      this.$router.push({
        path: '/dataAnalysis/evaluateReportMonthly/index'
      })
    }
  },
  methods: {
    generateTitle
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.infodatabase-container {
  min-height: calc(100vh - 56px);
  padding: 15px 0 0 20px;
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
      &.router-link-active {
        background: $pageMenuBg;
        color: #fff;
      }
    }
  }
  .blue-btn {
    background: transparent;
    color: #000;
    border-radius: 0;
    // &:hover::before, &:hover:after{
    //   background: #0062ff;
    // }
  }
  /deep/ .scrollbar-wrapper {
    height: calc(100vh - 72px);
  }
}
</style>
