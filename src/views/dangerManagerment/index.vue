<template>
  <div class="dangerManagerment-container">
    <el-row :gutter="8">
      <el-col :span="3">
        <div class="index-menu" ref="indexMenu">
          <router-link
            :to="'/dangerManagerment/d/'+item.path"
            class="index-menu-item pan-btn blue-btn"
            v-for="item in routes"
            :key="item.path"
          >
            <el-badge
              :value="12"
              class="item"
              :hidden="!item.meta.badge"
            >{{generateTitle(item.meta.title)}}</el-badge>
          </router-link>
        </div>
      </el-col>
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
      if (route.path === "/dangerManagerment") {
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
        background: #324157;
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
    height: calc(100vh - 60px);
  }
}
</style>
