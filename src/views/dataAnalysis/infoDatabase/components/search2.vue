<template>
  <el-form
    class="search"
    size="mini"
    :model="queryForm"
    label-position="left"
    inline
  >
    <el-form-item :label="$t('analysis.infoSource')">
      <dict-select
        :value="queryForm.infoSource"
        :type="sourceType"
        @change="dictChange($event,'infoSource',queryForm)"
        style="width:120px"
      />
    </el-form-item>
    <el-form-item :label="$t('analysis.happenDate')">
      <el-date-picker
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        :start-placeholder="$t('analysis.startDate')"
        :end-placeholder="$t('analysis.endDate')"
        style="width:215px"
        unlink-panels
      ></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('analysis.place')" v-if="type==1">
      <el-input v-model="queryForm.place" placeholder style="width:130px"></el-input>
    </el-form-item>
    <el-form-item :label="$t('analysis.aircraftType')" label-width="50" v-if="type!=8">
      <dict-select
        :value="queryForm.aircraftType"
        type="aircraft"
        @change="dictChange($event,'aircraftType',queryForm)"
        style="width:100px"
      />
    </el-form-item>
    <el-form-item :label="$t('analysis.title')">
      <el-input v-model="queryForm.title" placeholder style="width:130px"></el-input>
    </el-form-item>
    <el-form-item :label="$t('analysis.sourceOfRisk')">
      <el-select
        clearable
        filterable
        v-model="queryForm.sourceOfRisk"
        placeholder
        style="width: 130px;"
      >
        <el-option
          v-for="item in riskList"
          :key="item.diskNo"
          :label="item.diskName"
          :value="item.diskNo"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('analysis.department')">
      <department
        :value="queryForm.responsibleUnit"
        @change="deptChange"
        style="width:200px;line-height:20px"
      ></department>
    </el-form-item>
    <el-form-item :label="$t('analysis.product')" >
      <dict-select
        :value="queryForm.product"
        type="product"
        @change="dictChange($event,'product',queryForm)"
        style="width:130px"
      />
    </el-form-item>
    <el-form-item :label="$t('analysis.system')" >
      <dict-select
        :value="queryForm.systemCode"
        type="system"
        @change="dictChange($event,'systemCode',queryForm)"
        style="width:100px"
      />
    </el-form-item>
    <el-form-item :label="$t('analysis.risk')" >
      <risk-select :value="queryForm.risk" @change="riskChange" style="width: 150px"></risk-select>
    </el-form-item>
    <el-form-item>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(queryForm)"
      >{{$t('global.search')}}</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-refresh"
        @click="refresh"
      >{{$t('global.reset')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import dictSelect from "@/components/common/dictSelect";
import department from "@/components/Department";
import riskSelect from "./riskSelect";
import { queryHazardList } from "@/api/standard";
export default {
  components: { dictSelect, department, riskSelect },
  data() {
    return {
      queryForm: {
        infoSource: "",
        startHappenDate: "",
        endHappenDate: "",
        place: "",
        aircraftType: "",
        title: "",
        sourceOfRisk: "",
        responsibleUnit: null,
        product: "",
        systemCode: "",
        risk: "",
      },
      date: "",
      riskList: [],
    };
  },
  props: {
    sourceType: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  watch: {
    date(val) {
      if (val) {
        this.queryForm.startHappenDate = val[0];
        this.queryForm.endHappenDate = val[1];
      } else {
        this.queryForm.startHappenDate = "";
        this.queryForm.endHappenDate = "";
      }
    },
  },
  created() {
    //危险源
    queryHazardList().then((res) => {
      if (res.code != "200") {
        this.$message.error(res.msg);
      } else {
        this.riskList = res.obj;
      }
    });
  },
  methods: {
    toQuery(params) {
      let _this = this.$parent;
      _this.page = 1;
      _this.params = { ...params };
      _this.init();
    },
    refresh() {
      this.queryForm = {
        infoSource: "",
        startHappenDate: "",
        endHappenDate: "",
        place: "",
        aircraftType: "",
        title: "",
        sourceOfRisk: "",
        responsibleUnit: null,
        product: "",
        systemCode: "",
        risk: "",
      };
      this.date = "";
      this.toQuery(this.queryForm);
    },
    dictChange(val, key, row) {
      row[key] = val;
    },
    deptChange(val) {
      this.queryForm.responsibleUnit = val;
    },
    riskChange(val) {
      this.queryForm.risk = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  display: inline;
  .el-form-item {
    margin-bottom: 8px;
  }
}
/deep/ .vue-treeselect__control {
  height: 30px;
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 30px;
  }
}
/deep/ .vue-treeselect--append-to-body {
  z-index: 2000 !important;
}
</style>