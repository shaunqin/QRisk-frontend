<template>
  <div v-if="show">
    <div class="export">
      <el-button
        size="mini"
        type="success"
        icon="el-icon-download"
        @click="download"
        :loading="exportLoading"
      >导出</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <echart ref="chart" :chartData="chartData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from "@/components/Charts";
import { quertChartOfType } from "@/api/risk";
import { eventBus } from "@/utils/eventBus";
import { downloadToExcelImage } from "@/api/risk";
import { mapGetters } from "vuex";
export default {
  components: { echart },
  data() {
    return {
      chartData: {},
      show: true,
      exportLoading: false,
    };
  },
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    form: {
      // immediate: true,
      deep: true,
      handler(val) {
        this.show = false;
        quertChartOfType(val).then((res) => {
          this.show = true;
          eventBus.$emit("close-dialog");
          eventBus.$emit("tab-change", "2");
          // if (res.code != "200") {
          //   this.$message.error(res.msg);
          // } else {
          //   this.$nextTick(() => {
          //     this.loadData(res);
          //   });
          // }
          this.$nextTick(() => {
            this.loadData(res);
          });
        });
      },
    },
    resetChart(val) {
      if (val == 2) {
        this.$refs["chart"].resizeHandler();
      }
    },
  },
  computed: {
    ...mapGetters(["resetChart"]),
    chartType() {
      if (this.form.type) {
        return this.form.type;
      } else {
        return "line";
      }
    },
  },
  mounted() {},
  methods: {
    loadData(res) {
      // 单系列
      if (this.form.series == "") {
        let xAxis = [],
          data = [],
          pieData = [];
        res.map((item) => {
          xAxis.push(item.name);
          data.push(item.num);
          pieData.push({
            value: item.num,
            name: item.name,
          });
        });
        if (this.chartType != "pie") {
          this.chartData = {
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: xAxis },
            yAxis: { type: "value" },
            series: {
              type: this.chartType,
              data,
              barMaxWidth: 20,
            },
          };
        } else {
          this.chartData = {
            series: {
              type: this.chartType,
              data: pieData,
            },
          };
        }
      } else {
        // 多系列
        // 取出x轴的字段
        let obj = res[0].data[0];
        let key = "";
        for (let x in obj) {
          if (x != "num" && obj[x] != null) {
            key = x;
          }
        }
        // x轴数据
        let xAxis = res[0].data.map((r) => r[key]);
        console.log(xAxis);
        let seriesArr = [];
        res.map((item) => {
          let data = item.data.map((r) => r.num);
          seriesArr.push({
            type: this.chartType,
            data,
            name: item.name,
            barMaxWidth: 20,
          });
        });
        this.chartData = {
          legend: {},
          tooltip: { trigger: "axis" },
          xAxis: { type: "category", data: xAxis },
          yAxis: { type: "value" },
          series: seriesArr,
        };
      }
    },
    download() {
      this.exportLoading = true;
      let chart = this.$refs["chart"].chart;
      let base64 = "";
      if (chart) {
        base64 = chart.getDataURL();
        console.log(base64);
      }
      downloadToExcelImage(this.form).then((res) => {
        this.exportLoading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let url = process.env.VUE_APP_BASE_API + res.obj;
          window.open(url);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.export {
  text-align: right;
}
</style>