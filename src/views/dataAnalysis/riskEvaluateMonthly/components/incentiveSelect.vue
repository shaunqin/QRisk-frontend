<template>
  <el-row :gutter="16" style="display:flex;">
    <el-col :span="4">
      <dict-select
        type="incentive_category"
        :value="value1"
        @change="dictChange"
        :placeholder="$t('analysis.selectCategory')"
      ></dict-select>
    </el-col>
    <el-col :span="20">
      <el-select
        filterable
        multiple
        v-model="_value"
        style="width: 100%;"
        clearable
        :placeholder="$t('analysis.selectIncentive')"
      >
        <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.no"></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import { queryIncentiveList } from "@/api/standard";
import dictSelect from "@/components/common/dictSelect";
export default {
  components: { dictSelect },
  data() {
    return {
      totalList: [],
      option: [],
    };
  },
  props: {
    value1: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    _value: {
      get() {
        return !this.value ? [] : this.value.split(",");
      },
      set(val) {
        this.$emit("change", val);
      },
    },
    list() {
      if (!!this.value1)
        return this.totalList.filter(
          (r) => r.incentiveCateValue == this.value1
        );
      return this.totalList;
    },
  },
  created() {
    queryIncentiveList().then((res) => {
      if (res.code != "200") {
        this.$message.error(res.msg);
      } else {
        this.totalList = res.obj;
      }
    });
  },
  methods: {
    dictChange(val) {
      // this.value1 = val;
      this.$emit("value1-change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>