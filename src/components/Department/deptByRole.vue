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
  >
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
      options: [],
      treeData: [],
    };
  },
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
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
    queryDepts(this.url, form).then((res) => {
      this.options = res.obj;
    });
  },
  methods: {

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
</style>