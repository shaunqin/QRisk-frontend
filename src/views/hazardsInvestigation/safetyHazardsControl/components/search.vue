<template>
  <el-form ref="form" :model="form" inline size="mini">
    <el-form-item label="编号">
      <el-input v-model="form.no"></el-input>
    </el-form-item>
    <el-form-item label="隐患名称">
      <el-input v-model="form.hiddenName"></el-input>
    </el-form-item>
    <el-form-item label="部门">
      <department class="mini" :value="form.deptPath" @change="deptChange" style="width: 180px" />
    </el-form-item>
    <el-form-item label="发现时间">
      <el-date-picker
        v-model="date"
        value-format="yyyy-MM-dd"
        type="daterange"
        unlink-panels
        style="width: 220px"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="来源">
      <dictSelect
        type="data_source"
        :value="form.source"
        @change="dictChange($event,'source')"
        style="width: 140px"
      />
    </el-form-item>
    <el-form-item label="类型">
      <dictSelect
        type="hazard_source"
        :value="form.type"
        @change="dictChange($event,'type')"
        style="width: 140px"
      />
    </el-form-item>
    <el-form-item label="等级">
      <dictSelect
        type="hidden_danger_level"
        :value="form.levels"
        @change="dictChange($event,'levels')"
        style="width: 140px"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-button type="success" icon="el-icon-s-data" size="mini" @click="subExport">生成报表</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import department from '@/components/Department'
import dictSelect from '@/components/common/dictSelect'
import { hiddenControlExport } from '@/api/hazards'
export default {
  components: { department, dictSelect },
  data() {
    return {
      form: {
        no: "",
        hiddenName: "",
        deptPath: null,
        startDate: "",
        endDate: "",
        source: "",
        type: "",
        levels: ""
      },
      date: ""
    }
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startDate = val[0];
        this.form.endDate = val[1];
      } else {
        this.form.startDate = "";
        this.form.endDate = "";
      }
    }
  },
  methods: {
    toQuery() {
      this.$parent.init();
    },
    deptChange(val) {
      this.form.deptPath = val;
    },
    dictChange(val, key) {
      this.form[key] = val;
    },
    reset() {
      this.form = {
        no: "",
        hiddenName: "",
        deptPath: null,
        startDate: "",
        endDate: "",
        source: "",
        type: "",
        levels: ""
      };
      this.date = "";
    },
    subExport() {
      hiddenControlExport(this.form).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          location.href = process.env.VUE_APP_BASE_API + res.obj;
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .vue-treeselect--append-to-body {
  z-index: 1 !important;
}
/deep/ .el-form-item{
    margin-bottom: 4px;
}
</style>