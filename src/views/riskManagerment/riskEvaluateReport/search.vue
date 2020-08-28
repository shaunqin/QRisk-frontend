<template>
  <div>
    <el-form
      :model="form"
      :inline="true"
      label-width="80"
      class="query-form"
      size="medium"
      label-position="left"
      ref="form"
    >
      <el-form-item label="责任单位">
        <department
          :value="responsibleUnitList"
          :multiple="true"
          @change="deptChange"
          style="width:500px;line-height: 18px;"
        />
      </el-form-item>
      <el-form-item label="时间:">
        <el-select style="width:120px" v-model="form.dateType" placeholder="请选择时间" clearable>
          <el-option
            v-for="item in dataTypeArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="form.dateType=='1'"
          v-model="date"
          placeholder="请选择周"
          type="week"
          format="yyyy 第 WW 周"
          @change="dateOfWeekChange"
          style="width:160px"
        ></el-date-picker>
        <el-date-picker
          v-if="form.dateType=='2'"
          v-model="date"
          placeholder="请选择月度"
          type="month"
          @change="dateOfMonthChange"
          style="width:140px"
        ></el-date-picker>
        <el-cascader
          v-if="form.dateType=='3'"
          :options="cascaderOption"
          v-model="seasonValue"
          :props="{ expandTrigger: 'hover' }"
          style="width:200px"
          clearable
        ></el-cascader>
        <el-date-picker
          v-if="form.dateType=='4'"
          v-model="date"
          placeholder="请选择年度"
          type="year"
          @change="dateOfYearChange"
          style="width:140px"
        ></el-date-picker>
        <el-date-picker
          v-if="form.dateType=='5'"
          :key="createUniqueString()"
          v-model="date"
          type="daterange"
          style="width:230px"
          unlink-panels
          :picker-options="{onPick:dateOfRangeChange}"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-date-picker
          v-if="form.dateType=='5'"
          :key="createUniqueString()"
          v-model="date2"
          type="daterange"
          style="width:230px"
          unlink-panels
          :picker-options="{onPick:dateOfRangeChange2}"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-date-picker
          v-if="form.dateType=='6'"
          v-model="date"
          placeholder="请选择两个时间"
          type="dates"
          style="width:230px"
          @change="dateOfCompareChange"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="数据来源:">
        <dict-select
          :value="form.infoSource"
          type="data_source"
          @change="dictChange($event,'infoSource')"
          style="width:150px"
          placeholder="请选择数据来源"
        ></dict-select>
      </el-form-item>
      <el-form-item label="产品:">
        <dict-select
          :value="form.productValue"
          type="product"
          @change="dictChange($event,'productValue')"
          style="width:140px"
          placeholder="请选择产品"
        ></dict-select>
      </el-form-item>
      <el-form-item label="系统:">
        <dict-select
          :value="form.systemValue"
          type="system"
          @change="dictChange($event,'systemValue')"
          style="width:140px"
          placeholder="请选择系统"
        ></dict-select>
      </el-form-item>
      <el-form-item label="危险源层级一">
        <el-select
          clearable
          v-model="form.riskLevel1"
          placeholder="请选择层级一"
          style="width: 130px"
          @change="form.riskLevel2 = form.sourceOfRisk =''"
        >
          <el-option
            v-for="item in riskLevel1List"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险源层级二">
        <el-select
          clearable
          v-model="form.riskLevel2"
          placeholder="请选择层级二"
          style="width: 130px;"
          @change="form.sourceOfRisk = ''"
        >
          <el-option
            v-for="item in riskLevel2List"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险源:">
        <el-select clearable v-model="form.sourceOfRisk" placeholder="请选择危险源" style="width: 130px;">
          <el-option
            v-for="item in hazardList"
            :key="item.diskId"
            :label="item.diskName"
            :value="item.diskNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险:">
        <el-select
          :disabled="riskDisabled"
          filterable
          style="width:160px"
          v-model="form.risk"
          placeholder="请选择风险"
        >
          <el-option
            v-for="item in riskList"
            :key="item.riskNo"
            :label="item.riskName"
            :value="item.riskNo"
          ></el-option>
        </el-select>
        <el-checkbox v-model="form.isKeyRisk" border true-label="1" false-label="0">是否关键风险</el-checkbox>
      </el-form-item>
      <el-form-item label="风险计算:">
        <el-select style="width:120px" v-model="form.js1" placeholder="风险等级" clearable>
          <el-option
            v-for="item in ['#fff','#ffba00','#74bcff','#13ce66','#e64242']"
            :key="item"
            :value="item"
          >
            <span
              :style="'background-color:'+item"
              style="display: block;width: 80px;height: 25px;border: 1px solid #ccc;"
            ></span>
          </el-option>
        </el-select>
        <el-input v-model="form.js2" placeholder="风险值左区间" style="width:80px"></el-input>
        <el-input v-model="form.js2_2" placeholder="风险值右区间" style="width:80px"></el-input>
        <el-radio-group v-model="form.js3">
          <el-radio-button label="asc">asc</el-radio-button>
          <el-radio-button label="desc">desc</el-radio-button>
        </el-radio-group>
        <el-input v-model="form.js4" placeholder="危险源风险值左区间" style="width:80px"></el-input>
        <el-input v-model="form.js4_2" placeholder="危险源风险值右区间" style="width:80px"></el-input>
        <el-radio-group v-model="form.js5">
          <el-radio-button label="asc">asc</el-radio-button>
          <el-radio-button label="desc">desc</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="诱因:">
        <dict-select
          :value="form.incentive"
          type="incentive_category"
          @change="dictChange($event,'incentive')"
          style="width:120px"
          placeholder="请选择诱因"
        ></dict-select>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button type="success" icon="el-icon-menu">生成报表</el-button>
        <el-button type="success" icon="el-icon-s-data" @click="handlerChart">生成图表</el-button>
        <el-button type="success" icon="el-icon-tickets">月度风险评价报告</el-button>
      </el-form-item>
    </el-form>
    <!-- 生成图表 -->
    <chartpup ref="chartpup" @change="createCharts"></chartpup>
  </div>
</template>

<script>
import { formatDateToWeek, formatShortDate } from "@/utils/datetime";
import { createUniqueString } from "@/utils/index";
import dictSelect from "@/components/common/dictSelect";
import { queryRiskList, queryHazardList } from "@/api/standard";
import { queryDictByName } from "@/api/dict";
import department from "@/components/Department";
import chartpup from "./components/chartpup";
import { eventBus } from "@/utils/eventBus";
export default {
  components: { dictSelect, department, chartpup },
  data() {
    let _data = [];
    let year = new Date().getFullYear();
    for (let i = 0; i < 20; i++) {
      _data.push({
        value: year - i,
        label: year - i,
        children: [
          {
            label: year - i + " 第一季度",
            value: 1,
          },
          {
            label: year - i + " 第二季度",
            value: 2,
          },
          {
            label: year - i + " 第三季度",
            value: 3,
          },
          {
            label: year - i + " 第四季度",
            value: 4,
          },
        ],
      });
    }
    return {
      form: {
        responsibleUnitList: "", //责任单位
        dateType: "", //日期类型
        dateValue1: "", //日期值1
        dateValue2: "", //日期值2
        infoSource: "", //数据来源
        productValue: "", //产品
        systemValue: "", //系统
        sourceOfRisk: "", //危险源
        riskLevel1: "", //危险源层级1
        riskLevel2: "", //危险源层级2
        risk: "", //风险
        isKeyRisk: "", //关键风险
        incentive: "", //诱因
        riskCalculate: "", //风险计算
      },
      date: "",
      date2: "",
      cascaderOption: _data,
      seasonValue: "",
      riskOption: [],
      riskLevel1List: [],
      riskLevel2List: [],
      riskList: [], // 风险列表
      riskDisabled: false,
      hazardList: [], // 危险源
      totalhazardList: [], // 全部危险源
      responsibleUnitList: [],
      dataTypeArray: [
        { label: "周", value: "1" },
        { label: "月度", value: "2" },
        { label: "季度", value: "3" },
        { label: "年度", value: "4" },
        { label: "时间段", value: "5" },
        { label: "时间对比", value: "6" },
      ],
    };
  },
  created() {
    // 危险源层级
    queryDictByName("hazard_source").then((res) => {
      this.riskLevel1List = res.obj[0].children;
    });
    // 危险源
    queryHazardList().then((res) => {
      this.totalhazardList = res.obj;
    });
    // 风险列表
    queryRiskList().then((res) => {
      if (res.code == "200") {
        this.riskList = res.obj.map((r) => {
          return { riskName: r.riskName, riskNo: r.riskNo };
        });
      }
    });
  },
  watch: {
    "form.dateType"(val) {
      this.form.dateValue1 = "";
      this.form.dateValue2 = "";
      this.date = "";
      this.seasonValue = "";
    },
    seasonValue(val) {
      if (val.length > 0) {
        this.form.dateValue1 = val[0];
        this.form.dateValue2 = val[1];
      } else {
        this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    date(val) {
      if (this.form.dateType == "6") {
        if (val && val.length > 2) {
          this.$message.error("最多选择两个日期");
          this.date = [val[0], val[1]];
        }
      }
    },
    "form.isKeyRisk"(val) {
      // 关键风险
      if (val == "1") {
        this.form.risk = "";
      }
      this.riskDisabled = val == "1";
    },
    "form.riskLevel1": {
      handler(val) {
        if (this.riskLevel1List.length > 0) {
          let list = this.riskLevel1List.filter((r) => r.value == val);
          if (list && list.length > 0) {
            this.riskLevel2List = list[0].children;
          }
        }
      },
    },
    "form.riskLevel2": {
      handler(val) {
        let list = this.totalhazardList.filter((r) => r.cateValue == val);
        if (list && list.length > 0) {
          this.hazardList = list;
        }
      },
    },
    responsibleUnitList(val) {
      this.form.responsibleUnitList = val.join(",");
    },
  },
  methods: {
    formatDateToWeek,
    formatShortDate,
    createUniqueString,
    dateOfWeekChange(date) {
      let str = formatDateToWeek(date);
      if (str) {
        this.form.dateValue1 = str.split("-")[0];
        this.form.dateValue2 = str.split("-")[1];
      } else {
        this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    dateOfMonthChange(date) {
      if (date != null) {
        this.form.dateValue1 = date.getFullYear();
        this.form.dateValue2 = date.getMonth() + 1;
      } else {
        this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    dateOfYearChange(date) {
      if (date != null) {
        this.form.dateValue1 = date.getFullYear();
        this.form.dateValue2 = "";
      } else {
        this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    dateOfRangeChange({ maxDate, minDate }) {
      if (maxDate && minDate) {
        this.form.dateValue1 =
          formatShortDate(minDate) + "," + formatShortDate(maxDate);
        // this.form.dateValue2 = formatShortDate(maxDate);
      } else {
        this.form.dateValue1 = "";
        // this.form.dateValue2 = "";
      }
    },
    dateOfRangeChange2({ maxDate, minDate }) {
      if (maxDate && minDate) {
        // this.form.dateValue1 = formatShortDate(minDate);
        this.form.dateValue2 =
          formatShortDate(minDate) + "," + formatShortDate(maxDate);
      } else {
        // this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    dateOfCompareChange(date) {
      if (date != null) {
        this.form.dateValue1 = date[0];
        this.form.dateValue2 = date[1];
      } else {
        this.form.dateValue1 = "";
        this.form.dateValue2 = "";
      }
    },
    dictChange(val, key) {
      this.form[key] = val;
    },
    getHazardList(data) {
      let obj = { label: data.name, value: data.externMap.dicCode };
      if (data.children && data.children.length > 0) {
        obj.children = data.children.map((item) => {
          return this.getHazardList(item);
        });
      }
      return obj;
    },
    deptChange(val) {
      this.responsibleUnitList = val;
    },
    toQuery() {
      this.$emit("toQuery", this.form);
    },
    reset() {
      this.$refs["form"].resetFields();
      this.form = {
        responsibleUnitList: [], //责任单位
        dateType: "", //日期类型
        dateValue1: "", //日期值1
        dateValue2: "", //日期值2
        infoSource: "", //数据来源
        productValue: "", //产品
        systemValue: "", //系统
        sourceOfRisk: "", //危险源
        riskLevel1: "", //危险源层级1
        riskLevel2: "", //危险源层级2
        risk: "", //风险
        isKeyRisk: "", //关键风险
        incentive: "", //诱因
        riskCalculate: "", //风险计算
      };
    },
    handlerChart() {
      let _this = this.$refs.chartpup;
      _this.dialog = true;
      // eventBus.$emit("tab-change", "2");
    },
    createCharts(form) {
      let _form = { ...this.form, ...form };
      this.$emit("create-charts", _form);
    },
  },
};
</script>

<style lang="scss" scoped>
.query-form {
  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>