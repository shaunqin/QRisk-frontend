<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年份">{{`${data.year}-${data.month}`}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="拟制人">{{data.issueName}}[{{data.issuer}}]</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-link type="primary" target="_blank" :href="baseUrl+data.filePath">查看PDF</el-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题">{{data.title}}</el-form-item>
      <el-form-item label="风险措施">
        <el-table :data="data.riskControlExpVoList" size="mini">
          <el-table-column label="下发单位" prop="deptPathCn" />
          <el-table-column label="风险" prop="riskName" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="填报截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.fillDeadline)}}</template>
          </el-table-column>
          <el-table-column label="落实截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.implementDeadline)}}</template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label>
        <el-radio-group v-model="form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
        <el-input v-model="form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import department from "@/components/Department/deptByRole";
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { department },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
    };
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    form: {
      type: Object,
      default: () => { },
    },
  },
  computed: {
    dialog() {
      return this.$parent.$parent.dialog;
    }
  },
  mounted() {
    // console.log(this.baseUrl);
  },
  methods: {
    formatShortDate,
    addRisk() {
      this.data.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
      });
    },
    delRisk(index) {
      this.data.measures.splice(index, 1);
      console.log(this.form.measures);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
  },
};
</script>

<style lang="scss" scoped>
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>