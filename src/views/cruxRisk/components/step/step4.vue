<template>
  <div>
    <info :data="data" form="form" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import info from './step1';
export default {
  components: {
    info,
  },
  props: ["data", "form"],
  methods: {
    formatShortDate,
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
  .com {
    margin-top: 8px;
  }
}
</style>