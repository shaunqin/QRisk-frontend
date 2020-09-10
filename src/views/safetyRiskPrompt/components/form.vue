<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号" prop="no">
            <el-input v-model="form.no" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主题" prop="title">
            <el-input v-model="form.title" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="背景" prop="background">
            <el-input v-model="form.background" style="width: 100%;" type="textarea" rows="3" />
          </el-form-item>
          <el-form-item label="存在的安全风险" prop="existingRisk">
            <el-input v-model="form.existingRisk" style="width: 100%;" type="textarea" rows="3" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="风险防范措施">
        <el-row
          v-for="(item,index) in form.measures"
          :key="index"
          style="margin-bottom: 10px;display:flex"
          :gutter="8"
        >
          <el-col :span="6">
            <department
              :value="!item.deptPath?[]:item.deptPath.split(',')"
              @change="deptChange($event,item)"
              :multiple="true"
              :limit="1"
              :flat="true"
              style="line-height:20px"
            />
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="item.deadline"
              value-format="yyyy-MM-dd"
              placeholder="为空则是长期选项"
              style="width:100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="11">
            <el-input v-model="item.content" style="width: 100%;" placeholder="措施内容" />
          </el-col>
          <el-col :span="2">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="delRisk(index)"></el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              style="width: 100%;border-style: dashed;"
              @click="addRisk"
            >添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="info">打印</el-button>
      <el-button :loading="save_loading" type="success" @click="doSave">保存</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeAdd, riskNoticeModify, riskNoticeSubmit } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
export default {
  components: { department },
  data() {
    return {
      loading: false,
      save_loading: false,
      dialog: false,
      form: {
        no: "",
        title: "",
        background: "",
        existingRisk: "",
        measures: [],
      },
      roleSelect: [],
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
      id: "",
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  created() {},
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          if (this.isAdd && this.id == "") {
            riskNoticeAdd(this.form).then((res) => {
              if (res.code === "200") {
                this.id = res.obj;
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
    doSubmit() {
      if (this.id == "") {
        this.$message.error("请先保存!");
        return;
      }
      this.loading = true;
      riskNoticeSubmit(this.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.resetForm();
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
    addRisk() {
      this.form.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
      });
    },
    delRisk(index) {
      this.form.measures.splice(index, 1);
      console.log(this.form.measures);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

