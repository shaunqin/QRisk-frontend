<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form v-model="form" ref="form" size="mini" inline :rules="formRules">
      <el-row class="full-row">
        <el-col :span="24">
          <el-form-item label="标题">
            <el-input v-model="form.riskControl.title" placeholder></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card
        v-loading="cdLoading"
        :gutter="8"
        v-for="(item,index) in form.riskControl.riskControlExpList"
        :key="index"
      >
        <el-form-item label="风险图">
          <el-select
            v-model="item.riskSource"
            placeholder
            @change="picSourceChange($event,item)"
            clearable
          >
            <el-option
              v-for="item in picSource"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险">
          <riskSelect
            :filterArr="imageRiskList.length>0&&!!item.riskSource?imageRiskList.find(r=>r.name==item.riskSource).children:[]"
            :value="item.risk"
            @change="riskChange($event,item)"
            style="width:150px"
          />
        </el-form-item>
        <el-form-item label="填报截止日期">
          <el-date-picker v-model="item.fillDeadline" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
        </el-form-item>
        <el-form-item label="落实截止日期">
          <el-date-picker
            v-model="item.implementDeadline"
            value-format="yyyy-MM-dd"
            style="width:140px"
          ></el-date-picker>
        </el-form-item>
        <el-row class="full-row">
          <el-col :span="24">
            <el-form-item label="责任单位">
              <department
                class="mini"
                :value="item.deptPathList"
                @change="deptChange($event,item)"
                style="width:100%;"
                :multiple="true"
                :flat="true"
              ></department>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="item.remark" placeholder></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align:center">
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" @click="delRow(index)"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-button
      class="mt"
      icon="el-icon-plus"
      style="width:100%;border-style: dashed;"
      @click="addRow"
    >新增</el-button>

    <selectEmp ref="selectEmp" @on-submit="doSubmit" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="save_loading" type="success" @click="doSave">保存</el-button>
      <el-button :loading="loading" type="primary" @click="handleEmp">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskControlModify, riskControlUpdateAndSubmit, getRiskAssessmentChartData } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
import riskSelect from '@/views/dataAnalysis/riskEvaluateMonthly/components/riskSelect'
import selectEmp from './selectEmplotee'
export default {
  components: { department, riskSelect, selectEmp },
  data() {
    return {
      loading: false,
      cdLoading: false,
      save_loading: false,
      dialog: false,
      form: {
        riskControl: {
          fileId: "",
          title: "",
          year: "",
          month: "",
          riskControlExpList: [
            {
              remark: "",// 图备注
              risk: "", // 风险
              riskSource: "", // 图来源:1-1
              deptPathList: [], // 部门
              fillDeadline: "", // 填报截止日期
              implementDeadline: "", // 落实截止日期
            }
          ]
        }
      },
      formRules: {
        "riskControl.title": [{ required: true, message: "标题不能为空", trigger: "blur" }],
      },
      picSource: [
        { label: '1-1、月度关键风险状态', value: '1_1' },
        { label: '1-2、年度关键风险状态', value: '1_2' },
        { label: '1-3、关键风险TOP3趋势', value: '1_3' },
        { label: '1-4、关键风险TOP3状态(各产品)', value: '1_4' },
        { label: '1-5、关键风险TOP3状态(各单位)', value: '1_5' },
        { label: '1-6、关键风险TOP3关联危险源', value: '1_6' }
      ],
      imageRiskList: []
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    "form.riskControl.year"(val) {
      this.cdLoading = true;
      getRiskAssessmentChartData({ dateValue1: val, dateValue2: this.form.riskControl.month, dateType: 2 }).then(res => {
        this.cdLoading = false;
        if (res.code == '200') {
          this.imageRiskList = res.obj.map(item => {
            return {
              name: item.imageNo,
              children: item.data.map(r => r.name)
            }
          })
          console.log(this.imageRiskList);
        }
      })
    }
  },
  created() { },
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSave() {
      this.save_loading = true;
      if (!this.isAdd) {
        riskControlModify(this.form).then((res) => {
          if (res.code === "200") {
            this.$message.success("保存成功");
            this.save_loading = false;
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
            this.save_loading = false;
          }
        });
      }
    },
    handleEmp() {
      this.$refs.selectEmp.dialog = true;
    },
    doSubmit(sqlUserId) {
      this.loading = true;
      this.form.riskControl.sqlUserId = sqlUserId;
      riskControlUpdateAndSubmit(this.form).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.resetForm();
          this.$parent.init();
        }
        this.loading = false;
      });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        riskControl: {
          fileId: "",
          title: "",
          year: "",
          month: "",
          riskControlExpList: [
            {
              remark: "",// 图备注
              risk: "", // 风险
              riskSource: "", // 图来源:1-1
              deptPathList: [], // 部门
              fillDeadline: "", // 填报截止日期
              implementDeadline: "", // 落实截止日期
            }
          ]
        }
      };
    },
    addRow() {
      this.form.riskControl.riskControlExpList.push({
        remark: "",// 图备注
        risk: "", // 风险
        riskSource: "", // 图来源:1-1
        deptPathList: [], // 部门
        fillDeadline: "", // 填报截止日期
        implementDeadline: "", // 落实截止日期
      })
    },
    delRow(index) {
      this.form.riskControl.riskControlExpList.splice(index, 1);
    },
    deptChange(val, item) {
      item.deptPathList = val;
    },
    riskChange(val, item) {
      item.risk = val;
    },
    picSourceChange(val, item) {
      item.risk = "";
    }
  },
};
</script>

<style lang="scss" scoped>
.full-row {
  /deep/.el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
.el-card + .el-card {
  margin-top: 10px;
}
.mt {
  margin-top: 10px;
}
/deep/ .vue-treeselect--append-to-body {
  z-index: 100 !important;
}
</style>

