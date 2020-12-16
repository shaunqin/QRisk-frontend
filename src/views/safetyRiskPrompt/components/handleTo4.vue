<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <step4 ref="step4" v-if="step==4" :data="data" :form="form" @change="formChange" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="step==1||step==4" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { riskNoticeDetail, riskNoticeComplete, riskNoticeModify, validatePWD } from "@/api/risk";
import step4 from "./step/step4";
import hairdown from './hairdown';
import ccPerson from './ccPerson';
export default {
  components: { step4, ccPerson },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        comment: "", // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: "1",
        implementStatus: "" // 落实情况
      },
      data: {}, // 父组件赋值
      password: "",
      parentTaskId: ""
    };
  },
  props: {
    isSecChild: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: ''
    }
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
    formChange(form) {
      console.log(form);
      this.form = form;
    },
    doSubmit() {
      switch (this.step) {
        case 4:
          this.judgeCC();
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
          // 办理页面弹出办理
          if (this.isSecChild) {
            // 刷新父页面-已下发措施
            if (this.source == 'myIssued') {
              this.$parent.$parent.$parent.$parent.$parent.$parent.detail({ id: this.form.formId });
            }
            else {
              this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.subHandle({ taskId: this.parentTaskId, formId: this.form.formId });
            }
          } else {
            this.$parent.init();
            this.loadCount();
          }
        }
        this.loading = false;
        this.resetForm();
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
      };
    },
    loadCount() {
      this.$parent.$parent.$parent.$parent.$parent.loadCount();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

