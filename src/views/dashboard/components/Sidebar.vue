<template>
  <div class="sidebar-container" :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <navbar></navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import variables from '@/styles/variables.scss'
import Navbar from './Navbar'

export default {
  components: { Logo, Navbar },
  data() {
    return {
      
    }
  },
  created() {
    
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
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
<style lang="scss" scoped>
.sidebar-container{
  background: none !important;
  justify-content: space-between;
}
</style>