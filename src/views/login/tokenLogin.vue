<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      token: this.$route.query.token,
      username: this.$route.query.username,
      localToken: this.$store.getters.token,
      redirect: this.$route.query.redirect,
      otherQuery: {},
    };
  },
  watch: {
    $route(to) {
      console.log(to);
      this.token = to.query.token;
      this.username = to.query.username;
      this.redirect = to.query.redirect;
      this.otherQuery = this.getOtherQuery(to.query);
      this.login();
    },
  },
  created() {
    this.otherQuery = this.getOtherQuery(this.$route.query);
    this.login();
  },
  methods: {
    login() {
      if (!this.token || !this.username) {
        return;
      }
      let params = {
        token: this.token,
        username: this.username,
        localToken: this.localToken,
      };
      this.$loading({ text: "登录中..." });
      this.$store
        .dispatch("user/tokenLogin", params)
        .then((res) => {
          this.$loading().close();
          if (res) {
            let url = this.redirect == 'index' ? '/' : '/smart';
            this.$router.push({
              path: url,
              query: this.otherQuery,
            }, () => {
              // 重新获取用户信息
              // location.reload();
              this.$store.dispatch("user/getInfo");
            });
          } else {
            this.$router.replace({
              path: "/login",
            });
          }
        })
        .catch((err) => {
          this.$loading().close();
          this.$router.replace({
            path: "/login",
          });
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "token") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
