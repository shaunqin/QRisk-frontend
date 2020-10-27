<template>
  <div class="content" id="toPDF">
    <div class="toPDF">
      <h3 class="center">月度风险评价报告1</h3>
      <h4>一、关键风险状态</h4>
      <!-- 1-1 -->
      <h5 class="title-sec">1、月度关键风险状态</h5>
      <echart ref="image1" :chartData="data1_1" v-loading="loading" />
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
          <el-table-column :label="item" v-for="item in data1_2_columns" :key="item">
            <template slot-scope="{row}">
              <span class="cicle" :style="'background:'+getCirclePoint(row.data[0].num)"></span>
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
      <echart ref="image2" :chartData="data1_3" height="500px" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 1-4 -->
    <div class="toPDF">
      <h5 class="title-sec">4、关键风险TOP3状态(各产品)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart ref="image3" :chartData="data1_4[0]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image4" :chartData="data1_4[1]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image5" :chartData="data1_4[2]" v-loading="loading" />
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
          <echart ref="image6" :chartData="data1_5[0]" height="200px" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image7" :chartData="data1_5[1]" height="200px" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image8" :chartData="data1_5[2]" height="200px" v-loading="loading" />
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
      <echart ref="image9" :chartData="data2_1" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-2 -->
    <div class="toPDF">
      <h5 class="title-sec">2、危险源风险分布(二)</h5>
      <echart ref="image10" :chartData="data2_2" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-3 -->
    <div class="toPDF">
      <h5 class="title-sec">3、危险源风险TOP3趋势</h5>
      <echart ref="image11" :chartData="data2_3" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <!-- 2-4 -->
    <div class="toPDF">
      <h5 class="title-sec">4、危险源风险TOP3趋势(各产品)</h5>
      <el-row :gutter="8">
        <el-col :span="8">
          <echart ref="image12" :chartData="data2_4[0]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image13" :chartData="data2_4[1]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image14" :chartData="data2_4[2]" v-loading="loading" />
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
          <echart ref="image15" :chartData="data2_5[0]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image16" :chartData="data2_5[1]" v-loading="loading" />
        </el-col>
        <el-col :span="8">
          <echart ref="image17" :chartData="data2_5[2]" v-loading="loading" />
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
      <echart ref="image18" :chartData="data3_1" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-2 -->
      <h5 class="title-sec">2、信息数据来源统计</h5>
      <echart ref="image19" :chartData="data3_2" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-3 -->
      <h5 class="title-sec">3、信息数据统计(各产品)</h5>
      <echart ref="image20" :chartData="data3_3" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-4 -->
      <h5 class="title-sec">4、信息数据统计(各系统)</h5>
      <echart ref="image21" :chartData="data3_4" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <!-- 3-5 -->
      <h5 class="title-sec">5、信息数据统计(各单位)</h5>
      <echart ref="image22" :chartData="data3_5" v-loading="loading" />
      <el-input v-model="desc1_1" placeholder>
        <template slot="prepend">注释：</template>
      </el-input>
    </div>
    <div class="toPDF">
      <h4>四、月度点评与风险防控</h4>
      <el-form :model="formData" size="small" inline>
        <el-form-item label="时间">
          <el-date-picker v-model="formData.date" style="width:150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="风险">
          <el-input v-model="formData.risk" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="责任单位">
          <department
            :value="formData.dept"
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
import { mapGetters } from "vuex";

const monthString = "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月";
const monthxAxis = monthString.split(",");
export default {
  components: { echart, department },
  data() {
    return {
      loading: false,
      data1_1: {},
      desc1_1: "",
      data1_2: [],
      data1_2_columns: [],
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
      formData: {},
      spanArr: [],
      position: 0
    };
  },
  props: {
    form: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        if (!val.responsibleUnitList) {
          this.init();
        }
      }
    },
    resetChart(val) {
      if (val == 3) {
        for (let i = 1; i < 23; i++) {
          this.$refs[`image${i}`].resizeHandler();
        }
      }
    },
  },
  computed: {
    ...mapGetters(["resetChart"]),
  },
  mounted() {

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
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
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
      // 计算总页数 
      let totalPage = 0;
      let t_height = 0;
      Array.prototype.forEach.call(dom, (el) => {
        let el_h = el.offsetHeight;
        t_height += el_h + 20;
        if (t_height > 841.89) {
          totalPage++;
          t_height = 0;
        }
      })
      var pdf = new jsPDF("p", "pt", "a4");
      pdf.text(290, 830, '1/' + totalPage);
      let page = 2;
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
            pdf.text(290, 830, page + "/" + totalPage);
            page++;
          }
          if (_index == dom.length) {
            pdf.save("月度风险评价报告.pdf");
            this.loading = false;
          }
        });
      });
    },
    render1_1(res) {
      let indicator = [];
      let data = [];
      res.map((item) => {
        indicator.push({ name: item.name, max: 20000, color: "#000" });
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
    },
    render1_2(res) {
      // 动态绑定列
      let columns = [];
      res[0].data.map(item => {
        columns.push(item.name);
      })
      this.data1_2_columns = columns;
      this.data1_2 = res;
    },
    render1_3(res) {
      let seriesArr = [];
      let titleArr = [];
      let _monthxAxis = res[0].data.map(r => r.name);
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
          { type: "category", data: _monthxAxis, show: false },
          { type: "category", data: _monthxAxis, show: false, gridIndex: 1 },
          { type: "category", data: _monthxAxis, gridIndex: 2 },
        ],
        yAxis: [
          { type: "value" },
          { type: "value", gridIndex: 1 },
          { type: "value", gridIndex: 2 },
        ],
        series: seriesArr,
      };
    },
    render1_4(res) {
      const color = ["#e6a700", "#ffba00", "#fbff00", "#13ce66", "#ff4949"];
      res.map((item, index) => {
        let xAxis = [],
          data = [];
        item.data.map((iitem, ii) => {
          xAxis.push(iitem.name);
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
    },
    render1_5(res) {
      const color = ["#e6a700", "#ffba00", "#fbff00", "#13ce66", "#ff4949"];
      res.map((item, index) => {
        let xAxis = [],
          data = [];
        item.data.map((iitem, ii) => {
          xAxis.push(iitem.name);
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
    },
    render1_6(res) {
      res.map((item) => {
        item.data.map((iitem) => {
          this.data1_6.push({
            risk: item.name,
            sourceOfRiskName: iitem.name,
            product: iitem.name2,
            value: item.num,
          });
        });
      });
      console.log(this.data1_6)
      this.spanArr = [];
      this.position = 0;
      this.data1_6.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (this.data1_6[index].risk === this.data1_6[index - 1].risk) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
      console.log(this.spanArr)
    },
    render2_1(res) {
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
    },
    render2_2(res) {
      if (res.length == 0) return;
      let xAxis = res[0].data.map(r => r.name);
      let seriesArr = [];
      res.map((item, index) => {
        let data = [];
        item.data.map((iitem) => {
          data.push({
            value: iitem.num,
            itemStyle: { color: item.color },
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
    },
    render2_3(res) {
      if (res.length == 0) return;
      let seriesArr = [];
      let legendArr = [];
      let _monthxAxis = res[0].data.map(r => r.name)
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
        xAxis: { type: "category", data: _monthxAxis },
        yAxis: { type: "value" },
        series: seriesArr,
      };
    },
    render2_4(res) {
      res.map((item, index) => {
        let xAxis = [];
        let seriesArr = [];
        const color = [];
        item.data.map((iitem, ii) => {
          if (xAxis.length == 0) {
            xAxis = iitem.data.map((r) => r.name);
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
    },
    render2_5(res) {
      res.map((item, index) => {
        let xAxis = [];
        let seriesArr = [];
        const color = [];
        item.data.map((iitem, ii) => {
          if (xAxis.length == 0) {
            xAxis = iitem.data.map((r) => r.name);
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
    },
    render3_1(res) {
      if (res.length == 0) return;
      let seriesArr = [];
      let dataArr = [];
      let _monthxAxis = res[0].data.map(r => r.name);
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
        xAxis: { type: "category", data: _monthxAxis },
        yAxis: { type: "value" },
        series: seriesArr,
      };
    },
    render3_2(res, res2) {
      let seriesArr = [];
      let xAxis = [];
      let legendArr = [];
      let data2 = [];
      res.map((item) => {
        data2.push(item.num);
        // legendArr.push(item.name);
        xAxis.push(item.name);
      });
      seriesArr.push({
        type: "bar",
        data: data2,
        label: { show: true, color: "#000", position: "top" },
        barMaxWidth: 20,
      });
      // 饼图
      let data = [];
      let legendArr2 = [];
      res2.map((item) => {
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
          // { bottom: 10, left: "1%", data: legendArr },
          { bottom: 10, right: "1%", data: legendArr2 },
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
    },
    render3_3(res) {
      if (res.length == 0) return;
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.name);
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
    },
    render3_4(res) {
      if (res.length == 0) return;
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.name);
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
    },
    render3_5(res) {
      if (res.length == 0) return;
      let seriesArr = [];
      let xAxis = res[0].data.map((r) => r.name);
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
    },
    init() {
      this.loading = true;
      getRiskAssessmentChartData(this.form).then(res => {
        try {
          if (res) {
            this.render1_1(res.find(r => r.imageNo == '1-1').data); // 1
            this.render1_2(res.find(r => r.imageNo == '1-2').data); // 2
            this.render1_3(res.find(r => r.imageNo == '1-3').data); // 3
            this.render1_4(res.find(r => r.imageNo == '1-4').data); // 4
            this.render1_5(res.find(r => r.imageNo == '1-5').data); // 5
            this.render1_6(res.find(r => r.imageNo == '1-6').data); // 6
            this.render2_1(res.find(r => r.imageNo == '2-1').data); // 7
            this.render2_2(res.find(r => r.imageNo == '2-2').data); // 8
            this.render2_3(res.find(r => r.imageNo == '2-3').data); // 9
            this.render2_4(res.find(r => r.imageNo == '2-4').data); // 10
            this.render2_5(res.find(r => r.imageNo == '2-5').data); // 11
            this.render3_1(res.find(r => r.imageNo == '3-1').data); // 12
            this.render3_2(res.find(r => r.imageNo == '3-2-1').data, res.find(r => r.imageNo == '3-2-2').data); // 13
            this.render3_3(res.find(r => r.imageNo == '3-3').data); // 14
            this.render3_4(res.find(r => r.imageNo == '3-4').data); // 15
            this.render3_5(res.find(r => r.imageNo == '3-5').data); // 16
            this.$nextTick(() => {
              this.loading = false;
            })
          }
        } catch (e) { console.log(e) }
      }).catch(() => {
        this.loading = false;
      })
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
.center {
  text-align: center;
  margin-top: 0;
}
</style>