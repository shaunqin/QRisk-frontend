<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="风险评价报告"
    custom-class="big_dialog"
  >
    <el-card v-for="(item,index) in form" :key="index">
      <el-form class="form" size="mini" label-width="85px">
        <el-form-item label="标题">{{item.title}}</el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="编号">{{item.no}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批准">{{item.approval}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">{{formatShortDate(item.approvalDate)}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="评价单位">
              <department
                class="mini"
                :value="item.evaluationUnit"
                @change="deptChange($event,item,'evaluationUnit')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主送单位">
              <department
                class="mini"
                :value="item.distributeDept"
                @change="deptChange($event,item,'distributeDept')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送单位">
              <department
                class="mini"
                :value="item.copyDept"
                @change="deptChange($event,item,'copyDept')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景描述">
          <el-input v-model="item.background" type="textarea" rows="5" :disabled="disabled"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="严重性等级">{{item.seriousnessLevelName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可能性等级">{{item.possibleLevelName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险等级">{{item.riskLevelName}}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="控制目标">{{item.controlObj}}</el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="控制措施">{{item.controlMeasure}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任单位">{{item.reponsibleDeptName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完成期限">{{formatShortDate(item.deadline)}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="!disabled" :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  specialRiskGetEvalReport,
  specialRiskSaveEvalReport,
} from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
import department from "@/components/Department";

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: [],
    };
  },
  props: {
    formId: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _formId: {
      get() {
        return this.formId;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  watch: {
    _formId(val) {
      if (val) {
        this.loadData(val);
      }
    },
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      specialRiskSaveEvalReport(this.form).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("操作成功");
          this.resetForm();
          this.$parent.$parent.resetForm();
          this.$parent.$parent.$parent.init();
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.form = [];
      this._formId = "";
    },
    loadData(formId) {
      specialRiskGetEvalReport(formId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.form = res.obj;
        }
      });
    },
    deptChange(val, item, key) {
      item[key] = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card + .el-card {
  margin-top: 20px;
}
.form .el-form-item {
  margin-bottom: 4px;
}
</style>

