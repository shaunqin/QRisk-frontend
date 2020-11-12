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
          :value="form.pathAndDeadLines"
          :multiple="true"
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
import { specialRiskComplete } from "@/api/risk";
import department from '@/components/Department/deptByRole'

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      measureId: ""
    };
  },
  props: ["data", "form"],
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
      this.form.processFlag = "3";
      specialRiskComplete(this.form).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.resetForm();
          this.$parent.$parent.resetForm();
          this.$parent.$parent.$parent.init(); // 刷新父页面
        }
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form.pathAndDeadLines = [];
    },
    deptChange(val) {
      this.form.pathAndDeadLines = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

