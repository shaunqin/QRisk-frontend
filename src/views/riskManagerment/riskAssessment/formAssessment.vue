<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="新建评估"
    custom-class="big_dialog"
  >
    <step1 v-if="step==1" :form="form" :formRules="formRules"></step1>
    <step2 v-if="step==2" :form="form"></step2>
    <step3 v-if="step==3" :form="form"></step3>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="step==3" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button v-if="step!=3" type="primary" @click="nextStep">下一步</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import step1 from "./components/step1";
import step2 from "./components/step2";
import step3 from "./components/step3";

export default {
  components: { step1, step2, step3 },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
        table: [],
        table2: [],
        report: {},
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }],
      },
      entArr: [],
      step: 1,
    };
  },
  props: {},
  created() {},
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      // this.loading = true;
      // if (this.isAdd) {
      //   this.doAdd()
      // } else this.doModify()

      this.dialog = false;
      this.$message({
        message: "添加成功",
        type: "success",
      });
      this.resetForm();
    },
    doAdd() {
      add(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      modify(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      // this.$refs["form"].resetFields();
      this.form = {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
        table: [],
        table2: [],
        report: {},
      };
      this.roleSelect = [];
      this.step = 1;
    },
    nextStep() {
      this.step++;
    },
  },
};
</script>


<style lang="scss" scope>
.big_dialog {
  width: 1100px;
}
</style>
