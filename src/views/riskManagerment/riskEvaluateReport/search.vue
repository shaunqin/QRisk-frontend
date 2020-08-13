<template>
  <el-form :model="form" :inline="true" label-width="80" class="query-form" size="mini" label-position="left">
    <el-form-item label="时间:">
      <el-select
        size="mini"
        style="width:120px"
        v-model="form.dateType"
        placeholder="请选择时间"
        clearable
      >
        <el-option
          v-for="item in ['周','月度','季度','年度','时间段','时间对比']"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-date-picker
        v-if="form.dateType=='周'"
        v-model="date"
        placeholder="请选择周"
        type="week"
        format="yyyy 第 WW 周"
        @change="dateOfWeekChange"
        style="width:140px"
      ></el-date-picker>
      <el-date-picker
        v-if="form.dateType=='月度'"
        v-model="date"
        placeholder="请选择月度"
        type="month"
        @change="dateOfMonthChange"
        style="width:140px"
      ></el-date-picker>
      <el-cascader
        v-if="form.dateType=='季度'"
        :options="cascaderOption"
        v-model="seasonValue"
        :props="{ expandTrigger: 'hover' }"
        style="width:200px"
        clearable
      ></el-cascader>
      <el-date-picker
        v-if="form.dateType=='年度'"
        v-model="date"
        placeholder="请选择年度"
        type="year"
        @change="dateOfYearChange"
        style="width:140px"
      ></el-date-picker>
      <el-date-picker
        v-if="form.dateType=='时间段'"
        :key="new Date().getTime()"
        v-model="date"
        type="daterange"
        style="width:210px"
        unlink-panels
        :picker-options="{onPick:dateOfRangeChange}"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-date-picker
        v-if="form.dateType=='时间对比'"
        v-model="date"
        placeholder="请选择两个时间"
        type="dates"
        style="width:210px"
        @change="dateOfCompareChange"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="数据来源:">
      <dict-select
        :value="form.dataSource"
        type="data_source"
        @change="dictChange($event,'dataSource')"
        style="width:120px"
      ></dict-select>
    </el-form-item>
    <el-form-item label="产品:">
      <dict-select
        :value="form.product"
        type="product"
        @change="dictChange($event,'product')"
        style="width:140px"
      ></dict-select>
    </el-form-item>
    <el-form-item label="系统:">
      <dict-select
        :value="form.system"
        type="system"
        @change="dictChange($event,'system')"
        style="width:120px"
      ></dict-select>
    </el-form-item>
    <el-form-item label="危险源层级一">
      <el-select
        clearable
        v-model="form.riskLevel1"
        placeholder
        style="width: 120px"
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
        placeholder
        style="width: 120px;"
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
      <el-select clearable v-model="form.sourceOfRisk" placeholder style="width: 120px;">
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
        size="mini"
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
      <el-select size="mini" style="width:120px" v-model="form.js1" placeholder="请选择风险等级">
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
      <el-input v-model="form.js2" placeholder="风险值" style="width:120px"></el-input>
      <el-radio-group v-model="form.js3">
        <el-radio-button label="asc">asc</el-radio-button>
        <el-radio-button label="desc">desc</el-radio-button>
      </el-radio-group>
      <el-input v-model="form.js4" placeholder="危险源风险值" style="width:120px"></el-input>
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
      ></dict-select>
    </el-form-item>
    <el-form-item label>
      <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh">重置</el-button>
    </el-form-item>
    <el-form-item label>
      <el-button type="success" icon="el-icon-menu">生成报表</el-button>
      <el-dropdown @command="handlerCommand">
        <el-button type="success">生成图表</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="line" icon="el-icon-s-marketing">折线图</el-dropdown-item>
          <el-dropdown-item command="bar" icon="el-icon-s-data">柱状图</el-dropdown-item>
          <el-dropdown-item command="pie" icon="el-icon-s-help">扇图</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="success" icon="el-icon-tickets">月度风险评价报告</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatDateToWeek, formatShortDate } from "@/utils/datetime";
import dictSelect from "@/components/common/dictSelect";
import { queryRiskList, queryHazardList } from "@/api/standard";
import { queryDictByName } from "@/api/dict";
export default {
  components: { dictSelect },
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
        dateType: "",
        dateValue: "",
        dataSource: "",
        product: "",
        system: "",
        sourceOfRisk: "",
        riskLevel1: "",
        riskLevel2: "",
        risk: "",
        isKeyRisk: "",
        incentive: "",
      },
      date: "",
      cascaderOption: _data,
      seasonValue: "",
      riskOption: [],
      riskLevel1List: [],
      riskLevel2List: [],
      riskList: [], // 风险列表
      riskDisabled: false,
      hazardList: [], // 危险源
      totalhazardList: [], // 全部危险源
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
    form: {
      deep: true, //  对象深度验证
      handler(val) {
        console.log(val);
      },
    },
    "form.dateType"(val) {
      this.form.dateValue = "";
      this.date = "";
      this.seasonValue = "";
    },
    seasonValue(val) {
      this.form.dateValue = val.join("-");
    },
    date(val) {
      if (this.form.dateType == "时间对比") {
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
  },
  methods: {
    formatDateToWeek,
    formatShortDate,
    dateOfWeekChange(date) {
      let str = formatDateToWeek(date);
      this.form.dateValue = str || "";
    },
    dateOfMonthChange(date) {
      if (date != null) {
        this.form.dateValue = date.getFullYear() + "-" + (date.getMonth() + 1);
      } else {
        this.form.dateValue = "";
      }
    },
    dateOfYearChange(date) {
      if (date != null) {
        this.form.dateValue = date.getFullYear();
      } else {
        this.form.dateValue = "";
      }
    },
    dateOfRangeChange({ maxDate, minDate }) {
      if (maxDate && minDate) {
        this.form.dateValue = [
          formatShortDate(minDate),
          formatShortDate(maxDate),
        ].join(",");
      } else {
        this.form.dateValue = "";
      }
    },
    dateOfCompareChange(date) {
      if (date != null) {
        this.form.dateValue = date.join(",");
      } else {
        this.form.dateValue = "";
      }
    },
    dictChange(val, key) {
      this.form[key] = val;
    },
    handlerCommand(command) {
      this.$emit("createCharts", command);
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