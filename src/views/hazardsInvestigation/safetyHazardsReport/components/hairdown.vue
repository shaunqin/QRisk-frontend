<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="下发"
  >
    <el-form :model="hairdownForm" size="small" label-width="80px">
      <el-form-item label="责任单位">
        <department
          style="width:100%"
          :value="hairdownForm.path"
          :measureId="measureId"
          :multiple="true"
          @change="deptChange"
          url="/riskmgr_mgr/hidden_danger/query/depts"
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
import department from "@/components/Department/deptByRole";
import { hazardsIssue } from '@/api/hazards'
export default {
  components: { department },
  data() {
    return {
      dialog: false,
      loading: false,
      hairdownForm: {
        path: [],
        taskId: this.form.taskId,
        id: this.data.id
      },
      measureId: this.data.id
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    form: {
      type: Object,
      default: () => { },
    },
    source: {
      type: String,
      default: ''
    }
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.measureId = data.id;
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.hairdownForm = {
        path: [],
        taskId: this.form.taskId,
        id: this.data.id
      }
    },
    doSubmit() {
      if (this.hairdownForm.path.length == 0) {
        this.$message.error("请选择部门!");
        return
      }
      this.loading = true;
      hazardsIssue(this.hairdownForm).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
          this.$parent.$parent.$parent.hazards();
        } else {
          this.$message.success("下发成功");
          this.resetForm();
          if (this.source == 'smart') {
            this.$parent.$parent.$parent.hazards();
          } else {
            // 刷新父页面
            this.$parent.$parent.$parent.subHandle(this.form);
          }
        }
      })
    },
    deptChange(val) {
      this.hairdownForm.path = val;
    },
  }
}
</script>

<style lang="scss" scoped>
</style>