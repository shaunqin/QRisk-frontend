<template>
  <el-form :model="form" inline size="mini">
    <el-form-item label="名称">
      <el-input v-model="form.taskName" placeholder></el-input>
    </el-form-item>
    <el-form-item label="截止日期">
      <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" unlink-panels></el-date-picker>
    </el-form-item>
    <el-form-item label>
      <el-button type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      date: "",
      form: {
        taskName: "",
        startDueDate: "",
        endDueDate: ""
      }
    }
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startDueDate = val[0];
        this.form.endDueDate = val[1];
      } else {
        this.form.startDueDate = "";
        this.form.endDueDate = "";
      }
    }
  },
  methods: {
    toQuery() {
      let _this = this.$parent;
      _this.params = this.form;
      _this.init();
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>