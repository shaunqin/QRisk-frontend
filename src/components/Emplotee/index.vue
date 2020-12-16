<template>
  <el-select v-model="_value" placeholder clearable>
    <el-option
      v-for="item in data"
      :key="item.memberId"
      :label="`${item.realname}[${item.sqlUserId}]`"
      :value="item.sqlUserId"
    ></el-option>
  </el-select>
</template>

<script>
import { queryEmplotee } from '@/api/emplotee'
export default {
  data() {
    return {
      loading: false,
      data: [],
    }
  },
  mounted() {
    this.init();
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    deptPath: {
      type: String,
      default: ""
    }
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  watch: {
    deptPath() {
      this.init();
    }
  },
  methods: {
    init() {
      queryEmplotee({ deptPath: this.deptPath }).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.data = res.obj;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>