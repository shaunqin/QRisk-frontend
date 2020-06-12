<template>
  <div class="dataSource">
    <div class="head-container">
      <el-select v-model="department" placeholder="请选择部门">
        <el-option label="部门1" value="1"></el-option>
        <el-option label="部门2" value="2"></el-option>
      </el-select>
    </div>
    <el-row :gutter="16">
      <el-col :span="12">
        <table-l></table-l>
      </el-col>
      <el-col :span="12">
        <table-r></table-r>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <charts width="100%" height="400px" :chartData="chartData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { riskOtherStandard } from "@/dataSource";
import tableL from "./tableL";
import tableR from "./tableR";
import charts from "@/components/Charts";
export default {
  components: { tableL, tableR, charts },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: "",
      chartData: {}
    };
  },
  mounted() {
    this.loading = false;
    this.data = riskOtherStandard;
    this.renderChart();
  },
  methods: {
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
    },
    // 热力图
    renderChart() {
      var hours = ["1级", "2级", "3级", "4级", "5级", "6级", "7级", "8级"];
      var days = [
        "1级(不安全信息级)",
        "2级(不安全事件级)",
        "3级(相当于一般差错级)",
        "4级(相当于严重差错级)",
        "5级(一般事故差错级)",
        "6级(严重事故差错级)",
        "7级(一般事故级)",
        "8级(重大事故级)"
      ];

      var data = [
        [0, 0, 298],
        [0, 1, 565],
        [0, 2, 880],
        [0, 3, 866],
        [0, 4, 537],
        [0, 5, 841],
        [0, 6, 760],
        [0, 7, 100],
        [1, 0, 283],
        [1, 1, 259],
        [1, 2, 619],
        [1, 3, 486],
        [1, 4, 601],
        [1, 5, 739],
        [1, 6, 614],
        [1, 7, 300],
        [2, 0, 827],
        [2, 1, 827],
        [2, 2, 468],
        [2, 3, 515],
        [2, 4, 232],
        [2, 5, 363],
        [2, 6, 445],
        [2, 7, 1000],
        [3, 0, 601],
        [3, 1, 827],
        [3, 2, 232],
        [3, 3, 445],
        [3, 4, 601],
        [3, 5, 468],
        [3, 6, 614],
        [3, 7, 2000],
        [4, 0, 345],
        [4, 1, 345],
        [4, 2, 345],
        [4, 3, 345],
        [4, 4, 345],
        [4, 5, 345],
        [4, 6, 345],
        [4, 7, 345],
        [5, 0, 456],
        [5, 1, 456],
        [5, 2, 456],
        [5, 3, 456],
        [5, 4, 456],
        [5, 5, 456],
        [5, 6, 456],
        [5, 7, 456],
        [6, 0, 789],
        [6, 1, 789],
        [6, 2, 789],
        [6, 3, 789],
        [6, 4, 789],
        [6, 5, 789],
        [6, 6, 789],
        [6, 7, 789],
        [7, 0, 789],
        [7, 1, 789],
        [7, 2, 789],
        [7, 3, 789],
        [7, 4, 789],
        [7, 5, 789],
        [7, 6, 789],
        [7, 7, 789]
      ];

      data = data.map(function(item) {
        return [item[1], item[0], item[2] || "-"];
      });
      this.chartData = {
        tooltip: {
          position: "top"
        },
        animation: false,
        grid: {
          // height: "50%",
          top: "10%",
          left:"13%"
        },
        xAxis: {
          type: "category",
          data: hours,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: "category",
          data: days,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 2000,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "15%",
          show:false
        },
        series: [
          {
            name: "Punch Card",
            type: "heatmap",
            data: data,
            label: {
              show: true
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
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