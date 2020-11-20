<template>
  <div class="riskManagement-container">
    <el-row :gutter="8">
      <el-col :span="3">
        <div class="index-menu">
          <router-link
            :to="'/dataAnalysis/'+item.path"
            class="index-menu-item pan-btn blue-btn"
            :class="$route.meta.title==item.meta.title?'is-active':''"
            v-for="item in routes"
            :key="item.path"
          >{{generateTitle(item.meta.title)}}</router-link>
        </div>
      </el-col>
      <el-col :span="21" class="r-main">
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
export default {
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
  methods: {
    generateTitle
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.riskManagement-container {
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
  .r-main {
    padding: 0 10px;
  }
   .blue-btn{
    background: transparent;
    color: #000;
    border-radius: 0;
    // &:hover::before, &:hover:after{
    //   background: #0062ff;
    // }
  }
  /deep/ .scrollbar-wrapper{
    height: calc(100vh - 60px);
    padding-right: 10px;
  }
}
</style>