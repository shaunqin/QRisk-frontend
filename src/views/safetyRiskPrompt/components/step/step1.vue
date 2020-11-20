<template>
  <div>
    <el-form ref="form" :model="_form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">
            <el-input v-model="data.no" style="width: 100%;" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主题">
        <el-input v-model="data.title" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="安全风险">
        <el-input v-model="data.existingRisk" style="width: 100%;" type="textarea" rows="6" />
      </el-form-item>
      <el-form-item label="背景">
        <el-input v-model="data.background" style="width: 100%;" type="textarea" rows="6" />
      </el-form-item>

      <el-form-item label="风险防范措施">
        <el-row
          v-for="(item,index) in data.measures"
          :key="index"
          style="margin-bottom: 10px;display:flex"
          :gutter="8"
        >
          <el-col :span="6">
            <department
              :value="!item.deptPath?[]:item.deptPath.split(',')"
              @change="deptChange($event,item)"
              :multiple="true"
              style="line-height:20px"
            />
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="item.deadline"
              value-format="yyyy-MM-dd"
              placeholder="为空则是长期选项"
              style="width:100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="11">
            <el-input
              v-model="item.content"
              style="width: 100%;"
              placeholder="措施内容"
              type="textarea"
              rows="3"
            />
          </el-col>
          <el-col :span="2">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="delRisk(index)"></el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              style="width: 100%;border-style: dashed;"
              @click="addRisk"
            >添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label>
        <el-radio-group v-model="_form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
        <el-input v-model="_form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import department from "@/components/Department/deptByRole";
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
    _form: {
      get() {
        return this.form;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  mounted() {
    // console.log(this.baseUrl);
  },
  methods: {
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