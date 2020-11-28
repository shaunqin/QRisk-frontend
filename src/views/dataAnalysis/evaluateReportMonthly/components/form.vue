<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form size="mini" inline>
      <el-row class="full-row">
        <el-col :span="24">
          <el-form-item label="标题">
            <el-input v-model="formData.riskControl.title" placeholder></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card
        :gutter="8"
        v-for="(item,index) in formData.riskControl.riskControlExpList"
        :key="index"
      >
        <el-form-item label="风险">
          <riskSelect :value="item.risk" style="width:150px" :disabled="true" />
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

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="save_loading" type="success" @click="doSave">保存</el-button>
      <el-button :loading="loading" type="primary" @click="handleEmp">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeAdd, riskNoticeModify, riskNoticeSaveandSubmit, riskNoticeUpdateandSubmit } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
import riskSelect from '@/views/dataAnalysis/riskEvaluateMonthly/components/riskSelect'
export default {
  components: { department, riskSelect },
  data() {
    return {
      loading: false,
      save_loading: false,
      dialog: false,
      form: {
        riskControl: {
          fileId: "",
          title: "",
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
        no: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        title: [{ required: true, message: "主题不能为空", trigger: "blur" }],
        background: [
          { required: true, message: "背景不能为空", trigger: "blur" },
        ],
        existingRisk: [
          {
            required: true,
            message: "存在的安全风险不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  created() { },
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          if (this.isAdd) {
            riskNoticeAdd(this.form).then((res) => {
              if (res.code === "200") {
                this.form.id = res.obj;
                this.$message.success("添加成功");
                this.save_loading = false;
                this.$parent.init();
              } else {
                this.$message.error(res.msg);
                this.save_loading = false;
              }
            });
          } else {
            riskNoticeModify(this.form).then((res) => {
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
        }
      });
    },
    doSubmit(sqlUserId) {
      if (this.isAdd) {
        this.saveAndSubmit(sqlUserId);
      } else {
        this.updateAndSubmit(sqlUserId);
      }
    },
    saveAndSubmit(sqlUserId) {
      this.loading = true;
      riskNoticeSaveandSubmit({ ...this.form, sqlUserId }).then((res) => {
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
    updateAndSubmit(sqlUserId) {
      this.loading = true;
      riskNoticeUpdateandSubmit({ ...this.form, sqlUserId }).then((res) => {
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
        no: "",
        title: "",
        background: "",
        existingRisk: "",
        measures: [],
      };
    },
    addRow() {
      this.formData.riskControl.riskControlExpList.push({
        remark: "",// 图备注
        risk: "", // 风险
        riskSource: "", // 图来源:1-1
        deptPathList: [], // 部门
        fillDeadline: "", // 填报截止日期
        implementDeadline: "", // 落实截止日期
      })
    },
    delRow(index) {
      this.formData.riskControl.riskControlExpList.splice(index, 1);
    },
    deptChange(val, item) {
      item.deptPathList = val;
    },
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

