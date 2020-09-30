<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="安全隐患管控清单"
    custom-class="big_dialog"
  >
    <!--表格渲染-->
    <el-table :data="data" size="small" style="width: 100%" max-height="400px">
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="隐患名称" width="120px" />
      <el-table-column prop="bb" label="发现时间" width="120px" />
      <el-table-column prop="cc" label="来源" width="120px" />
      <el-table-column prop="dd" label="等级" width="120px" />
      <el-table-column prop="ee" label="主体单位" width="120px" />
      <el-table-column prop="ff" label="涉及业务" width="120px" />
      <el-table-column prop="gg" label="涉及流程" width="120px" />
      <el-table-column prop="hh" label="监管单位" width="120px" />
      <el-table-column prop="ii" label="原因分析" width="120px" />
      <el-table-column prop="jj" label="等效措施" width="150px">
        <template slot-scope="{ row }">
          <ul class="tab-ul">
            <li v-for="item in row.jj" :key="item">{{ item }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="kk" label="责任人" width="120px" />
      <el-table-column prop="ll" label="整改时限" width="120px" />
      <el-table-column prop="mm" label="验证标准" width="120px" />
      <el-table-column prop="nn" label="措施实施情况跟踪" width="140px" />
      <el-table-column prop="oo" label="治理结果情况跟踪" width="140px" />
      <el-table-column prop="pp" label="整改进展" width="120px" />
      <el-table-column prop="qq" label="备注" width="120px" />
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
    <eform ref="form" />
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import eform from "./form";

export default {
  components: { eform },
  data() {
    return {
      loading: false,
      dialog: false,
      data: [],
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
        jj: [
          "措施1措施1措施1",
          "措施2措施2措施2",
          "措施3措施3措施3",
          "措施4措施4措施4",
        ],
        kk: "admin",
        ll: "3",
        mm: "符合规范",
        nn: "跟踪状态",
        oo: "跟踪状态",
        pp: "待完成",
        qq: "备注信息",
      },
    ];
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
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0];
      }
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        let obj = {
          id: "",
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    },
    edit(row) {
      let _this = this.$refs.form;
      _this.dialog = true;
    },
  },
};
</script>


<style lang="scss" scope>
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
}
</style>
