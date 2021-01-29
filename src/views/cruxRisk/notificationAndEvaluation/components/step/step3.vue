<template>
  <div>
    <info :data="data" :form="form" :source="source" />
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import info from './step1';
export default {
  components: {
    info,
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    form: {
      type: Object,
      default: () => { },
    },
    source: {
      type: String,
      default: '',
    },
  },
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