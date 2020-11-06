<template>
  <div>
    <el-form class="search" :model="form" size="mini" inline>
      <el-form-item label="主体单位">
        <department :value="form.deptPath" @change="deptChange" style="width:200px" />
      </el-form-item>
      <el-form-item label="月份">
        <el-select v-model="form.month" style="width:90px" clearable>
          <el-option v-for="n in 12" :key="n" :label="n" :value="n"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填报人">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="隐患名称">
        <el-input v-model="form.hiddenName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.hiddenNo" placeholder></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <dictSelect
          type="data_source"
          :value="form.source"
          @change="dictChange($event,'source')"
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
      <el-form-item label="类型">
        <dictSelect
          type="hazard_source"
          :value="form.hiddenType"
          @change="dictChange($event,'hiddenType')"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="涉及业务">
        <dictSelect
          type="product"
          :value="form.involveBusiness"
          @change="dictChange($event,'involveBusiness')"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="涉及流程">
        <dictSelect
          type="system"
          :value="form.involveProcess"
          @change="dictChange($event,'involveProcess')"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="监管单位">
        <el-input v-model="form.supervisoryUnit" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import department from '@/components/Department'
import dictSelect from '@/components/common/dictSelect'
export default {
  components: { department, dictSelect },
  data() {
    return {
      form: {
        deptPath: null,
        month: "",
        user: "",
        hiddenName: "",
        hiddenNo: "",
        source: "",
        levels: "",
        hiddenType: "",
        involveBusiness: "",
        involveProcess: "",
        supervisoryUnit: ""
      }
    }
  },
  methods: {
    deptChange(val) {
      this.form.deptPath = val;
    },
    dictChange(val, key) {
      this.form[key] = val;
    },
    toQuery() {
      let _this = this.$parent.$parent.$parent;
      _this.params = { ...this.form };
      _this.init();
    },
    reset() {
      this.form = {
        deptPath: null,
        month: "",
        user: "",
        hiddenName: "",
        hiddenNo: "",
        source: "",
        levels: "",
        hiddenType: "",
        involveBusiness: "",
        involveProcess: "",
        supervisoryUnit: ""
      };
      this.toQuery();
    }
  },
}
</script>

<style lang="scss" scoped>
.search {
  /deep/ .el-form-item {
    margin-bottom: 8px;
  }
}
</style>