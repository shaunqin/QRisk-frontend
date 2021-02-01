<template>
  <div class="app-container">
    <div class="head-container">
      <el-form :model="form" size="mini" inline>
        <el-form-item label="月份">
          <el-date-picker
            v-model="date"
            type="month"
            placeholder="请选择月份"
            @change="dateOfMonthChange"
            style="width:140px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="toQuery" :loading="loading">搜索</el-button>
          <el-button
            type="success"
            icon="el-icon-download"
            @click="doExport"
            :loading="exportLoading"
          >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h4 class="title">一、航线产品</h4>
    <h5 class="title">(一)航线产品质量总体情况</h5>
    <echarts ref="image1" :chartData="data1_1" v-loading="loading" />
    <echarts ref="image2" :chartData="data1_2" v-loading="loading" />
    <echarts ref="image3" :chartData="data1_3" v-loading="loading" />
    <echarts ref="image4" :chartData="data1_4" v-loading="loading" />
    <div v-for="(item,index) in remark1_3" :key="'a'+index">
      <h6 class="title-t">{{index+1}})、{{item.title}}</h6>
      <el-input v-model="item.remark" type="textarea" rows="4"></el-input>
    </div>
    <h5 class="title-t">(二)航线产品质量评价分项指标</h5>
    <h6 class="title">1、国航机队</h6>
    <echarts ref="image5" :chartData="data1_5" v-loading="loading" />
    <h6 class="title">2、客户机队</h6>
    <echarts ref="image6" :chartData="data1_6" v-loading="loading" />
    <h5 class="title-t">(三)关键指标考核</h5>
    <h6 class="title">1、国航机队</h6>
    <el-table
      v-loading="loading"
      :data="data1_7"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns1_7" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>
    <h6 class="title">2、客户机队</h6>
    <el-table
      v-loading="loading"
      :data="data1_8"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns1_8" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>

    <h4 class="title">二、定检产品</h4>
    <h5 class="title">(一)定检产品质量总体情况</h5>
    <echarts ref="image7" :chartData="data2_1" v-loading="loading" />
    <echarts ref="image8" :chartData="data2_2" v-loading="loading" />
    <echarts ref="image9" :chartData="data2_3" v-loading="loading" />
    <echarts ref="image10" :chartData="data2_4" v-loading="loading" />
    <div v-for="(item,index) in remark2_3" :key="'b'+index">
      <h6 class="title-t">{{index+1}})、{{item.title}}</h6>
      <el-input v-model="item.remark" type="textarea" rows="4"></el-input>
    </div>
    <h5 class="title-t">(二)定检产品质量分项指标</h5>
    <h6 class="title">1、国航机队</h6>
    <echarts ref="image11" :chartData="data2_5" v-loading="loading" />
    <h6 class="title">2、客户机队</h6>
    <echarts ref="image12" :chartData="data2_6" v-loading="loading" />
    <h5 class="title-t">(三)关键指标考核</h5>
    <h6 class="title">1、国航机队</h6>
    <el-table
      v-loading="loading"
      :data="data2_7"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns2_7" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>
    <h6 class="title">2、客户机队</h6>
    <el-table
      v-loading="loading"
      :data="data2_8"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns2_8" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>

    <h4 class="title">三、发动机/APU产品</h4>
    <h5 class="title">(一)发动机/APU产品质量总体情况</h5>
    <echarts ref="image13" :chartData="data3_1" v-loading="loading" />
    <el-input v-model="remark3_1" type="textarea" rows="4"></el-input>
    <h5 class="title-t">(二)发动机/APU产品质量分项指标</h5>
    <h6 class="title">1、发动机产品质量分项指标</h6>
    <echarts ref="image14" :chartData="data3_2" v-loading="loading" />
    <h6 class="title">2、APU产品质量分项指标</h6>
    <echarts ref="image15" :chartData="data3_3" v-loading="loading" />
    <h5 class="title-t">(三)关键指标考核</h5>
    <el-table
      v-loading="loading"
      :data="data3_4"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns3_4" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>

    <h4 class="title">四、附件产品</h4>
    <h5 class="title">(一)附件产品质量总体情况</h5>
    <echarts ref="image16" :chartData="data4_1" v-loading="loading" />
    <echarts :chartData="data4_2" v-loading="loading" />
    <el-input v-model="remark4_1" type="textarea" rows="4"></el-input>
    <h5 class="title-t">(二)附件产品质量分项指标</h5>
    <echarts ref="image17" :chartData="data4_3" v-loading="loading" />
    <h5 class="title-t">(三)关键指标考核</h5>
    <el-table
      v-loading="loading"
      :data="data4_4"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <template slot="empty">
        <span></span>
      </template>
      <el-table-column v-for="(column,index) in columns4_4" :key="index" :label="column.name">
        <el-table-column
          v-for="(item,iindex) in column.children"
          :key="iindex"
          :label="item.name"
          :prop="item.prop"
        />
      </el-table-column>
    </el-table>

    <h4 class="title">五、附件质量调查</h4>
    <el-input v-model="remark5" type="textarea" rows="4"></el-input>
  </div>
</template>

<script>
import { queryReportData, queryDefaultValue, downloadReport } from '@/api/quality';
import echarts from '@/components/Charts'
export default {
  name: 'QualityMonthlyReport',
  components: { echarts },
  data() {
    return {
      loading: false,
      exportLoading: false,
      form: {
        year: "",
        month: ""
      },
      date: "",
      data1_1: {},
      data1_2: {},
      data1_3: {},
      remark1_3: [],
      data1_4: {},
      data1_5: {},
      data1_6: {},
      data1_7: [],
      columns1_7: [],
      data1_8: [],
      columns1_8: [],
      data2_1: {},
      data2_2: {},
      data2_3: {},
      data2_4: {},
      remark2_3: [],
      data2_5: {},
      data2_6: {},
      data2_7: [],
      columns2_7: [],
      data2_8: [],
      columns2_8: [],
      data3_1: {},
      remark3_1: "",
      data3_2: {},
      data3_3: {},
      data3_4: [],
      columns3_4: [],
      data4_1: {},
      data4_2: {},
      remark4_1: "",
      data4_3: {},
      data4_4: [],
      columns4_4: [],
      remark5: "",
      doctext: {},
    };
  },
  methods: {
    toQuery() {
      this.loading = true;
      queryReportData(this.form).then(async res => {
        this.loading = false;
        if (res) {
          let res1_1 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 1);
          this.series2render(res1_1, "data1_1", "line", { title: '公司总体航线产品' });
          let res1_2 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 2);
          this.seriesMore2render(res1_2, "data1_2", "bar");
          let res1_3 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 3);
          this.seriesMore2render(res1_3, "data1_3", "line", { showLabel: true, showRemark: true, remarkKey: "remark1_3" });
          let res1_4 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 4);
          this.seriesMore2render(res1_4, "data1_4", "bar", { rotate: 'no' });
          let res1_5 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 5);
          this.seriesMore2render(res1_5, "data1_5", "bar", { showLabel: true });
          let res1_6 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 6);
          this.seriesMore2render(res1_6, "data1_6", "bar", { showLabel: true });
          /* let res1_7 = res.find(r => r.sortNum == 1).list.find(r => r.sortNum == 7);
          this.data1_7 = [...res1_7.data] */

          let res2_1 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 9);
          this.series2render(res2_1, "data2_1", "line", { title: '公司近十二个月产品质量趋势' });
          let res2_2 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 10);
          this.seriesMore2render(res2_2, "data2_2", "bar");
          let res2_3 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 11);
          this.seriesMore2render(res2_3, "data2_3", "line", { showLabel: true, showRemark: true, remarkKey: "remark2_3" });
          let res2_4 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 12);
          this.seriesMore2render(res2_4, "data2_4", "bar", { rotate: 'no' });
          let res2_5 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 13);
          this.seriesMore2render(res2_5, "data2_5", "bar", { showLabel: true });
          let res2_6 = res.find(r => r.sortNum == 2).list.find(r => r.sortNum == 14);
          this.seriesMore2render(res2_6, "data2_6", "bar", { showLabel: true });

          let res3_1 = res.find(r => r.sortNum == 3).list.find(r => r.sortNum == 17);
          this.seriesMore2render(res3_1, "data3_1", "line", { showLabel: true });
          let res3_2 = res.find(r => r.sortNum == 3).list.find(r => r.sortNum == 18);
          this.seriesMore2render(res3_2, "data3_2", "bar", { showLabel: true });
          let res3_3 = res.find(r => r.sortNum == 3).list.find(r => r.sortNum == 19);
          this.seriesMore2render(res3_3, "data3_3", "bar", { showLabel: true });

          let res4_1 = res.find(r => r.sortNum == 4).list.find(r => r.sortNum == 21);
          this.series2render(res4_1, "data4_1", "line", { title: '近十二个月公司平均趋势' });
          let res4_2 = res.find(r => r.sortNum == 4).list.find(r => r.sortNum == 22);
          this.seriesMore2render(res4_2, "data4_2", "line", { showLabel: true });
          let res4_3 = res.find(r => r.sortNum == 4).list.find(r => r.sortNum == 23);
          this.seriesMore2render(res4_3, "data4_3", "bar", { showLabel: true, rotate: 'no' });

          await this.getTableHead('4_41_0', 'columns1_7')
          await this.getTableHead('4_41_1', 'columns1_8')
          await this.getTableHead('1_13_0', 'columns2_7')
          await this.getTableHead('1_13_1', 'columns2_8')
          await this.getTableHead('2_22', 'columns3_4')
          await this.getTableHead('3_32', 'columns4_4')
        }
      })
    },
    dateOfMonthChange(date) {
      if (date != null) {
        this.form.year = date.getFullYear();
        this.form.month = date.getMonth() + 1;
      } else {
        this.form.year = "";
        this.form.month = "";
      }
    },
    // 单系列渲染
    series2render(res, dataSource, chartType, params = {}) {
      const { data } = res;
      let _xAxis = [];
      let _data = [];
      data.map(item => {
        _xAxis.push(item.name);
        _data.push(item.num);
      })
      this[dataSource] = {
        color: [res.color],
        legend: { data: [params.title], bottom: 0, left: 'center' },
        tooltip: {},
        title: { text: res.name, left: 'center' },
        xAxis: { type: 'category', data: _xAxis },
        yAxis: { type: 'value' },
        series: [{
          name: params.title,
          type: 'line',
          data: _data,
          label: { show: true }
        }]
      }
    },
    // 多系列渲染
    seriesMore2render(res, dataSource, chartType, params = {}) {
      const { list } = res;
      let seriesArr = [];
      let legendArr = [];
      let _xAxis = list[0].data.map(r => r.name);
      let remark = [];
      list.map(item => {
        let _data = item.data.map(r => r.num);
        legendArr.push(item.name);
        seriesArr.push({
          type: chartType,
          data: _data,
          name: item.name,
          itemStyle: { color: item.color },
          label: { show: !!params.showLabel }
        })
        if (params.showRemark) {
          // 备注信息
          remark.push({
            title: item.remark,
            remark: ""
          })
        }
      });
      if (params.showRemark) {
        this[params.remarkKey] = remark;
      }
      this[dataSource] = {
        legend: { data: legendArr, bottom: 0, left: 'center' },
        tooltip: {},
        grid: { bottom: 80 },
        title: { text: res.name, left: 'center' },
        xAxis: { type: 'category', data: _xAxis, axisLabel: { rotate: params.rotate == 'no' ? 0 : 30 } },
        yAxis: { type: 'value' },
        series: seriesArr
      }
    },
    async getTableHead(productValue, dataSource) {
      let obj = {
        setObjectName: `quality_product_index_${productValue}_monthreport_title_cn`,
        type: 2
      };
      await queryDefaultValue(obj).then(res => {
        if (res.code != '200') {
          this.$message.error("关键指标未配置参数");
        } else {
          this[dataSource] = res.obj;
        }
      })

    },
    getTable(res, dataSource) {
      this[dataSource] = res.obj.map(item => {
        const obj = { ...item, ...item.resultValues }
        return obj
      });
    },
    doExport() {
      this.exportLoading = true;
      let doctext = {};
      // 图
      for (let i = 1; i < 18; i++) {
        const charts = this.$refs["image" + i];
        doctext["image" + i] = charts.chart.getDataURL({
          type: 'png',
          pixelRatio: 2,
        })
      }
      // 标题文字
      if (this.remark1_3.length == 2) {
        doctext[`title1`] = this.remark1_3[0].title;
        doctext[`paragraph1`] = this.remark1_3[0].remark;
        doctext[`title2`] = this.remark1_3[1].title;
        doctext[`paragraph2`] = this.remark1_3[1].remark;
      }
      if (this.remark2_3.length == 2) {
        doctext[`title3`] = this.remark2_3[0].title;
        doctext[`paragraph3`] = this.remark2_3[0].remark;
        doctext[`title4`] = this.remark2_3[1].title;
        doctext[`paragraph4`] = this.remark2_3[1].remark;
      }
      doctext['paragraph5'] = this.remark3_1;
      doctext['paragraph6'] = this.remark4_1;
      doctext['paragraph7'] = this.remark5;
      // console.log(doctext);
      downloadReport(doctext).then(res => {
        this.exportLoading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let url = process.env.VUE_APP_BASE_API + res.obj;
          location.href = url;
        }
      })
    }

  },
};
</script>

<style lang="scss" scoped>
// .head-container {
//   margin-bottom: 20px;
// }
.title {
  margin-top: 0;
  margin-bottom: 10px;
}
.title-t {
  margin: 10px 0;
}
/deep/ .el-table {
  margin-bottom: 10px;
}
</style>