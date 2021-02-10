<template>
  <div class="index-menu">
    <template v-for="item in routes">
      <router-link
        :to="`/${baseUrl}/${item.path}`"
        class="index-menu-item pan-btn blue-btn"
        :class="$route.meta.title==item.meta.title?'is-active':''"
        :key="item.path"
      >{{generateTitle(item.meta.title)}}</router-link>
      <template v-if="item.path==secUrl">
        <div class="sec-menu" :key="item.path+'div'">
          <router-link
            :to="`/${baseUrl}/${secUrl}/${iitem.path}`"
            class="next-menu-item pan-btn blue-btn"
            :class="$route.meta.title==iitem.meta.title?'is-active':''"
            v-for="iitem in item.children"
            :key="iitem.path"
          >
            <el-popover
              v-if="iitem.meta.tip"
              :content="iitem.meta.tip"
              placement="right"
              trigger="hover"
            >
              <span slot="reference">{{generateTitle(iitem.meta.title)}}</span>
            </el-popover>
            <span v-else>{{generateTitle(iitem.meta.title)}}</span>
            <!-- {{generateTitle(iitem.meta.title)}} -->
          </router-link>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { generateTitle } from "@/utils/i18n";
export default {
  name: 'sideMenu',
  props: {
    routes: {
      type: Array,
      required: true
    },
    baseUrl: {
      type: String,
      default: ''
    },
    secUrl: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.item);
  },
  methods: {
    generateTitle,
  },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
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
</style>