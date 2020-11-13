<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <step1 v-if="step==1" :data="data" :form="form" />
    <step2 ref="step2" v-if="step==2" :data="data" :form="form" />
    <step3 ref="step3" v-if="step==3" :data="data" :form="form" />
    <step4 ref="step4" v-if="step==4" :data="data" :form="form" />
    <step5 ref="step5" v-if="step==5" :data="data" :form="form" />
    <step6 ref="step6" v-if="step==6" :data="data" :form="form" />
    <hairdown ref="hairdown" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        v-if="step==1||step==3||step==5"
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >上报</el-button>
      <el-button v-if="step==1||step==4" :loading="hdLoading" type="success" @click="doHairdown">下发</el-button>
      <el-button v-if="step==2||step==6" :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { specialRiskComplete } from "@/api/risk";
import step1 from "./step/step1";
import step2 from "./step/step2";
import step3 from "./step/step3";
import step4 from "./step/step4";
import step5 from "./step/step5";
import step6 from "./step/step6";
import hairdown from './hairdown'
export default {
  components: { step1, step2, step3, step4, step5, step6, hairdown },
  data() {
    return {
      loading: false,
      hdLoading: false,
      dialog: false,
      form: {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "1",
        implementStatus: "", // 落实情况
        pathAndDeadLines: [] // 下发部门
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
      return this.data.hiddenFill;
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      switch (this.step) {
        case 1:
        case 3:
        case 5:
          this.submitStep1();
          break;
        case 2:
        case 6:
          this.submitStep2();
          break;
        default:
          break;
      }
    },
    doSave() {
      let _this = this.$refs.step2;
      riskNoticeModify(_this.detailForm).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("保存成功");
          _this.formChange = false;
        }
      });
    },
    resetForm() {
      this.dialog = false;
    },
    formChange(form) {
      console.log(form);
      this.form = form;
    },
    submitStep1() {
      this.loading = true;
      specialRiskComplete({ ...this.form, processFlag: "" }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          this.$parent.init();
        }
        this.loading = false;
      });
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
      this.loading = true;
      specialRiskComplete(this.form).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          this.$parent.init();
        }
        this.loading = false;
      });
    },
    doHairdown() {
      if (this.step == 1) {
        this.$refs.hairdown.dialog = true;
      } else {
        // 措施下发
        this.form.processFlag = "3";
        this.hdLoading = true;
        specialRiskComplete(this.form).then(res => {
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.resetForm();
            this.$parent.$parent.resetForm();
            this.$parent.$parent.$parent.init(); // 刷新父页面
          }
          this.hdLoading = false;
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

