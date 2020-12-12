<template>
  <!-- <treeselect
    v-model="selectValue"
    :options="options"
    :normalizer="normalizer"
    :default-expand-level="1"
    :disabled="disabled"
    :multiple="multiple"
    :limit="limit"
    :flat="flat"
    placeholder="请选择..."
  />-->
  <el-select
    v-model="selectValue"
    placeholder="请选择..."
    :multiple="multiple"
    filterable
    style="width:100%"
    clearable
    v-loading="loading"
    @change="chooseValue"
  >
    <el-checkbox v-model="checkAll" @change="ckChange" v-if="multiple">全选</el-checkbox>
    <el-divider v-if="multiple"></el-divider>
    <el-option
      v-for="item in options"
      :key="item.deptId"
      :label="item.deptNameCn"
      :value="item.deptPath"
    ></el-option>
  </el-select>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { queryDepts } from "@/api/emplotee";
export default {
  components: { Treeselect },
  data() {
    return {
      loading: false,
      options: [],
      treeData: [],
      checkAll: false,
      selectValue: this.value
    };
  },
  /* computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        if (val.length != this.options.length) {
          this.checkAll = false;
        }
        this.$emit("change", val);
      },
    },
  }, */
  props: {
    value: {
      type: String | Array,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    measureId: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: '/riskmgr_mgr/safety_risk_notice_mgr/query/depts',
    }
  },
  created() {
    let form = !!this.measureId ? { id: this.measureId } : {}
    this.loading = true;
    queryDepts(this.url, form).then((res) => {
      this.loading = false;
      this.options = res.obj;
    });
  },
  methods: {
    ckChange(val) {
      if (val) {
        this.selectValue = this.options.map(r => r.deptPath);
      } else {
        this.selectValue = [];
      }
    },
    chooseValue(val) {
      if (val.length != this.options.length) {
          this.checkAll = false;
        }
        this.$emit("change", val);
    }
  },
};
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 400px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: auto;
  }
}
.el-divider--horizontal {
  margin: 4px 0;
}
.el-select-dropdown__list {
  .el-checkbox {
    margin: 4px 20px;
  }
}
</style>