<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <step1 ref="step1" v-if="step==1" :data="data" :form="form" />
    <step2 ref="step2" v-if="step==2" :data="data" :form="form" />
    <step3 ref="step3" v-if="step==3" :data="data" :form="form" />
    <hairdown ref="hairdown" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="(step==1||step==3)&&!hiddenFill" type="primary" @click="doReport">填报</el-button>
      <el-button v-if="step==2" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button
        v-if="step==3||step==1"
        :loading="loading"
        :disabled="!!data.hiddenIssue"
        type="success"
        @click="doHairdown"
      >下发</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hazardsComplete, } from "@/api/hazards";
import step1 from "./step/step1";
import step2 from "./step/step2";
import step3 from "./step/step3";
import hairdown from './hairdown'

export default {
  components: { step1, hairdown, step2, step3 },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "",
        sqlUserId: "",
        hiddenDangerList: []
      },
      data: {}, // 父组件赋值
      password: ""
    };
  },
  computed: {
    step() {
      return this.data.step;
    },
    hiddenFill() {
      return this.data.hiddenFill
    }
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
        default:
          break;
      }
    },
    resetForm() {
      this.dialog = false;
      this.form = {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "",
        sqlUserId: "",
        hiddenDangerList: []
      };
    },
    submitStep2() {
      if (this.form.processFlag == "") {
        this.$message.error("请选择同意/驳回！");
        return;
      }
      if (this.form.processFlag == "2" && this.form.comment == "") {
        this.$message.error("请输入驳回备注！");
        return;
      }
      // 获取领导修改的填报数据
      if (this.$refs.step2) {
        this.form.hiddenDangerList = this.$refs.step2.$refs.fillinForm.fillinData;
      }
      this.loading = true;
      hazardsComplete(this.form).then((res) => {
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
    doHairdown() {
      this.$refs.hairdown.dialog = true;
    },
    doReport() {
      let _this;
      if (this.step == 1) {
        _this = this.$refs.step1.$refs.fillinForm;
      } else if (this.step == 3) {
        _this = this.$refs.step3.$refs.fillinForm;
      }
      // let _this = this.$refs.step1.$refs.fillinForm;
      this.form.hiddenDangerList = _this.fillinData;
      console.log(this.form);
      this.$loading();
      hazardsComplete(this.form).then(res => {
        this.$loading().close();
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("填报成功!");
          this.resetForm(); // 关闭主弹窗
          _this.resetForm();  // 关闭子弹窗
          this.$parent.init();
          this.loadCount();
        }
      })
    },
    loadCount() {
      this.$parent.$parent.$parent.$parent.loadCount();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

