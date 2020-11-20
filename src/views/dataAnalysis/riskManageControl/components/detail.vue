<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
  >
    <el-card header="详细信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="标题" prop="aa">{{form.aa}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">{{form.bb}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批准">{{form.cc}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评价单位">{{form.dd}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">{{form.ee}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主送单位">{{form.ff}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送单位">{{form.gg}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="背景描述">{{form.hh}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="风险措施" style="margin-top:20px">
      <el-form ref="riskForm" :model="riskForm" size="mini" label-width="auto">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="危险源">{{riskForm.aa}}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="严重性等级">{{riskForm.dd}}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可能性等级">{{riskForm.ee}}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="风险等级">{{riskForm.ff}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="根原因分析">{{riskForm.bb}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可能导致的风险">{{riskForm.cc}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="data" size="mini" max-height="400px">
        <el-table-column type="index" />
        <el-table-column label="控制措施" prop="aa" />
        <el-table-column label="责任单位" prop="bb" />
        <el-table-column label="完成情况" prop="dd" />
        <el-table-column label="完成期限" prop="cc" />
      </el-table>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: ""
      },
      riskForm: {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: ""
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }]
      },
      entArr: [],
      dataString: "",
      bumen: "",
      data: [
        { aa: "出现大翼引气渗漏等", bb: "上海", cc: "2020-08-07", dd: "完成" },
        { aa: "出现大翼引气渗漏等", bb: "上海", cc: "2020-08-07", dd: "完成" }
      ]
    };
  },
  props: {
    type: {
      type: String,
      required: ""
    }
  },
  created() {},
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.loading = true;
          // if (this.isAdd) {
          //   this.doAdd()
          // } else this.doModify()

          this.dialog = false;
          this.$message({
            message: "添加成功",
            type: "success"
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
          id: ""
        };
        obj.id = data[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
      add(this.form)
        .then(res => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
          this.loading = false;
        });
    },
    doModify() {
      modify(this.form)
        .then(res => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
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
        ee: ""
      };
      this.roleSelect = [];
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0];
      }
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        let obj = {
          id: ""
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    },
    addTable() {
      this.data.push({
        aa: "出现大翼引气渗漏等",
        bb: "上海",
        cc: "2020-08-07"
      });
    },
    deleteRow(row) {}
  }
};
</script>

<style lang="scss" scoped>

</style>

