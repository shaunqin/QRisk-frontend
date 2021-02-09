<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="申请延期"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          :picker-options="{disabledDate:date=>date.getTime() < Date.now() - 8.64e7}"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { applyDelay } from "@/api/hazards";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      loading: false,
      save_loading: false,
      dialog: false,
      form: {
        date: "",
        id: "",
        taskId: "",
      },
      formRules: {
        date: [{ required: true, message: "日期不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs['form'].validate(validate => {
        if (validate) {
          this.loading = true;
          applyDelay(this.form).then(res => {
            this.loading = false;
            if (res.code != '200') {
              this.$message.error(res.msg);
            } else {
              this.$message.success('操作成功');
              this.resetForm();
              this.$parent.init();
            }
          })
        }
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        date: "",
        id: "",
        taskId: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.file-table {
  margin-top: 10px;
}
</style>
