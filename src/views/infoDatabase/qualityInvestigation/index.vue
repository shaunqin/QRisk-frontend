<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        size="mini"
        v-model="query"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(query)"
      >搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="信息来源" width="100" />
      <el-table-column prop="bb" label="发生日期" width="100" />
      <el-table-column prop="dd" label="机型" />
      <el-table-column prop="ee" label="事件概述" />
      <el-table-column prop="ff" label="原因分析" width="120" />
      <el-table-column prop="gg" label="责任单位层级一" />
      <el-table-column prop="gg2" label="责任单位层级二" />
      <el-table-column prop="gg3" label="责任单位层级三" />
      <el-table-column prop="hh" label="产品" />
      <el-table-column prop="ii" label="系统" width="110" />
      <el-table-column prop="jj" label="危险源层级一" width="110" />
      <el-table-column prop="kk" label="危险源层级二" width="110" />
      <el-table-column prop="ll" label="危险源" />
      <el-table-column prop="mm" label="风险" />
      <el-table-column prop="nn" label="诱因" />
      <el-table-column prop="oo" label="附件报告" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { infoDatabase } from "@/dataSource";
export default {
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
  mounted() {
    this.loading = false;
    this.data = [
      {
        aa: "使用困难报告",
        bb: "2019/06/09",
        cc: "上海浦东",
        dd: "B737",
        ee: "",
        ff: "具体原因描述",
        gg: "运管部",
        gg2: "分公司",
        gg3: "中队",
        hh: "动机/APU",
        ii: "外部检查",
        jj: "管理文件",
        kk: "工作程序",
        ll: "程序编写存在缺陷",
        mm: "程序编写存在缺陷",
        nn: "未构成差错不安全事件",
        oo: ""
      },
      {
        aa: "可靠性报警",
        bb: "2019/06/09",
        cc: "上海浦东",
        dd: "A320",
        ee: "",
        ff: "具体原因描述",
        gg: "运管部",
        gg2: "分公司",
        gg3: "中队",
        hh: "动机/APU",
        ii: "外部检查",
        jj: "管理文件",
        kk: "工作程序",
        ll: "程序编写存在缺陷",
        mm: "程序编写存在缺陷",
        nn: "未构成差错不安全事件",
        oo: ""
      }
    ];
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  margin-bottom: 20px;
}
</style>