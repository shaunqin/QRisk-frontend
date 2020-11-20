<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-card header="基本信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" inline>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" style="width: 150px;" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="年度">
          <el-date-picker
            v-model="form.year"
            value-format="yyyy"
            type="year"
            placeholder="请输入年度"
            style="width: 130px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="反馈日期">
          <el-select v-model="form.defaultDay" placeholder clearable style="width: 130px;">
            <el-option v-for="num in 31" :key="num" :label="'每月 '+num+' 日'" :value="num"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品">
          <dictSelect :value="form.productValue" type="quality_product_index" @change="dictChange" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="月度反馈日期设置" style="margin-top:20px">
      <el-form :model="form2" size="small" label-width="auto">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="一月">
              <el-date-picker
                v-model="form2[1]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="五月">
              <el-date-picker
                v-model="form2[5]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="九月">
              <el-date-picker
                v-model="form2[9]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二月">
              <el-date-picker
                v-model="form2[2]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="六月">
              <el-date-picker
                v-model="form2[6]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="十月">
              <el-date-picker
                v-model="form2[10]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三月">
              <el-date-picker
                v-model="form2[3]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="七月">
              <el-date-picker
                v-model="form2[7]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="十一月">
              <el-date-picker
                v-model="form2[11]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四月">
              <el-date-picker
                v-model="form2[4]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="八月">
              <el-date-picker
                v-model="form2[8]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="十二月">
              <el-date-picker
                v-model="form2[12]"
                value-format="yyyy-MM-dd"
                placeholder
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { taskAdd, taskModify } from "@/api/quality";
import dictSelect from "@/components/common/dictSelect";

export default {
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        taskName: "",
        year: "",
        defaultDay: "",
        productValue: "",
        monthTasks: [],
        type: 2,
      },
      formRules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
      },
      form2: {},
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    form2: {
      deep: true,
      handler(val) {
        let arr = [];
        let x;
        for (x in val) {
          if (val[x] != null) {
            arr.push({
              month: x,
              dueDate: val[x],
            });
          }
        }
        this.form.monthTasks = arr;
      },
    },
  },
  created() {},
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else this.doModify();
        }
      });
    },
    doAdd() {
      taskAdd(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      taskModify(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        taskName: "",
        year: "",
        defaultDay: "",
        productValue: "",
        monthTasks: [],
        type: 2,
      };
      this.form2 = {};
    },
    dictChange(val) {
      this.form.productValue = val;
    },
  },
};
</script>


<style lang="scss" scoped>

.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
