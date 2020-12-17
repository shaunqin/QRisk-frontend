<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    v-loading="dialogLoading"
    title="处理待办"
    custom-class="big_dialog"
    :fullscreen="fullscreen"
    :show-close="!fullscreen"
  >
    <step1 v-if="step==1" :data="data" :form="form" @change="formChange" />
    <step2 ref="step2" v-if="step==2" :data="data" :form="form" @change="formChange" />
    <step3 ref="step3" v-if="step==3" :data="data" :form="form" @change="formChange" />
    <step4 ref="step4" v-if="step==4" :data="data" :form="form" @change="formChange" />
    <step5 ref="step5" v-if="step==5" :data="data" :form="form" @change="formChange" />
    <hairdown ref="hairdown" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel" v-if="!fullscreen">取消</el-button>
      <el-button v-if="step==1||step==4" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button v-if="step==2" :loading="loading" type="primary" @click="doSave">保存</el-button>
      <el-button v-if="step==2" :loading="loading" type="success" @click="doSubmit">提交</el-button>
      <el-button
        v-if="(step==3||step==5)&&!hiddenFill"
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >上报</el-button>
      <el-button
        v-if="step==3&&!data.deptMeasure.hiddenIssue"
        :loading="loading"
        :disabled="!!data.deptMeasure.hiddenIssue"
        type="success"
        @click="doHairdown"
      >下发</el-button>
    </div>
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { riskNoticeDetail, riskNoticeComplete, riskNoticeModify, validatePWD } from "@/api/risk";
import step1 from "./step/step1";
import step2 from "./step/step2";
import step3 from "./step/step3";
import step4 from "./step/step4";
import step5 from "./step/step5";
import hairdown from './hairdown';
import ccPerson from './ccPerson';
export default {
  components: { step1, step2, step3, step4, step5, hairdown, ccPerson },
  props: {
    /**smart平台跳转过来,处理待办,全屏显示弹窗,隐藏关闭按钮 */
    fullscreen: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogLoading: false,
      form: {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "1",
        implementStatus: "" // 落实情况
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
    },
    deptPath() {
      return this.data.deptMeasure ? this.data.deptMeasure.deptPath : ""
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    validatePWD() {
      if (this.form.processFlag == "") {
        this.$message.error("请选择同意/驳回！");
        return;
      }
      if (this.form.processFlag == "1") {
        this.$prompt('请输入密码', '', {
          inputType: 'password',
        }).then(({ value }) => {
          if (!value) {
            this.$message.error("请输入密码");
          } else {
            validatePWD(value).then(res => {
              if (res.code != '200') {
                this.$message.error(res.msg);
              } else {
                if (res.obj) {
                  this.submitStep1();
                } else {
                  this.$message.error("密码不正确")
                }
              }
            })
          }
        }).catch(() => { })
      } else {
        this.submitStep1();
      }
    },
    doSubmit() {
      switch (this.step) {
        case 1:
          this.validatePWD();
          break;
        case 4:
          this.judgeCC();
          break;
        case 2:
          this.submitStep2();
          break;
        case 3:
        case 5:
          this.submitStep3();
          break;
        default:
          break;
      }
    },
    judgeCC() {
      // 领导审核同意
      if (this.data.leaderApprove && this.form.processFlag == "1") {
        this.$refs.ccPerson.dialog = true;
      } else if (!this.data.leaderApprove && this.form.processFlag == "2" && this.data.cc) {  // 上级风险管理员驳回
        if (this.form.comment == "") {
          this.$message.error("请输入驳回备注！");
          return;
        }
        this.$refs.ccPerson.dialog = true;
      } else {
        if (this.form.processFlag == "2" && this.form.comment == "") {
          this.$message.error("请输入驳回备注！");
          return;
        }
        this.subCC({});
      }
    },
    subCC(params) {
      if (this.form.processFlag == "2" && this.form.comment == "") {
        this.$message.error("请输入驳回备注！");
        return;
      }
      this.loading = true;
      riskNoticeComplete({ ...this.form, ...params }).then((res) => {
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
      this.form = {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "1",
        implementStatus: "" // 落实情况
      }
    },
    formChange(form) {
      console.log(form);
      this.form = form;
    },
    submitStep1() {
      if (this.form.processFlag == "") {
        this.$message.error("请选择同意/驳回！");
        return;
      }
      if (this.form.processFlag == "2" && this.form.comment == "") {
        this.$message.error("请输入驳回备注！");
        return;
      }
      this.loading = true;
      riskNoticeComplete({ ...this.form, safetyRiskNotice: this.data }).then((res) => {
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
    submitStep2() {
      let _this = this.$refs.step2;
      // console.log(_this.formChange);
      // if (_this.formChange) {
      //   this.$message("提交前请先保存！");
      //   return;
      // }
      this.loading = true;
      let params = { ...this.form, safetyRiskNotice: _this.detailForm }
      riskNoticeComplete(params).then((res) => {
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
      this.form.processFlag = "4";
      this.loading = true;
      riskNoticeComplete(this.form).then((res) => {
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
    loadCount() {
      this.$parent.$parent.$parent.$parent.$parent.loadCount();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

