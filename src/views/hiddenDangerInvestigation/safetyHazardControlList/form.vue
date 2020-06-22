<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增清单' : '编辑清单'"
    custom-class="big_dialog"
  >
    <el-card header="基本信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="aa">
              <el-input v-model="form.aa" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="年度">
              <el-input v-model="form.dd" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号" prop="bb">
              <el-input v-model="form.bb" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="反馈日期">
              <el-input v-model="form.ee" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间">
              <el-input v-model="form.cc" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="危险源信息" style="margin-top:20px">
      <el-form :model="form2" size="small" label-width="auto" inline>
        <el-form-item label="隐患名称">
          <el-input v-model="form2.aa" placeholder></el-input>
        </el-form-item>
         <el-form-item label="发现时间">
          <el-input v-model="form2.bb" placeholder></el-input>
        </el-form-item>
         <el-form-item label="来源">
          <el-input v-model="form2.cc" placeholder></el-input>
        </el-form-item>
         <el-form-item label="等级">
          <el-input v-model="form2.dd" placeholder></el-input>
        </el-form-item>
         <el-form-item label="主体单位">
          <el-input v-model="form2.ee" placeholder></el-input>
        </el-form-item>
         <el-form-item label="涉及业务">
          <el-input v-model="form2.ff" placeholder></el-input>
        </el-form-item>
         <el-form-item label="涉及流程">
          <el-input v-model="form2.gg" placeholder></el-input>
        </el-form-item>
         <el-form-item label="监管单位">
          <el-input v-model="form2.hh" placeholder></el-input>
        </el-form-item>
         <el-form-item label="原因分析">
          <el-input v-model="form2.ii" placeholder></el-input>
        </el-form-item>
         <el-form-item label="等效措施">
          <el-input v-model="form2.jj" placeholder></el-input>
        </el-form-item>
         <el-form-item label="责任人">
          <el-input v-model="form2.kk" placeholder></el-input>
        </el-form-item>
         <el-form-item label="整改时限">
          <el-input v-model="form2.ll" placeholder></el-input>
        </el-form-item>
         <el-form-item label="验证标准">
          <el-input v-model="form2.mm" placeholder></el-input>
        </el-form-item>
         <el-form-item label="措施实施情况跟踪">
          <el-input v-model="form2.nn" placeholder></el-input>
        </el-form-item>
         <el-form-item label="治理结果情况跟踪">
          <el-input v-model="form2.oo" placeholder></el-input>
        </el-form-item>
         <el-form-item label="整改进展">
          <el-input v-model="form2.pp" placeholder></el-input>
        </el-form-item>
         <el-form-item label="备注">
          <el-input v-model="form2.qq" placeholder></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
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
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }]
      },
      entArr: [],
      form2: {}
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
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
    roleRemove(e) {}
    // delwithRoleList() {
    //   const roleList = this.roleList
    //   const checkList = this.form.roleList
    //   let newList = []
    //   let obj = {}
    //   for (let i = 0; i < checkList.length; i++) {
    //     for (let j = 0; j < roleList.length; j++) {
    //       if (checkList[i] === roleList[j].id) {
    //         obj.id = Number(checkList[i])
    //         obj.code = roleList[j].code
    //         obj.roleDesc = roleList[j].roleDesc
    //         // obj.sn = roleList[j].sn
    //         newList.push(obj)
    //         obj = {}
    //       }
    //     }
    //   }
    //   this.form.roleList = newList
    // }
  }
};
</script>


<style lang="scss" scoped>
/deep/ .big_dialog{
  width: 1100px;
}
.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
