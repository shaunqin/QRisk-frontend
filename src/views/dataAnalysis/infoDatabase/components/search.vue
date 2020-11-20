<template>
  <el-form size="mini" :model="queryForm" inline>
    <el-form-item :label="$t('analysis.no')">
      <el-input v-model="queryForm.no" :placeholder="$t('analysis.pleaseInputNo')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('analysis.happenDate')">
      <el-date-picker
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        :start-placeholder="$t('analysis.startDate')"
        :end-placeholder="$t('analysis.endDate')"
        style="width:240px"
        unlink-panels
      ></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('analysis.problemDesc')">
      <el-input
        v-model="queryForm.problemDescription"
        :placeholder="$t('analysis.pleaseInputproblemDes')"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(queryForm)"
      >{{$t('global.search')}}</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-refresh"
        @click="refresh"
      >{{$t('global.reset')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {},
      date: "",
    };
  },
  watch: {
    date(val) {
      if (val) {
        this.queryForm.startHappenDate = val[0];
        this.queryForm.endHappenDate = val[1];
      } else {
        this.queryForm.startHappenDate = "";
        this.queryForm.endHappenDate = "";
      }
    },
  },
  methods: {
    toQuery(params) {
      let _this = this.$parent;
      _this.page = 1;
      _this.params = { ...params };
      _this.init();
    },
    refresh() {
      this.queryForm = {};
      this.date = "";
      this.toQuery(this.queryForm);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>