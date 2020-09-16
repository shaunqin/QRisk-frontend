<template>
  <div class="app-container">
    <div class="head-container">
      <el-button type="success" icon="el-icon-s-data" size="mini">生成国航报表</el-button>
      <el-button type="success" icon="el-icon-s-data" size="mini">生成局方报表</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <!-- 危险源列表 -->
          <el-table :data="scope.row.children" size="mini">
            <el-table-column prop="aa" label="隐患名称" />
            <el-table-column prop="bb" label="发现时间" />
            <el-table-column prop="cc" label="来源" />
            <el-table-column prop="dd" label="等级" />
            <el-table-column prop="ee" label="主体单位" />
            <el-table-column prop="ff" label="涉及业务" />
            <el-table-column prop="gg" label="涉及流程" />
            <el-table-column prop="hh" label="监管单位" />
            <el-table-column prop="ii" label="原因分析" />
            <el-table-column prop="jj" label="等效措施" />
            <el-table-column prop="kk" label="责任人" />
            <el-table-column prop="ll" label="整改时限" />
            <el-table-column prop="mm" label="验证标准" />
            <el-table-column prop="nn" label="措施实施情况跟踪" />
            <el-table-column prop="oo" label="治理结果情况跟踪" />
            <el-table-column prop="pp" label="整改进展" />
            <el-table-column prop="qq" label="备注" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="任务名称" />
      <el-table-column prop="bb" label="编号" />
      <el-table-column prop="cc" label="时间" />
      <el-table-column prop="dd" label="年度" />
      <el-table-column prop="ee" label="反馈日期" />
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type size="mini" @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
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
    <!-- 统计 -->
    <detail ref="detail"></detail>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import detail from "./components/detail";
export default {
  components: { detail },
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
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06",
        children: [
          {
            aa: "方案制定存在缺陷",
            bb: "2020-02-22",
            cc: "数据分析",
            dd: "3",
            ee: "上海",
            ff: "维修",
            gg: "开发",
            hh: "上海",
            ii: "方案制定",
            jj: "重新制定",
            kk: "admin",
            ll: "3",
            mm: "符合规范",
            nn: "跟踪状态",
            oo: "跟踪状态",
            pp: "待完成",
            qq: "备注信息"
          }
        ]
      },
      {
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06",
        children: [
          {
            aa: "方案制定存在缺陷",
            bb: "2020-02-22",
            cc: "数据分析",
            dd: "3",
            ee: "上海",
            ff: "维修",
            gg: "开发",
            hh: "上海",
            ii: "方案制定",
            jj: "重新制定",
            kk: "admin",
            ll: "3",
            mm: "符合规范",
            nn: "跟踪状态",
            oo: "跟踪状态",
            pp: "待完成",
            qq: "备注信息"
          }
        ]
      },
      {
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06",
        children: [
          {
            aa: "方案制定存在缺陷",
            bb: "2020-02-22",
            cc: "数据分析",
            dd: "3",
            ee: "上海",
            ff: "维修",
            gg: "开发",
            hh: "上海",
            ii: "方案制定",
            jj: "重新制定",
            kk: "admin",
            ll: "3",
            mm: "符合规范",
            nn: "跟踪状态",
            oo: "跟踪状态",
            pp: "待完成",
            qq: "备注信息"
          }
        ]
      },
      {
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06",
        children: [
          {
            aa: "方案制定存在缺陷",
            bb: "2020-02-22",
            cc: "数据分析",
            dd: "3",
            ee: "上海",
            ff: "维修",
            gg: "开发",
            hh: "上海",
            ii: "方案制定",
            jj: "重新制定",
            kk: "admin",
            ll: "3",
            mm: "符合规范",
            nn: "跟踪状态",
            oo: "跟踪状态",
            pp: "待完成",
            qq: "备注信息"
          }
        ]
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
    },
    detail() {
      let _this = this.$refs.detail;
      _this.form = {
        aa: "方案制定存在缺陷",
        bb: "YP2020050501",
        cc: "2020-05-06",
        dd: "2020",
        ee: "2020-05-06"
      };
      _this.dialog = true;
    },
    edit() {},
    subDelete() {}
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