<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        size="mini"
        v-model="query"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <el-button class="filter-item" size="mini" type="success">导出</el-button>
    </div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="已下发" name="1">
        <tab1 v-if="tabIndex==1" />
      </el-tab-pane>
      <el-tab-pane label="待办" name="2">
        <tab2 v-if="tabIndex==2" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="3"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tab1 from './components/tabs/tab1'
import tab2 from './components/tabs/tab2'
export default {
  components: { tab1, tab2 },
  data() {
    return {
      isAdd: false,
      query: '',
      tabIndex: '1'
    };
  },
  mounted() {
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>