<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="反馈"
    custom-class="big_dialog"
  >
    <el-button type="primary" size="mini" @click="addTable" style="margin-bottom:10px">新增一行</el-button>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" height="50vh">
      <el-table-column type="index" width="50" />
      <el-table-column label="危险源识别">
        <el-table-column label="危险源">
          <template slot-scope="scope">
            <el-input v-model="scope.row.aa" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="根原因分析">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bb" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="可能导致的风险">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cc" placeholder></el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="风险分析和评价">
        <el-table-column label="严重性等级">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dd" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="可能性等级">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ee" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="风险等级">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ff" placeholder></el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="风险控制">
        <el-table-column label="控制措施">
          <template slot-scope="scope">
            <el-input v-model="scope.row.gg" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="责任单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.hh" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="完成期限">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ii" placeholder></el-input>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initData from "@/mixins/initData";
import { add, modify } from "@/api/emplotee.js";

export default {
  mixins: [initData],
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
      entArr: []
    };
  },
  props: {},
  created() {},
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.dialog = false;
      this.$message({
        message: "反馈成功",
        type: "success"
      });
      this.resetForm();
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
      this.data = [];
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
        ll: ""
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
.big_dialog {
  width: 90%;
}
</style>
