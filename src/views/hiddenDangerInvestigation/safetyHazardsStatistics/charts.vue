<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="统计"
    custom-class="big_dialog"
  >
    <el-row>
      <el-col :span="12">
        <echarts :chartData="chartData" width="100%" />
      </el-col>
      <el-col :span="12">
        <echarts :chartData="chartData" width="100%" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import initData from "@/mixins/initData";
import echarts from "@/components/Charts/index";
export default {
  components: { echarts },
  mixins: [initData],
  data() {
    return {
      dialog: false,
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
  computed: {
    chartData() {
      return {
        series: [
          {
            name: "访问来源",
            type: "pie", // 设置图表类型为饼图
            radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              { value: 235, name: "隐患等级1" },
              { value: 274, name: "隐患等级2" },
              { value: 310, name: "隐患等级3" },
              { value: 335, name: "隐患等级4" },
              { value: 400, name: "隐患等级5" }
            ]
          }
        ]
      };
    }
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
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
    add() {},
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