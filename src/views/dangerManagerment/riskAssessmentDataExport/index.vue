<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="12">
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="data"
          size="small"
          style="width: 100%;"
          border
        >
          <el-table-column prop="aa" label="危险源层级一" width="120" />
          <el-table-column prop="bb" label="白区" />
          <el-table-column prop="cc" label="黄区" />
          <el-table-column prop="dd" label="绿区" />
          <el-table-column prop="ee" label="橙区" />
          <el-table-column prop="ff" label="总计" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <echarts width="100%" height="380px" :chartData="chartData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import echarts from "@/components/Charts";
export default {
  components: { echarts },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      chartData: {}
    };
  },
  mounted() {
    this.loading = false;
    this.data = [
      { aa: "工具设备", bb: "", cc: "1", dd: "", ee: "", ff: "1" },
      { aa: "管理文件", bb: "8", cc: "", dd: "", ee: "", ff: "8" },
      { aa: "技术文件", bb: "1", cc: "", dd: "", ee: "", ff: "" },
      { aa: "特种车辆", bb: "", cc: "", dd: "", ee: "1", ff: "1" },
      { aa: "文件控制", bb: "", cc: "1", dd: "", ee: "", ff: "1" },
      { aa: "资质能力", bb: "", cc: "", dd: "1", ee: "", ff: "1" },
      { aa: "总计", bb: "9", cc: "1", dd: "1", ee: "1", ff: "13" },
    ];
    this.renderChart();
  },
  methods: {
    renderChart() {
      let _xAxis = [
        "管理文件",
        "工具设备",
        "技术文件",
        "特种车辆",
        "文件控制",
        "资质能力"
      ];
      let _legend = ["白区", "黄区", "橙区", "绿区"];
      this.chartData = {
        // legend: _legend,
        tooltip: {},
        xAxis: {
          data: _xAxis,
          splitLine: {
            show: false
          }
        },
        grid: {
          top: 10
        },
        yAxis: {},
        series: [
          {
            // name: "bar",
            type: "bar",
            data: [8, 1, 1, 1, 1, 1]
          }
        ]
      };
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
