<template>
  <div class="dashboard-container">
    <Sidebar />
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import Sidebar from './components/Sidebar'

export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard, Sidebar },
  data() {
    return {
      currentRole: "adminDashboard"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    // if (!this.roles.includes("admin")) {
    //   this.currentRole = "editorDashboard";
    // }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  background: url("../../assets/images/home-bg.png") no-repeat 0 0 / cover;
}
</style>