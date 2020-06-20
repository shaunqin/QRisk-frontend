<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'审批'"
    custom-class="big_dialog"
  >
    <el-card header="详细信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="标题" prop="aa">
              <el-input v-model="form.aa" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位/部门">
              <el-input v-model="form.bb" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分析人">
              <el-input v-model="form.cc" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准">
              <el-input v-model="form.dd" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期">
              <el-input v-model="form.ee" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="风险措施" style="margin-top:20px">
      <el-table :data="data" size="mini">
        <el-table-column label="危险源" prop="aa" />
        <el-table-column label="ID" prop="bb" />
        <el-table-column label="可能性" prop="cc" />
        <el-table-column label="严重性" prop="dd" />
        <el-table-column label="可能导致的风险" prop="ee" />
        <el-table-column label="风险等级" prop="ff" />
        <el-table-column label="根原因分析" prop="gg" />
        <el-table-column label="控制措施" prop="hh" />
        <el-table-column label="责任单位" prop="ii" />
        <el-table-column label="控制状态" prop="jj" />
        <el-table-column label="完成期限" prop="kk" />
      </el-table>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">不同意</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">同意</el-button>
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
      dataString: "",
      bumen: "",
      data: []
    };
  },
  props: {
    type: {
      type: String,
      required: ""
    }
  },
  created() {
    this.data = [
      {
        aa: "飞机在运行过程中出现大翼引",
        bb: "20200201",
        cc: "大",
        dd: "高",
        ee: "飞机在运行过程中出现",
        ff: "3",
        gg: "飞机在运行过程中出现",
        hh: "飞机在运行过程中出现",
        ii: "上海",
        jj: "在控",
        kk: "待完成"
      }
    ];
  },
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

<style scoped>
</style>

<style lang="scss">
.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
