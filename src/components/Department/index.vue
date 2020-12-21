<template>
  <treeselect
    v-loading="loading"
    v-model="selectValue"
    :options="options"
    :normalizer="normalizer"
    :default-expand-level="defaultExpand"
    :disabled="disabled"
    :multiple="multiple"
    :limit="limit"
    :flat="flat"
    :placeholder="$t('global.select')"
    appendToBody
  />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryDepts } from '@/api/emplotee'
export default {
  components: { Treeselect },
  data() {
    return {
      options: [],
      treeData: [],
      loading: false,
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      },
    },
  },
  props: {
    value: {
      type: String | Array,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: Infinity,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      default: '',
    },
    defaultExpand: {
      type: Number,
      default: 1,
    },
    url: {
      type: String,
      default: '/sys_mgr/department_mgr/query/tree',
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      let params = {}
      if (this.path) params = { path: this.path }
      this.loading = true
      queryDepts(this.url, params).then((res) => {
        this.loading = false
        this.options = res.obj
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.name,
        children: node.children,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 400px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: auto;
  }
}
.mini {
  /deep/ .vue-treeselect__control {
    height: 30px;
    .vue-treeselect__single-value,
    .vue-treeselect__placeholder {
      line-height: 30px;
    }
  }
  /deep/ .vue-treeselect__multi-value {
    line-height: 18px;
  }
}
</style>
<style lang="scss">
.vue-treeselect--append-to-body {
  z-index: 99999 !important;
}
</style>