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
    <step7 ref="step7" v-if="step==7" :data="data" :form="form" />
    <step8 ref="step8" v-if="step==8" :data="data" :form="form" />
    <hairdown ref="hairdown" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="warning" @click="doSubmitSave">暂存</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >提交</el-button>
      <el-button v-if="(step==1||step==4) && data.hiddenIssue && data.type!='2'" :loading="hdLoading" type="success" @click="doHairdown">下发</el-button>
      <!-- <el-button v-if="step==2||step==6" :loading="loading" type="primary" @click="doSubmit">确定</el-button> -->
    </div>
    <!-- 风险评价报告 -->
    <report ref="reportRef" :formId="formId" />
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { specialRiskComplete, specialRiskSaveHazard } from "@/api/risk";
import step1 from "./step/step1";
import step2 from "./step/step2";
import step3 from "./step/step3";
import step4 from "./step/step4";
import step5 from "./step/step5";
import step6 from "./step/step6";
import step7 from "./step/step7";
import step8 from "./step/step8";
import hairdown from './hairdown';
import ccPerson from './ccPerson';
import report from "./report";
export default {
  components: { step1, step2, step3, step4, step5, step6, step7, step8, hairdown, ccPerson, report },
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
      password: "",
      formId: ""
    };
  },
  computed: {
    step() {
      return this.data.step;
    },
    hiddenFill() {
      return this.data.hiddenFill;
    },
    // 是否需要抄送
    needCC() {
      return this.data.copy
    },
    deptPath() {
      return this.data.issueDept
    }
  },
  methods: {
    cancel() {
      this.resetForm();
      this.loadCount();
    },
    doSubmit() {
      switch (this.step) {
        case 1:
        case 3:
        case 5:
        case 7:
          this.submitStep1();
          break;
        case 2:
        case 6:
        case 8:
          this.judgeCC();
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
      const commentModel = { ...this.form, processFlag: "" }
      specialRiskSaveHazard({ ...this.data, commentModel }).then((res) => {
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
          this.loadCount();
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
            this.$parent.init(); // 刷新父页面
            this.loadCount();
          }
          this.hdLoading = false;
        })
      }
    },
    loadCount() {
      this.$parent.$parent.$parent.$parent.loadCount();
    },
    judgeCC() {
      // 领导审核同意
      if (this.data.leaderApprove && this.form.processFlag == "1") {
        this.$refs.ccPerson.dialog = true;
      } else if (!this.data.leaderApprove && this.form.processFlag == "2" && this.needCC) {  // 上级风险管理员驳回
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
      const commentModel = { ...this.form, ...params }
      specialRiskSaveHazard({...this.data, commentModel }).then((res) => {
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
    doSubmitSave() {
      this.loading = true;
      specialRiskSaveHazard(this.data).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          if (res.obj) {
            this.formId = this.data.id;
            this.$refs.reportRef.dialog = true;
          } else {
            this.$message.success("填报成功");
            this.$parent.init();
            this.resetForm();
          }
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

