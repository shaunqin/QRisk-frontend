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
      redirect: undefined,
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
            this.$router.push({
              path: "/",
              query: this.otherQuery,
            });
            location.reload();
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
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
