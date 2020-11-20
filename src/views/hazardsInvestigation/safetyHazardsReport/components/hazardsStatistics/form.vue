<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="编辑清单"
    custom-class="big_dialog"
  >
    <!--表格渲染-->
    <el-table :data="form.array" size="small" style="width: 100%">
      <el-table-column label="排查治理隐患单位" prop="year"></el-table-column>
      <el-table-column label="一般隐患" label-class-name="noborder">
        <el-table-column label>
          <el-table-column label="排查一般隐患">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.aa" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="其中:已整改">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.bb" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="整改率">
            <el-table-column label="(%)">
              <template slot-scope="{row}">
                <el-input v-model="row.cc" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="重大隐患">
        <el-table-column label="排查治理重大隐患">
          <el-table-column label="排查重大隐患">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.dd" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="其中:已整改">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.ee" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="整改率">
            <el-table-column label="(%)">
              <template slot-scope="{row}">
                <el-input v-model="row.ff" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中:列入治理计划的重大事故隐患">
          <el-table-column label="列入治理计划的重大隐患">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.gg" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理目标任务">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.hh" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理经费物资">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.ii" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理机构人员">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.jj" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理时间">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.kk" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实安全措施应急预案">
            <el-table-column label="(项)">
              <template slot-scope="{row}">
                <el-input v-model="row.ll" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="累计落实治理资金">
            <el-table-column label="(万元)">
              <template slot-scope="{row}">
                <el-input v-model="row.mm" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-form :model="form" size="small" inline class="mt">
      <el-form-item label="到期隐患数量">
        <el-input v-model="form.aa" placeholder></el-input>
      </el-form-item>
      <el-form-item label="到期未整改数量">
        <el-input v-model="form.bb" placeholder></el-input>
      </el-form-item>
      <el-form-item label="未按期关闭隐患率">
        <el-input v-model="form.cc" placeholder></el-input>
      </el-form-item>
    </el-form>

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
  created() {
    this.form.array = [
      { year: "2020年", aa: "1", bb: "", cc: "", dd: "", ee: "", ff: "", gg: "", hh: "", ii: "", jj: "", kk: "", ll: "", mm: "" },
      { year: "2019年遗留未整改", aa: "2", bb: "", cc: "", dd: "", ee: "", ff: "", gg: "", hh: "", ii: "", jj: "", kk: "", ll: "", mm: "" },
      { year: "2018年遗留未整改", aa: "3", bb: "", cc: "", dd: "", ee: "", ff: "", gg: "", hh: "", ii: "", jj: "", kk: "", ll: "", mm: "" },
    ]
  },
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
  },
};
</script>


<style lang="scss" scoped>
/deep/ .noborder {
  border-bottom: none;
  position: relative;
  overflow: visible;
  &.cell {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1;
    transform: translateY(-50%);
  }
}
.mt{
  margin-top: 10px;
}
</style>
