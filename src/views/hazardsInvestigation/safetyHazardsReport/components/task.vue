<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新建任务' : '编辑任务'"
    custom-class="big_dialog"
  >
    <el-card header="基本信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto" inline>
        <el-row>
          <el-col :span="24" class="full-row">
            <el-form-item label="任务名称" prop="aa">
              <el-input v-model="form.aa" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="年度任务">
          <el-select v-model="form.dd" placeholder style="width: 150px;">
            <el-option :label="'年度任务'" :value="'0'"></el-option>
            <el-option :label="'单次任务'" :value="'1'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈日期">
          <el-date-picker v-model="form2.ee" placeholder style="width:150px"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="月度反馈日期设置" style="margin-top:20px" v-if="form.dd==0">
      <el-form :model="form2" size="small" label-width="auto">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="一月">
              <el-date-picker v-model="form2.dd1" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="五月">
              <el-date-picker v-model="form2.dd5" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="九月">
              <el-date-picker v-model="form2.dd9" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二月">
              <el-date-picker v-model="form2.dd2" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="六月">
              <el-date-picker v-model="form2.dd6" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十月">
              <el-date-picker v-model="form2.dd10" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三月">
              <el-date-picker v-model="form2.dd3" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="七月">
              <el-date-picker v-model="form2.dd7" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十一月">
              <el-date-picker v-model="form2.dd11" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四月">
              <el-date-picker v-model="form2.dd4" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="八月">
              <el-date-picker v-model="form2.dd8" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十二月">
              <el-date-picker v-model="form2.dd12" placeholder style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="单次任务部门" style="margin-top:20px" v-if="form.dd==1">
      <department :value="form.dept" @change="deptChange" style="width:400px" />
    </el-card>
    <el-card header="附件上传" style="margin-top:20px">
      <UploadExcel />
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import UploadExcel from "@/components/UploadExcel";
import department from "@/components/Department";

export default {
  components: { UploadExcel, department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        aa: "",
        bb: "",
        cc: "",
        dd: "0",
        ee: "",
        dept: null
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }],
      },
      entArr: [],
      form2: {},
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
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // this.loading = true;
          // if (this.isAdd) {
          //   this.doAdd()
          // } else this.doModify()

          this.dialog = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.resetForm();
        }
      });
    },
    doAdd() {
      // this.delwithRoleList()
      const data = this.roleSelect;
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: "",
        };
        obj.id = data[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
      add(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      modify(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
      };
      this.roleSelect = [];
    },
    deptChange(val) {
      this.form.dept = val;
    },
  },
};
</script>


<style lang="scss" scoped>
.full-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
