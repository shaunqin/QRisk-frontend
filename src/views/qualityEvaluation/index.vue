<template>
  <div class="qualityEvaluate-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DashboardEditor",
  data() {
    return {
      emptyGif:
        "https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  }
};
</script>

<style lang="scss" scoped>
.qualityEvaluate-container {
  min-height: calc(100vh - 56px);
  padding: 20px 0 0 0;

  /deep/ .scrollbar-wrapper{
    height: calc(100vh - 60px);
  }
}
</style>
