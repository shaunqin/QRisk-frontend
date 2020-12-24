<template>
  <div>
    <!-- 待办 -->
    <toDoTask v-if="redirect=='toDoTask'" ref="toDoTask" />
    <!-- 已办 -->
    <hasDone v-if="redirect=='hasDoneView'" />
    <!-- 我发起的 -->
    <myInitiating v-if="redirect=='start'" />
  </div>
</template>

<script>
import toDoTask from './components/toDoTask'
import myInitiating from './components/myInitiating'
import hasDone from './components/hasDone'
export default {
  components: {
    toDoTask, myInitiating, hasDone
  },
  data() {
    return {
      redirect: this.$route.query.redirect
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>