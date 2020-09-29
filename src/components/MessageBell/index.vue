<template>
  <div>
    <!-- <el-popover trigger="click">
      <span slot="reference" class="el-icon-message-solid message"></span>
      <a>111</a>
    </el-popover>-->
    <router-link to="/message">
      <el-badge :value="count" :hidden="count==0">
        <span class="el-icon-message-solid message"></span>
      </el-badge>
    </router-link>
  </div>
</template>

<script>
import { queryUnread } from "@/api/message";
export default {
  data() {
    return {
      count: 0,
    };
  },
  created() {
    this.load();
  },
  mounted() {
    // setInterval(() => {
    //   this.load();
    // }, 100 * 1000);
  },
  methods: {
    load() {
      queryUnread().then((res) => {
        if (res.code == "200") {
          this.count = res.obj;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  font-size: 25px;
  color: #fff;
  line-height: 50px;
  margin-right: 10px;
  cursor: pointer;
}
/deep/ .el-badge__content.is-fixed {
  top: 15px;
  right: 25px;
}
</style>