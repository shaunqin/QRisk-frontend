<template>
  <div>
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
export default {
  components: { echart },
  data() {
    return {
      chartData: {},
    };
  },
  mounted() {
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
};
</script>

<style lang="scss" scoped>
</style>