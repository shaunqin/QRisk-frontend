<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="下发"
  >
    <el-form ref="form" :model="form" size="small">
      <el-form-item label="选择部门" label-width="80px">
        <department
          v-if="deptBool"
          :value="multiple?form.pathAndDeadLines:''"
          :multiple="multiple"
          @change="deptChange"
          style="width:100%"
        />
        <deptByRole
          v-else
          :value="multiple?form.pathAndDeadLines:''"
          :multiple="multiple"
          @change="deptChange"
          style="width:100%"
          :measureId="measureId"
          url="/risk_mgr/special_risk_notice_mgr/query/depts"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { specialRiskComplete, specialRiskIssue } from "@/api/risk";
import deptByRole from '@/components/Department/deptByRole'
import department from '@/components/Department'

export default {
  components: { deptByRole, department },
  data() {
    return {
      loading: false,
      dialog: false,
      measureId: "",
      parentTaskId: "",
      deptBool: false
    };
  },
  props: {
    data: {
      type: Object
    },
    form: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default: true
    },
    issue: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      default: ""
    }
  },
  created() {
    this.measureId = this.data.id;
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        this.measureId = newData.id;
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      if (this.issue) {
        this.doComplete()
      } else {
        this.doIssue()
      }
    },
    doComplete() {
      this.form.processFlag = "3";
      this.loading = true;
      specialRiskComplete(this.form).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.resetForm();
          if (this.source == 'smart') {
            this.$parent.$parent.$parent.speciaRisk()
          } else {
            this.$parent.$parent.resetForm();
            this.$parent.$parent.$parent.init(); // 刷新父页面
          }
        }
        this.loading = false;
      })
    },
    doIssue() {
      this.loading = true;
      specialRiskIssue(this.form).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.resetForm();
          if (this.source == 'smart') {
            this.$parent.$parent.$parent.speciaRisk()
          } else {
            const params = { taskId: this.form.taskId }
            if (this.$parent.$parent.$parent.step == 1) {
              this.$parent.$parent.$parent.$parent.subHandle(params)
            } else {
              this.$parent.$parent.$parent.$parent.$parent.subHandle(params)
            }
          }
        }
        this.loading = false;
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form.pathAndDeadLines = [];
    },
    deptChange(val) {
      if (this.multiple) {
        this.form.pathAndDeadLines = val;
      } else {
        this.form.pathAndDeadLines[0] = val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

