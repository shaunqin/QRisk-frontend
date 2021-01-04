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
    <step1 ref="step1" v-if="step==1" :data="data" :form="form" :fullscreen="fullscreen" />
    <step2 ref="step2" v-if="step==2" :data="data" :form="form" />
    <step3 ref="step3" v-if="step==3" :data="data" :form="form" />
    <hairdown ref="hairdown" :data="data" :form="form" :source="fullscreen?'smart':''" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel" v-if="!fullscreen">取消</el-button>
      <el-button v-if="step==1" type="info" @click="doSave">暂存</el-button>
      <el-button v-if="(step==1||step==3)&&!hiddenFill" type="primary" @click="doReport">填报</el-button>
      <el-button v-if="step==2" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button
        v-if="step==1&&!data.hiddenIssue"
        :loading="loading"
        :disabled="!!data.hiddenIssue"
        type="success"
        @click="doHairdown"
      >下发</el-button>
    </div>
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { hazardsComplete, hazardsSave } from "@/api/hazards";
import step1 from "./step/step1";
import step2 from "./step/step2";
import step3 from "./step/step3";
import hairdown from './hairdown'
import ccPerson from './ccPerson';

export default {
  components: { step1, hairdown, step2, step3, ccPerson },
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
        sqlUserId: "",
        hiddenDangerList: [],
        noHiddenDanger: "0"
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
    },
    deptPath() {
      return this.data.deptPath || ""
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      switch (this.step) {
        case 2:
          this.judgeCC();
          break;
        default:
          break;
      }
    },
    judgeCC() {
      // 领导审核同意
      if (this.data.leaderApprove && this.form.processFlag == "1" && this.data.cc) {
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
      // 获取领导修改的填报数据
      this.form.hiddenDangerList = [];
      if (this.$refs.step2) {
        if (this.$refs.step2.$refs.fillinForm)
          this.form.hiddenDangerList = this.$refs.step2.$refs.fillinForm.fillinData;
      }
      this.loading = true;
      hazardsComplete({ ...this.form, ...params }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          if (!this.fullscreen) {
            this.$parent.init();
            this.loadCount();
          }
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
      if (this.fullscreen) {
        window.close();
      }
    },
    doHairdown() {
      this.$refs.hairdown.dialog = true;
    },
    doReport() {
      let _this;
      this.form.hiddenDangerList = [];
      if (this.step == 1) {
        _this = this.$refs.step1.$refs.fillinForm;
      } else if (this.step == 3) {
        _this = this.$refs.step3.$refs.fillinForm;
      }
      // let _this = this.$refs.step1.$refs.fillinForm;
      if (_this)
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
          if (_this)
            _this.resetForm();  // 关闭子弹窗
          if (!this.fullscreen) {
            this.$parent.init();
            this.loadCount();
          }
        }
      })
    },
    doSave() {
      let _this;
      this.form.hiddenDangerList = [];
      if (this.step == 1) {
        _this = this.$refs.step1.$refs.fillinForm;
      }
      // let _this = this.$refs.step1.$refs.fillinForm;
      if (_this)
        this.form.hiddenDangerList = _this.fillinData;
      console.log(this.form);
      this.$loading();
      hazardsSave(this.form).then(res => {
        this.$loading().close();
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("暂存成功!");
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

