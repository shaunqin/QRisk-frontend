<template>
  <div ref="box" class="container">
    <!-- 卡片 element-ui 组件 -->
    <el-card class="my-card">
      <div class="login-type" @click="accoutLogin=!accoutLogin">
        <img v-if="!accoutLogin" src="../../assets/login_images/icon/account.png" />
        <img v-else src="../../assets/login_images/icon/qrcode.png" />
      </div>
      <span class="title">风险管理系统前台</span>
      <el-form
        v-show="accoutLogin"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        status-icon
      >
        <!-- <el-form-item label>
          <el-select v-model="loginForm.userName" size="mini" placeholder="测试账号" clearable>
            <el-option label="NewAmeco风险管理员" value="00089715"></el-option>
            <el-option label="NewAmeco领导" value="00048117"></el-option>
            <el-option label="华北风险管理员" value="00074394"></el-option>
            <el-option label="华北领导" value="00804084"></el-option>
            <el-option label="空客维修风险管理员" value="00074427"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item prop="userName">
          <el-input
            ref="userName"
            v-model="loginForm.userName"
            placeholder="请输入用户名"
            clearable
            @keyup.enter.native="handleLogin"
          >
            <i slot="prefix" class="el-icon-user-solid el-input__icon icon userName" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            clearable
            show-password
            maxlength="16"
            @keyup.enter.native="handleLogin"
          >
            <i slot="prefix" class="el-input__icon icon pwd" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isChecked" style="color: #005ba7">我已阅读并同意用户协议和隐私条款</el-checkbox>
          <span class="readClick" @click="dialogVisible = true">点击阅读</span>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            :disabled="!isChecked"
            type="primary"
            :class="['is-disabled' ? '!isChecked':'isChecked']"
            @click="handleLogin()"
          >登 录</el-button>
        </el-form-item>
      </el-form>
      <div v-show="!accoutLogin" id="qrlogin" style="height: 280px;text-align: center;"></div>
    </el-card>
    <el-dialog title="用户协议和隐私条款" :visible.sync="dialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import settings from '@/store/modules/settings';

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userName: "",
        password: "Qwer1234",
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      dialogVisible: false,
      isChecked: true,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      accoutLogin: true
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
          // 扫码登录
          if (query.token) {
            let token = query.token;
            this.$loading({ text: "登录中..." })
            this.$store.dispatch("user/qrLogin", token).then(res => {
              this.$loading().close();
              if (res.code == '200') {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery,
                });
              } else {
                this.$message.error(res.msg)
                setTimeout(() => {
                  this.$router.replace({
                    path: "/login"
                  });
                }, 500);
              }
            }).catch(e => {
              this.$loading().close();
              this.$message.error("扫码登录失败")
            })
          }
        }
      }
    },
  },
  mounted() {
    // if (this.loginForm.userName === "") {
    //   this.$refs.userName.focus();
    // } else if (this.loginForm.password === "") {
    //   this.$refs.password.focus();
    // }
    var aLogin = new AmecoQrLogin(
      {
        id: 'qrlogin',//二维码嵌入的第三方页面标签id
        url: 'http://ssoapi.ameco.com.cn/sso-api/qrlogin.html', //嵌入的扫描页地址,内外网可能地址不一样
      },
      {
        self_redirect: false,//页面跳转方式
        client_key: '0a545da67a134e43a213153c4b087fa1',
        scope: '',
        redirect_uri: this.getUrlDelParams()
      }, {
      // style: '',
      // href: ''
    });
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then((res) => {
              if (res) {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery,
                });
                // this.loading = false;
              } else {
                this.$message.error("用户名或密码输入错误！！！");
                this.loading = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // },
    getUrlDelParams() {
      var url = location.search;
      var old_url = window.location.href;

      if (url) {
        var new_url = old_url.substring(0, old_url.indexOf('?'));
        return new_url;
      }
      return old_url;
      // return 'http://localhost:9990/'
    }
  },
};
</script>

<style scoped lang='scss'>
.container {
  background: url("../../assets/login_images/bg1.jpg") no-repeat center / cover;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .my-card {
    width: 460px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    .title {
      display: inline-block;
      width: 100%;
      font-size: 20px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 30px;
      margin-top: 10px;
    }
    img {
      width: 200px;
      display: block;
      margin: 0 auto 20px;
    }
    .el-input {
      height: 42px;
    }
    .el-button {
      width: 100%;
      background: #005ba7;
      border-color: #005ba7;
    }
    .is-disabled {
      background: #b1b1b1;
      border-color: #b1b1b1;
    }
    /deep/ .el-input__inner {
      padding-left: 50px;
    }
    /deep/ .el-form-item__error {
      left: 10%;
    }
    /deep/ .el-checkbox__label {
      color: #005ba7;
    }
    /deep/ .el-checkbox__inner {
      border-color: #005ba7;
    }
    /deep/ .el-checkbox {
      margin-top: 20px;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #005ba7;
    }
  }
}
.icon {
  display: block;
  height: 40px;
  width: 40px;
  margin-right: 20px;
}
.pwd {
  background: url("../../assets/login_images/icon/password.png") no-repeat
    center;
}
.el-icon-user-solid:before {
  font-size: 26px;
  color: #0059a8;
}
.reset-pwd {
  display: block;
  color: #005ba7;
  font-size: 14px;
  text-decoration: none;
  position: absolute;
  right: 0;
  cursor: pointer;
}
.registered {
  color: #005ba7;
}
.readClick {
  padding-left: 50px;
  cursor: pointer;
  color: #005ba7;
}
.login-type {
  position: absolute;
  top: 0px;
  right: 0;
  width: 60px;
  height: 60px;
  transform: rotate(45deg);
  margin-right: -24px;
  margin-top: -24px;
  overflow: hidden;
  img {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    cursor: pointer;
    transform: rotate(-45deg);
    margin-top: 30px !important;
    margin-right: 30px !important;
  }
}
</style>
