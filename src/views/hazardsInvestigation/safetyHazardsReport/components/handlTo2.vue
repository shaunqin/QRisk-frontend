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
    <hairdown ref="hairdown" :data="data" :form="form" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="step==2" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { hazardsComplete, } from "@/api/hazards";
import step2 from "./step/step2";
import hairdown from './hairdown'
import ccPerson from './ccPerson';

export default {
  components: { hairdown, step2, ccPerson },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
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
      password: "",
      parentTaskId: ""
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
    },
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
          if (this.source == "smart") {
            this.$parent.$parent.$parent.$parent.$parent.$parent.hazards();
          } else {
            // 刷新父页面-已下发措施
            this.$parent.$parent.$parent.$parent.$parent.$parent.subHandle({ taskId: this.parentTaskId, formId: this.form.formId });
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
    },
    loadCount() {
      this.$parent.$parent.$parent.$parent.loadCount();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

