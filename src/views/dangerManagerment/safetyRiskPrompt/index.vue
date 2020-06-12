<template>
  <div class="app-container">
    
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
      <el-table-column prop="aa" label="主题" width="80" />
      <el-table-column prop="bb" label="背景" align="left" />
      <el-table-column prop="cc" label="安全风险" align="left" />
      <el-table-column prop="dd" label="风险防范" align="left" />
      <el-table-column prop="ee" label="责任单位" width="80" />
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
import eform from "./form";
export default {
  components: { eform },
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
    for (let i = 0; i < 15; i++) {
      this.data.push({
        aa: "测试",
        bb: "2020 年 6 月 5 日，A321/B-1833 飞机执行 CA1948 航班，成都起 飞后地面监控出现 AIR R WING LEAK 警告信息，飞机返航…",
        cc: "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降…",
        dd: "1、认真做好重复性故障的管控工作。各单位要高度重视飞机出 现的重复性故障，加强对排故力量的组织;对于飞机运行中出现的 重复、疑难故障，工程技术人员要及时研究和制定排…",
        ee: "测试"
      });
    }
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
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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