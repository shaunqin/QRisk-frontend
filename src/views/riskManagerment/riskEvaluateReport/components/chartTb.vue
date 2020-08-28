<template>
  <div v-if="show">
    <el-row>
      <el-col :span="8">
        <echart :chartData="chartData" />
      </el-col>
      <el-col :span="8">
        <echart :chartData="chartData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from "@/components/Charts";
import { quertChartOfType } from "@/api/risk";
import { eventBus } from "@/utils/eventBus";
export default {
  components: { echart },
  data() {
    return {
      chartData: {},
      show: true,
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
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            this.$nextTick(() => {
              this.loadData();
            });
          }
          this.loadData();
        });
      },
    },
  },
  mounted() {},
  methods: {
    loadData() {
      this.chartData = {
        series: [
          {
            type: "pie",
            data: [
              { value: 200, name: "Apple" },
              {
                value: 310,
                name: "Grapes",
              },
              {
                value: 234,
                name: "Pineapples",
              },
              {
                value: 135,
                name: "Oranges",
              },
              {
                value: 1548,
                name: "Bananas",
              },
            ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>