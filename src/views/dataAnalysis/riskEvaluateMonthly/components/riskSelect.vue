<template>
  <el-select
    filterable
    v-model="_value"
    placeholder
    style="width: 100%;"
    clearable
    :disabled="disabled"
  >
    <!-- code作为key -->
    <el-option
      v-for="item in filterList"
      :key="item.riskListId"
      :label="item.riskName"
      :value="item.riskNo"
    ></el-option>
  </el-select>
</template>

<script>
import { queryRiskList } from "@/api/standard";
export default {
  data() {
    return {
      list: [],
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    filterArr: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _value: {
      get() {
        // return !this.value ? [] : this.value.split(",");
        return this.value
      },
      set(val) {
        this.$emit("change", val);
      },
    },
    filterList() {
      if (this.filterArr.length == 0) {
        return this.list
      } else {
        return this.list.filter(r => this.filterArr.some(i => r.riskName == i));
      }
    }
  },
  created() {
    queryRiskList().then((res) => {
      if (res.code != "200") {
        this.$message.error(res.msg);
      } else {
        this.list = res.obj;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
</style>