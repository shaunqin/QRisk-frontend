<template>
  <div class="app-container">
    <div class="head-container">
      <el-select size="mini" v-model="prod" placeholder="请选择产品">
        <el-option v-for="item in menu1" :key="item" :label="item" :value="item"></el-option>
      </el-select>

      <el-button class="filter-item" size="mini" type="success" icon="el-icon-upload">上报</el-button>
    </div>
    <el-card :header="prod+'上报'">
      <el-form :model="form" label-width="auto" inline>
        <el-form-item label="上报部门">
          <el-input v-model="form.aa" placeholder style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="上报人">
          <el-input v-model="form.bb" placeholder style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.cc" placeholder style="width:100%"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form :model="form2" label-width="auto">
        <el-form-item v-for="(val,key) in reportFiled" :key="key" :label="val">
          <el-input v-model="form2[key]" placeholder></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prod: "定检产品",
      menu1: ["定检产品", "发动机APU产品", "附件产品", "航线产品"],
      form: {
        aa: "",
        bb: "",
        cc: ""
      },
      form2: {}
    };
  },

  computed: {
    reportFiled() {
      let reportFiled = {};
      switch (this.prod) {
        case "定检产品":
          reportFiled = {
            aa: "国航机队/客户机队:出港基地机械原因航班不正常数量全月之和",
            bb: "客户机队:出厂首班机械原因不正常航班数量",
            cc: "国航机队/客户机队:维修差错及质量调查数量",
            dd: "客户机队:客户质量投诉数量",
            ee: "客户机队:客户满意度调查全月份数",
            ff: "客户机队:客户满意度调查全月份数总分数之和"
          };
          break;
        case "发动机APU产品":
          reportFiled = {
            aa: "全月出厂发动机/APU车台重复试车次数",
            bb: "全月出厂发动机/APU总台数",
            cc: "发动机/APU在保修期全月返厂台数",
            dd: "维修差错及质量调查数量",
            ee: "客户质量投诉数量"
          };
          break;
        case "附件产品":
          reportFiled = {
            aa: "装机时间50小时以下非计划拆换的附件数量",
            bb: "全月出厂附件总数量",
            cc: "全月装机时间低于1000小时返厂修理/索赔的附件数量",
            dd: "维修差错及质量调查数量",
            ee: "出厂检发现问题数量",
            ff: "客户质量投诉数量"
          };
          break;
        case "航线产品":
          reportFiled = {
            aa: "客户机队:出港基地机械原因航班不正常数量全月之和",
            bb: "客户机队:出港基地航班数量全月之和",
            cc: "客户机队:维修差错及质量调查数量",
            dd: "客户机队:客户质量投诉数量"
          };
          break;
      }
      return reportFiled;
    }
  }
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 20px;
}
</style>