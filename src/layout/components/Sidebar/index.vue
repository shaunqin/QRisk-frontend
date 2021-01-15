<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :riskNoticeCount="riskNoticeCount"
          :hiddenDanger="hiddenDanger"
        />
      </el-menu>
    </el-scrollbar>
    <navbar></navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { Navbar } from '../../components'
import { queryCount } from '@/api/info'

export default {
  components: { SidebarItem, Logo, Navbar },
  data() {
    return {
      riskNoticeCount: 0,
      hiddenDanger: 0
    }
  },
  created() {
    queryCount().then(res => {
      if (res.code == '200') {
        this.riskNoticeCount = res.obj.safetyNotice.all;
        this.hiddenDanger = res.obj.hiddenDanger.all;
      }
    });
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
      // return false
    }
  }
}
</script>
