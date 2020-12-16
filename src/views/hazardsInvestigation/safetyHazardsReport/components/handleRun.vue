<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <step2 ref="step2" v-if="step==2" :data="data" :form="form" />
    <step3 ref="step3" v-if="step==3" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hazardsComplete2, } from "@/api/hazards";
import step2 from "./stepRun/step2";
import step3 from "./stepRun/step3";

export default {
  components: { step2, step3 },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        comment: "", // 驳回备注
        taskId: 0,
        processFlag: "1",
      },
      data: {}, // 父组件赋值
      password: ""
    };
  },
  computed: {
    step() {
      return this.data.step;
    },
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      switch (this.step) {
        case 2:
          this.submitStep2();
          break;
        case 3:
          this.submitStep3();
          break;
        default:
          break;
      }
    },
    submitStep2() {
      if (this.form.processFlag == "2" && this.form.comment == "") {
        this.$message.error("请输入驳回备注！");
        return;
      }
      this.loading = true;
      hazardsComplete2({ ...this.form }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          this.$parent.init();
          this.loadCount();
        }
        this.loading = false;
      });
    },
    submitStep3() {
      this.loading = true;
      hazardsComplete2({ ...this.form }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          this.$parent.init();
          this.loadCount();
        }
        this.loading = false;
      });
    },
    resetForm() {
      this.dialog = false;
      this.form = {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "1",
        sqlUserId: "",
        hiddenDangerList: []
      };
    },
    loadCount() {
      this.$parent.$parent.$parent.$parent.loadCount();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

