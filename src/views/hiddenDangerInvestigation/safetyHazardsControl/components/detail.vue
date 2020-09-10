<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
  >
    <el-card header="基本信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="aa">{{form.aa}}</el-form-item>
            <el-form-item label="年度">
              {{form.dd}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号" prop="bb">
              {{form.bb}}
            </el-form-item>
            <el-form-item label="反馈日期">
              {{form.ee}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间">
              {{form.cc}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="隐患清单" style="margin-top:20px">
      <!--表格渲染-->
      <el-table :data="data" size="small" style="width: 100%;" max-height="400px">
        <el-table-column type="index" width="50" />
        <el-table-column prop="aa" label="隐患名称" />
        <el-table-column prop="bb" label="发现时间"  />
        <el-table-column prop="cc" label="来源"  />
        <el-table-column prop="dd" label="等级" />
        <el-table-column prop="ee" label="主体单位" />
        <el-table-column prop="ff" label="涉及业务" />
        <el-table-column prop="gg" label="涉及流程"/>
        <el-table-column prop="hh" label="监管单位"/>
        <el-table-column prop="ii" label="原因分析" />
        <el-table-column prop="jj" label="等效措施" />
        <el-table-column prop="kk" label="责任人" />
        <el-table-column prop="ll" label="整改时限"/>
        <el-table-column prop="mm" label="验证标准" />
        <el-table-column prop="nn" label="措施实施情况跟踪" />
        <el-table-column prop="oo" label="治理结果情况跟踪" />
        <el-table-column prop="pp" label="整改进展" />
        <el-table-column prop="qq" label="备注" />
      </el-table>
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
      data: [],
      form2: {}
    };
  },
  props: {},
  created() {
    this.data = [
      {
        aa: "方案制定存在缺陷",
        bb: "2020-02-22",
        cc: "数据分析",
        dd: "3",
        ee: "上海",
        ff: "维修",
        gg: "开发",
        hh: "上海",
        ii: "方案制定",
        jj: "重新制定",
        kk: "admin",
        ll: "3",
        mm: "符合规范",
        nn: "跟踪状态",
        oo: "跟踪状态",
        pp: "待完成",
        qq: "备注信息"
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
    addRow(e) {
      this.data.push({
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
        ff: "",
        gg: "",
        hh: "",
        ii: "",
        jj: "",
        kk: "",
        ll: "",
        mm: "",
        nn: "",
        oo: "",
        pp: "",
        qq: ""
      });
    }
  }
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
