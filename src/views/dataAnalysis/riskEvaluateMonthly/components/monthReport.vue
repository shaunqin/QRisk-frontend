<template>
  <div class="content" id="toPDF">
    <div class="toPDF">
      <h4>一、关键风险状态</h4>
      <!-- 1-1 -->
      <h5 class="title-sec">1、月度关键风险状态</h5>
      <echart :chartData="data1_1" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-2 -->
    <div class="toPDF">
      <h5 class="title-sec">2、年度关键风险状态</h5>
      <el-table :data="data1_2" size="mini">
        <el-table-column label="公司关键风险" prop="name" width="120"></el-table-column>
        <el-table-column label="预警状态">
          <el-table-column label="1月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[0].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="2月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[1].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="3月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[2].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="4月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[3].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="5月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[4].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="6月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[5].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="7月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[6].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="8月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[7].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="9月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[8].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="10月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[9].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="11月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[10].num)"></span>
            </template>
          </el-table-column>
          <el-table-column label="12月">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[11].num)"></span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-3 -->
    <div class="toPDF">
      <h5 class="title-sec">3、关键风险TOP3趋势</h5>
      <echart :chartData="data1_3" height="500px" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-4 -->
    <div class="toPDF">
      <h5 class="title-sec">4、关键风险TOP3状态(各产品)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart :chartData="data1_4[0]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data1_4[1]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data1_4[2]" />
        </el-col>
      </el-row>
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-5 -->
    <div class="toPDF">
      <h5 class="title-sec">5、关键风险TOP3状态(各单位)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart :chartData="data1_5[0]" height="200px" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data1_5[1]" height="200px" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data1_5[2]" height="200px" />
        </el-col>
      </el-row>
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-6 -->
    <div class="toPDF">
      <h5 class="title-sec">6、关键风险TOP3关联危险源</h5>
      <el-table :data="data1_6" size="mini" border :span-method="objectSpanMethod">
        <el-table-column label="风险" prop="risk"></el-table-column>
        <el-table-column label="危险源" prop="sourceOfRiskName"></el-table-column>
        <el-table-column label="产品" prop="product"></el-table-column>
        <el-table-column label="风险值" prop="value"></el-table-column>
      </el-table>
      <br />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <h4>二、危险源风险状态</h4>
      <!-- 2-1 -->
      <h5 class="title-sec">1、危险源风险分布(一)</h5>
      <echart :chartData="data2_1" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-2 -->
    <div class="toPDF">
      <h5 class="title-sec">2、危险源风险分布(二)</h5>
      <echart :chartData="data2_2" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-3 -->
    <div class="toPDF">
      <h5 class="title-sec">3、危险源风险TOP3趋势</h5>
      <echart :chartData="data2_3" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-4 -->
    <div class="toPDF">
      <h5 class="title-sec">4、危险源风险TOP3趋势(各产品)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart :chartData="data2_4[0]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data2_4[1]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data2_4[2]" />
        </el-col>
      </el-row>
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-5 -->
    <div class="toPDF">
      <h5 class="title-sec">5、危险源风险TOP3趋势(各单位)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart :chartData="data2_5[0]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data2_5[1]" />
        </el-col>
        <el-col :span="8">
          <echart :chartData="data2_5[2]" />
        </el-col>
      </el-row>
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <h4>三、信息数据统计</h4>
      <!-- 3-1 -->
      <h5 class="title-sec">1、信息数据统计分布</h5>
      <echart :chartData="data3_1" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-2 -->
      <h5 class="title-sec">2、信息数据来源统计</h5>
      <echart :chartData="data3_2" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-3 -->
      <h5 class="title-sec">3、信息数据统计(各产品)</h5>
      <echart :chartData="data3_3" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-4 -->
      <h5 class="title-sec">4、信息数据统计(各系统)</h5>
      <echart :chartData="data3_4" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-5 -->
      <h5 class="title-sec">5、信息数据统计(各单位)</h5>
      <echart :chartData="data3_5" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <h4>四、月度点评与风险防控</h4>
      <el-form :model="form" label-width="auto" size="small" inline>
        <el-form-item label="时间">
          <el-date-picker v-model="form.date" style="width:150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="风险">
          <el-input v-model="form.risk" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="责任单位">
          <department
            :value="form.dept"
            @change="deptChange"
            style="width:200px;line-height: 32px;"
          ></department>
        </el-form-item>
      </el-form>
    </div>
    <br />
    <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
  </div>
</template>

<script>
import echart from "@/components/Charts";
import { getRiskAssessmentChartData } from "@/api/risk";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import department from "@/components/Department";

const monthString = "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月";
const monthxAxis = monthString.split(",");
export default {
  components: { echart, department },
  data() {
    return {
      data1_1: {},
      desc1_1: "",
      data1_2: [],
      data1_3: {},
      data1_4: { 0: {}, 1: {}, 2: {} },
      data1_5: { 0: {}, 1: {}, 2: {} },
      data1_6: [],
      data2_1: {},
      data2_2: {},
      data2_3: {},
      data2_4: { 0: {}, 1: {}, 2: {} },
      data2_5: { 0: {}, 1: {}, 2: {} },
      data3_1: {},
      data3_2: {},
      data3_3: {},
      data3_4: {},
      data3_5: {},
      desc4: "",
      loading: false,
      form: {},
    };
  },
  mounted() {
    getRiskAssessmentChartData(1).then((res) => {
      if (res) {
        let indicator = [];
        let data = [];
        res.map((item) => {
          indicator.push({ name: item.riskName, max: 100, color: "#000" });
          data.push(item.num);
        });
        this.data1_1 = {
          tooltip: { position: ["70%", 10] },
          radar: {
            indicator: indicator,
            splitArea: {
              show: true,
              areaStyle: {
                color: ["#fff", "#13ce66", "#ffba00", "#ff7600", "#e64242"],
              },
            },
            // splitNumber: 10,
          },
          series: [
            {
              name: "风险值",
              type: "radar",
              data: [{ value: data }],
              lineStyle: { color: "#1890ff" },
            },
          ],
        };
      }
    });
    getRiskAssessmentChartData(2).then((res) => {
      this.data1_2 = res;
    });
    getRiskAssessmentChartData(3).then((res) => {
      let seriesArr = [];
      let titleArr = [];
      res.map((item, index) => {
        seriesArr.push({
          name: item.name,
          type: "line",
          data: item.data.map((r) => r.num),
          yAxisIndex: index,
          xAxisIndex: index,
        });
        titleArr.push({
          text: item.name,
          top: index == 0 ? "0" : index == 1 ? "30%" : "60%",
        });
      });
      this.data1_3 = {
        tooltip: {
          trigger: "axis",
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
        },
        grid: [
          { top: 20, height: "25%", left: 150 },
          { top: "35%", height: "25%", left: 150 },
          { top: "65%", left: 150 },
        ],
        title: titleArr,
        xAxis: [
          { type: "category", data: monthxAxis, show: false },
          { type: "category", data: monthxAxis, show: false, gridIndex: 1 },
          { type: "category", data: monthxAxis, gridIndex: 2 },
        ],
        yAxis: [
          { type: "value" },
          { type: "value", gridIndex: 1 },
          { type: "value", gridIndex: 2 },
        ],
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(4).then((res) => {
      const color = ["#e6a700", "#ffba00", "#fbff00", "#13ce66", "#ff4949"];
      res.map((item, index) => {
        let xAxis = [],
          data = [];
        item.data.map((iitem, ii) => {
          xAxis.push(iitem.productName);
          data.push({
            value: iitem.num,
            itemStyle: {
              color: color[ii],
            },
          });
        });
        this.data1_4[index] = {
          tooltip: {},
          title: { text: item.name, left: "center" },
          grid: { top: 30, left: 100 },
          xAxis: { type: "value" },
          yAxis: { type: "category", data: xAxis },
          series: [
            {
              type: "bar",
              name: item.name,
              data: data,
              barMaxWidth: 20,
            },
          ],
        };
      });
    });
    getRiskAssessmentChartData(5).then((res) => {
      const color = ["#e6a700", "#ffba00", "#fbff00", "#13ce66", "#ff4949"];
      res.map((item, index) => {
        let xAxis = [],
          data = [];
        item.data.map((iitem, ii) => {
          xAxis.push(iitem.departmentNameCn);
          data.push({
            value: iitem.num,
            itemStyle: {
              color: color[ii],
            },
          });
        });
        this.data1_5[index] = {
          tooltip: {},
          title: { text: item.name, left: "center" },
          grid: { top: 30, left: 30 },
          xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: { type: "value" },
          series: [
            {
              type: "bar",
              name: item.name,
              data: data,
              barMaxWidth: 20,
            },
          ],
        };
      });
    });
    getRiskAssessmentChartData(6).then((res) => {
      res.map((item) => {
        item.data.map((iitem) => {
          this.data1_6.push({
            risk: item.name,
            sourceOfRiskName: iitem.sourceOfRiskName,
            product: iitem.productName,
            value: item.num,
          });
        });
      });
    });
    getRiskAssessmentChartData(7).then((res) => {
      let xAxis = [],
        data = [];
      res.map((item) => {
        xAxis.push(item.name);
        data.push(item.num);
      });
      this.data2_1 = {
        title: { text: "风险指数", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: xAxis,
          axisLabel: {
            rotate: 30,
          },
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "line",
            data: data,
          },
        ],
      };
    });
    getRiskAssessmentChartData(8).then((res) => {
      let xAxis = [];
      let seriesArr = [];
      res.map((item, index) => {
        let data = [];
        item.data.map((iitem) => {
          if (index == 0) {
            xAxis.push(iitem.sourceOfRiskName);
          }
          data.push({
            value: iitem.num,
            itemStyle: { color: iitem.color },
          });
        });
        seriesArr.push({
          name: item.name,
          type: "bar",
          stack: "risk",
          data,
          label: { show: true, color: "#000" },
          barMaxWidth: 20,
        });
      });
      this.data2_2 = {
        tooltip: { trigger: "axis" },
        title: { text: "风险状态图", left: "center" },
        grid: { show: true, backgroundColor: "#ececec" },
        xAxis: {
          type: "category",
          data: xAxis,
          axisLabel: {
            rotate: 30,
          },
        },
        yAxis: { type: "value" },
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(9).then((res) => {
      let seriesArr = [];
      let legendArr = [];
      res.map((item) => {
        let data = item.data.map((r) => r.num);
        legendArr.push(item.name);
        seriesArr.push({
          type: "line",
          data: data,
          name: item.name,
        });
      });
      this.data2_3 = {
        title: { text: "TOP3的风险趋势图", left: "center" },
        legend: { bottom: 10 },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: monthxAxis },
        yAxis: { type: "value" },
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(10).then((res) => {
      res.map((item, index) => {
        let xAxis = [];
        let seriesArr = [];
        const color = [];
        item.list.map((iitem, ii) => {
          if (xAxis.length == 0) {
            xAxis = iitem.data.map((r) => r.productName);
          }
          let data = [];
          iitem.data.map((iiitem) => {
            data.push(iiitem.num);
          });
          color.push(iitem.color);
          if (ii < 5) {
            seriesArr.push({
              type: "bar",
              name: iitem.name,
              data,
              stack: "risk",
              label: { show: true, color: "#000" },
              barMaxWidth: 20,
            });
          } else {
            seriesArr.push({
              type: "line",
              name: iitem.name,
              data,
            });
          }
        });
        this.data2_4[index] = {
          color,
          tooltip: { trigger: "axis" },
          legend: { bottom: 10, backgroundColor: "#ececec" },
          title: { text: item.name, left: "center" },
          grid: {
            top: 30,
            left: 35,
            bottom: 90,
            show: true,
            backgroundColor: "#ececec",
          },
          xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: { type: "value" },
          series: seriesArr,
        };
      });
    });
    getRiskAssessmentChartData(11).then((res) => {
      res.map((item, index) => {
        let xAxis = [];
        let seriesArr = [];
        const color = [];
        item.list.map((iitem, ii) => {
          if (xAxis.length == 0) {
            xAxis = iitem.data.map((r) => r.departmentNameCn);
          }
          let data = [];
          iitem.data.map((iiitem) => {
            data.push(iiitem.num);
          });
          color.push(iitem.color);
          if (ii < 5) {
            seriesArr.push({
              type: "bar",
              name: iitem.name,
              data,
              stack: "risk",
              label: { show: true, color: "#000" },
              barMaxWidth: 20,
            });
          } else {
            seriesArr.push({
              type: "line",
              name: iitem.name,
              data,
            });
          }
        });
        this.data2_5[index] = {
          color,
          tooltip: { trigger: "axis" },
          legend: { bottom: 10, backgroundColor: "#ececec" },
          title: { text: item.name, left: "center" },
          grid: {
            top: 30,
            left: 35,
            bottom: 90,
            show: true,
            backgroundColor: "#ececec",
          },
          xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: { type: "value" },
          series: seriesArr,
        };
      });
    });
    getRiskAssessmentChartData(12).then((res) => {
      let seriesArr = [];
      let dataArr = [];
      res.map((item) => {
        let data = item.data.map((r) => r.num);
        dataArr.push(data);
        seriesArr.push({
          type: "bar",
          stack: "risk",
          name: item.name,
          data: data,
          label: { show: true },
          barMaxWidth: 20,
        });
      });
      // 计算总和
      let sunData = [];
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          if (sunData[j] == null) sunData[j] = 0;
          sunData[j] += dataArr[i][j];
        }
      }
      seriesArr.push({
        type: "line",
        name: "总数",
        data: sunData,
      });
      this.data3_1 = {
        legend: { bottom: 10 },
        tooltip: { trigger: "axis" },
        title: { text: "信息数据趋势图", left: "center" },
        xAxis: { type: "category", data: monthxAxis },
        yAxis: { type: "value" },
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(13).then((res) => {
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.dataTypeName);
      let legendArr = [];
      res.map((item) => {
        let data = item.data.map((r) => r.num);
        legendArr.push(item.name);
        seriesArr.push({
          type: "bar",
          name: item.name,
          data,
          label: { show: true, color: "#000", position: "top" },
          barMaxWidth: 20,
        });
      });
      // 饼图
      getRiskAssessmentChartData(17).then((res) => {
        let data = [];
        let legendArr2 = [];
        res.map((item) => {
          legendArr2.push(item.name);
          data.push({ name: item.name, value: item.num });
        });
        seriesArr.push({
          type: "pie",
          radius: [0, "60%"],
          center: ["75%", "50%"],
          data,
        });

        this.data3_2 = {
          tooltip: {},
          legend: [
            { bottom: 10, left: "20%", data: legendArr },
            { bottom: 10, right: "10%", data: legendArr2 },
          ],
          title: [
            { text: "信息数据统计", left: "20%" },
            { text: "图表标题", right: "22%" },
          ],
          grid: [{ width: "40%", bottom: 80 }, { left: "50%" }],
          xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: { type: "value" },
          series: seriesArr,
        };
      });
    });
    getRiskAssessmentChartData(14).then((res) => {
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.productName);
      res.map((item) => {
        let data = [];
        item.data.map((iitem) => {
          data.push(iitem.num);
        });
        seriesArr.push({
          type: "bar",
          name: item.name,
          data,
          stack: "infodb",
          label: { show: true },
          barMaxWidth: 20,
        });
      });
      this.data3_3 = {
        tooltip: { trigger: "axis" },
        legend: { bottom: 10 },
        title: { text: "各产品分布图", left: "center" },
        xAxis: { type: "value" },
        yAxis: { type: "category", data: xAxis },
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(15).then((res) => {
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.systemName);
      let dataArr = [];
      res.map((item) => {
        let data = item.data.map((r) => r.num);
        dataArr.push(data);
        seriesArr.push({
          type: "bar",
          name: item.name,
          data,
          stack: "infodb",
          label: { show: true },
          barMaxWidth: 20,
        });
      });
      // 计算总和
      let sunData = [];
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          if (sunData[j] == null) sunData[j] = 0;
          sunData[j] += dataArr[i][j];
        }
      }
      seriesArr.push({
        type: "line",
        name: "总数",
        data: sunData,
      });
      this.data3_4 = {
        tooltip: { trigger: "axis" },
        legend: { bottom: 10 },
        title: { text: "各系统分布图", left: "center" },
        yAxis: { type: "value" },
        xAxis: { type: "category", data: xAxis },
        series: seriesArr,
      };
    });
    getRiskAssessmentChartData(16).then((res) => {
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.departmentNameCn);
      let dataArr = [];
      res.map((item) => {
        let data = item.data.map((r) => r.num);
        dataArr.push(data);
        seriesArr.push({
          type: "bar",
          name: item.name,
          data,
          stack: "infodb",
          label: { show: true },
          barMaxWidth: 20,
        });
      });
      // 计算总和
      let sunData = [];
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          if (sunData[j] == null) sunData[j] = 0;
          sunData[j] += dataArr[i][j];
        }
      }
      seriesArr.push({
        type: "line",
        name: "总数",
        data: sunData,
      });
      this.data3_5 = {
        tooltip: { trigger: "axis" },
        legend: { bottom: 10 },
        title: { text: "各单位分布图", left: "center" },
        yAxis: { type: "value" },
        xAxis: { type: "category", data: xAxis },
        series: seriesArr,
      };
    });
  },
  methods: {
    getCirclePoint(num) {
      if (num == 10) {
        return "#e6a700";
      } else if (num == 20) {
        return "#11b95c";
      } else {
        return "#fff700";
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0 || columnIndex === 3) {
        if (rowIndex % 3 == 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        } else return [0, 0];
      }
    },
    deptChange(val) {
      this.form.dept = val;
    },
    submit() {
      this.loading = true;
      // this.$nextTick(() => {
      //   this.exportPDF();
      // });
      let time = setTimeout(() => {
        window.clearTimeout(time);
        this.exportPDF();
      }, 1000);
    },
    exportPDF() {
      let dom = document.getElementsByClassName("toPDF");
      var pdf = new jsPDF("p", "pt", "a4");
      let _index = 0;
      let _height = 0;
      //pdf页面偏移
      var position = 0;
      Array.prototype.forEach.call(dom, (el) => {
        html2canvas(el, { dpi: 300 }).then((canvas) => {
          _index++;
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          var pageHeight = (contentWidth / 592.28) * 841.89;
          //未生成pdf的html页面高度
          var leftHeight = contentHeight;

          //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
          var imgWidth = 595.28;
          var imgHeight = (592.28 / contentWidth) * contentHeight;

          var imgData = canvas.toDataURL("image/jpeg", 1.0);
          _height += imgHeight + 20;

          //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (_height < 841.89) {
            pdf.addImage(
              imgData,
              "JPEG",
              0,
              _height - imgHeight,
              imgWidth,
              imgHeight
            );
          } else {
            _height = imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, 10, imgWidth, imgHeight);
          }
          if (_index == dom.length) {
            pdf.save("月度风险评价报告.pdf");
            this.loading = false;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 10px;
}
.title-sec {
  text-indent: 16px;
}
.cicle {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 50%;
}
</style>