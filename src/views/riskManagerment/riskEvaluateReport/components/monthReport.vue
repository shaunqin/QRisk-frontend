<template>
  <div>
    <h4>一、标题一</h4>
    <h5 class="title-sec">1、小标题一</h5>
        <echart :chartData="chartData" />
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
.title-sec {
  text-indent: 16px;
}
</style>