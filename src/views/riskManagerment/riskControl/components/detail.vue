<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'风险评价报告'"
    custom-class="big_dialog"
  >
    <el-card v-for="(item,index) in form" :key="index">
      <el-form class="form" size="mini" label-width="85px">
      <el-card>
        <el-form-item label="标题">{{item.analysisTitle}}</el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="编号">{{item.analysisNo}}</el-form-item>
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
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主送单位">
              <department
                class="mini"
                :value="item.distributeDept"
                @change="deptChange($event,item,'distributeDept')"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送单位">
              <department
                class="mini"
                :value="item.copyDept"
                @change="deptChange($event,item,'copyDept')"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景描述">
          <el-input v-model="item.background" type="textarea" rows="5" :disabled="true"></el-input>
        </el-form-item>
        </el-card>
        <!-- <el-divider></el-divider> -->
        <el-card header="危险源识别">
          <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="危险源">{{item.hazardSourceName}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="根原因分析">{{item.rootCauseAnalysis}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可能导致的风险">{{item.possibleRisksName}}</el-form-item>
          </el-col>
        </el-row>
        </el-card>
        <el-card header="风险分析和评价">
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
        </el-card>
      </el-form>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from "@/utils/datetime";
import department from "@/components/Department";

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: [],
      riskForm: {},
      roleSelect: [],
      entArr: [],
      dataString: "",
      bumen: "",
      data: []
    };
  },
  created() {},
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.form = [];
    },
  }
};
</script>

<style lang="scss" scoped>

</style>

