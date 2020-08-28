<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="生成图表"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="auto" inline>
      <el-form-item label="图表类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择图表类型" style="width:480px">
          <el-option label="折线图" value="line"></el-option>
          <el-option label="柱形图" value="bar"></el-option>
          <el-option label="扇形图" value="pie"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="x轴" prop="x">
        <el-select v-model="form.x" placeholder="请选择x轴">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列">
        <el-select v-model="form.series" placeholder="请选择系列">
          <el-option
            v-for="item in option.filter(r=>r.value!=form.x)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { eventBus } from "@/utils/eventBus";
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        type: "",
        x: "",
        series: "",
      },
      option: [
        { label: "部门", value: "dept" },
        { label: "发生日期", value: "date" },
        { label: "产品", value: "product" },
        { label: "系统", value: "system" },
        { label: "危险源", value: "hazard" },
        { label: "风险", value: "risk" },
        { label: "诱因", value: "incentive" },
      ],
      rules: {
        type: [
          { required: true, message: "图标类型不能为空", trigger: "blur" },
        ],
        x: [{ required: true, message: "x轴不能为空", trigger: "blur" }],
        // series: [{ required: true, message: "系列不能为空", trigger: "blur" }],
      },
    };
  },
  mounted() {
    eventBus.$on("close-dialog", () => {
      this.loading = false;
      this.cancel();
    });
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let _form = Object.assign({}, this.form);
          this.$emit("change", _form);
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        type: "",
        x: "",
        series: "",
      };
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>