<template>
  <div class="dataSource">
    <div class="head-container">
      <department style="width:400px" :value="department" @change="deptChange"></department>
    </div>
    <el-row :gutter="16">
      <el-col :span="12">
        <table-l :deptPath="department"></table-l>
      </el-col>
      <el-col :span="12">
        <table-r :deptPath="department"></table-r>
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
import { riskOtherStandard } from "@/dataSource";
import tableL from "./tableL";
import tableR from "./tableR";
import charts from "@/components/Charts";
import department from "@/components/Department";
import { queryMatrixData } from "@/api/standard";
export default {
  components: { tableL, tableR, charts, department },
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: null,
      chartData: {},
      data: []
    };
  },
  created() {
    this.getChartsData();
  },
  methods: {
    // 热力图
    renderChart(x, y, data) {
      this.chartData = {
        tooltip: {
          // position: "top"
        },
        animation: false,
        grid: {
          // height: "50%",
          top: "10%",
          left: "13%",
          right:20
        },
        xAxis: {
          type: "category",
          data: x,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: "category",
          data: y,
          splitArea: {
            show: true
          }
        },
        // visualMap: {
        //   min: 0,
        //   max: 20000,
        //   calculable: true,
        //   orient: "horizontal",
        //   left: "center",
        //   bottom: "15%",
        //   show: false,
        //   dimension: 2
        //   // inRange: {
        //   //   color: ["#fff", "#4C8D00", "#F8E71C", "#F5A623", "#D0021B"]
        //   // }
        // },
        series: [
          {
            name: "风险等级",
            type: "heatmap",
            data: data,
            label: {
              show: true,
              color: "#000"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            itemStyle: {
              color: params => params.data[3]
            }
          }
        ]
      };
    },
    deptChange(val) {
      this.department = val;
      this.getChartsData();
    },
    getChartsData() {
      queryMatrixData(this.department || "000003").then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { x, y, data } = res.obj;
          let _xAxis = [],
            _yAxis = [];
          x.map(item => {
            _xAxis.push(item.riskLevel);
          });
          y.map(item => {
            _yAxis.push(`${item.riskLevel}(${item.standard})`);
          });
          this.renderChart(_xAxis, _yAxis, data);
        }
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