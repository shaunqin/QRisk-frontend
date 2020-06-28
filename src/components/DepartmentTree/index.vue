<template>
  <div>
    <el-select v-model="value" :size="size" placeholder="请选择部门">
      <el-option v-for="item in option" :key="item.value" :label="item.name" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "medium"
    }
  },
  data() {
    return {
      option: [
        { name: "上海", value: "1" },
        { name: "杭州", value: "2" }
      ],
      value: ""
    };
  }
};
</script>

<style lang="scss" scoped>
</style>