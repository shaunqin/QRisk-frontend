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
          :value="hairDownForm.deptPathList"
          :multiple="true"
          @change="deptChange"
          style="width:100%"
          :measureId="measureId"
          url="/riskControlManage/riskControlManage/query/depts"
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
import { riskControlIssue } from "@/api/risk";
import department from '@/components/Department/deptByRole'

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      measureId: "",
      hairDownForm: {
        content: "",
        deptPathList: [],
        sqlUserId: "",
        taskId: 0
      }
    };
  },
  props: ["data", "form"],
  created() {
    this.measureId = this.data.deptRisk ? this.data.deptRisk.id : "";
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        this.measureId = newData.deptRisk ? newData.deptRisk.id : "";
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.loading = true;
      let params = { ...this.hairDownForm, taskId: this.form.taskId, id: this.measureId };
      riskControlIssue(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.resetForm();
          this.$parent.$parent.$parent.subHandle(this.form);
        }
        this.loading = false;
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.hairDownForm.deptPathList = [];
    },
    deptChange(val) {
      this.hairDownForm.deptPathList = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

