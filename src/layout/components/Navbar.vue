<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <!-- 语言切换 -->
        <!-- <lang-select class="right-menu-item hover-effect" /> -->
      </template>
      <message-bell />
      <!-- 语言切换 -->
      <lang-select class="right-menu-item hover-effect" />
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <img :src="userImgUrl" class="user-avatar" />
          <span class="user-name">{{userInfo.realname||'admin@123'}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{userInfo.sqlUserId}}</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
// import SizeSelect from '@/components/SizeSelect'
import LangSelect from "@/components/LangSelect";
import MessageBell from "@/components/MessageBell";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    // SizeSelect,
    LangSelect,
    MessageBell,
  },
  data() {
    return {
      userImgUrl: require("@/assets/user_images/login-user.gif"),
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device", "userInfo"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: transparent;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        //margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .user-name {
          margin: 0 8px;
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 10px;
          color: #fff;
          //font-size: 12px;
        }
      }
    }
  }
}
</style>
