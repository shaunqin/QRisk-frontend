<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="编辑清单"
    custom-class="big_dialog"
  >
    <el-form ref="form" size="mini" label-width="80px" inline>
      <el-row>
        <el-col :span="24">
          <el-form-item label="隐患名称">
            <el-input v-model="form.aa" placeholder style="width: 930px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="系统编号">
        <el-input v-model="form.no" placeholder></el-input>
      </el-form-item>
      <el-form-item label="发现时间">
        <el-input v-model="form.cc" placeholder></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <el-input v-model="form.dd" placeholder></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="form.ee" placeholder></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="form.ff" placeholder></el-input>
      </el-form-item>
      <el-form-item label="主体单位">
        <el-input v-model="form.gg" placeholder></el-input>
      </el-form-item>
      <el-form-item label="涉及业务">
        <el-input v-model="form.hh" placeholder></el-input>
      </el-form-item>
      <el-form-item label="涉及流程">
        <el-input v-model="form.ii" placeholder></el-input>
      </el-form-item>
      <el-form-item label="原因分析">
        <el-input v-model="form.jj" placeholder></el-input>
      </el-form-item>
      <el-form-item label="治理效果验证标准" label-width="140px">
        <el-input v-model="form.nn" placeholder></el-input>
      </el-form-item>
      <el-form-item label="整改进展">
        <el-input v-model="form.qq" placeholder></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.rr" placeholder style="width: 500px"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="info" size="mini" style="margin-bottom: 10px" @click="addItemRow">新增一行</el-button>
    <!--表格渲染-->
    <el-table :data="form.array" size="small" style="width: 100%" max-height="400px">
      <el-table-column type="index" width="50" />
      <el-table-column prop="jj" label="等效措施">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jj" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="kk" label="责任人">
        <template slot-scope="scope">
          <el-input v-model="scope.row.kk" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="ll" label="整改时限">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ll" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="nn" label="措施实施情况跟踪">
        <template slot-scope="scope">
          <el-input v-model="scope.row.nn" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="oo" label="治理结果情况跟踪">
        <template slot-scope="scope">
          <el-input v-model="scope.row.oo" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label width="80">
        <template slot-scope="{$index}">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="delItemRow($index)"></el-button>
        </template>
      </el-table-column>
    </el-table>

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
        ee: "",
        ff: "",
        gg: "",
        hh: "",
        ii: "",
        mm: "",
        pp: "",
        qq: "",
        array: [],
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }],
      },
      entArr: [],
    };
  },
  props: {},
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
        ff: "",
        gg: "",
        hh: "",
        ii: "",
        mm: "",
        pp: "",
        qq: "",
        array: [],
      };
      this.roleSelect = [];
    },
    addItemRow() {
      this.form.array.push({
        jj: "",
        kk: "",
        ll: "",
        nn: "",
        oo: "",
      });
    },
    delItemRow(index) {
      this.form.array.splice(index, 1);
    },
    // }
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
