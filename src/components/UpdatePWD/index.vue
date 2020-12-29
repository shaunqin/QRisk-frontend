<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="修改密码"
    custom-class="small-dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input type="password" v-model="form.oldPwd" placeholder="请输入原始密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码" clearable></el-input>
        <span class="tip">
          <i class="el-icon-info"></i> 密码至少包含大、小写字母、数字、特殊字符中的三种，其中至少有一个小写字母，长度8-16
        </span>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input type="password" v-model="form.confirmPwd" placeholder="请再次输入密码以确认" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validPWD } from "@/utils/validate";
import { updatePwd } from '@/api/auth'
export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!validPWD(value)) {
        callback(new Error("密码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      dialog: false,
      loading: false,
      form: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      formRules: {
        oldPwd: [
          { required: true, message: "原始密码不能为空", trigger: "blur" },
        ],
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePwd },
        ],
        confirmPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePwd },
        ],
      },
    };
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      }
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.newPwd !== this.form.confirmPwd) {
            this.$message.error("两次密码输入不一致!");
          } else {
            updatePwd(this.form).then(res => {
              if (res.code != '200') {
                this.$message.error(res.msg);
              } else {
                this.$message.success("密码修改成功,下次登录生效!");
                this.cancel();
              }
            })
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .small-dialog {
  width: 650px !important;
}
.tip {
  display: block;
}
</style>
