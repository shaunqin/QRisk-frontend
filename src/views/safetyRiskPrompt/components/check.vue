<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'验证'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{form.jj}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟制人">{{form.ff}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止时间">{{form.gg}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主题" prop="aa">{{form.aa}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="安全风险" prop="aa">{{form.cc}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="背景" prop="bb">{{form.bb}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="风险防范">
            <el-table :data="data" size="mini" style="width: 100%;">
              <el-table-column label="责任单位" prop="aa" width="100px" />
              <el-table-column label="风险措施" prop="bb" align="left" />
              <el-table-column label="反馈" prop="cc" />
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.dd" placeholder="请输入反馈内容" type="textarea" rows="3"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.ee">
                    <el-radio label="1">通过</el-radio>
                    <el-radio label="0">不通过</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
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
        ff: ""
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }]
      },
      data: [],
      riskList: [{ aa: "", bb: "" }]
    };
  },
  props: {
  },
  created() {
    this.data = [
      {
        aa: "杭州",
        bb: `认真做好重复性故障的管控工作。各单位要高度重视飞机出现的重复性故障，加强对排故力量的组织；对于飞机运行中出现的重复、疑难故障，工程技术人员要及时研究和制定排故方案，彻底排除故障，确保飞行安全。 `,
        cc:"反馈措施111"
      },
      {
        aa: "上海",
        bb: `严格飞机航=后和飞机定检维修质量。维修人员要严格按工作单卡执行飞机航后检查工作，及时发现并处理飞机故障，严把飞机放行关；飞机执行定检工作中，应切实提高飞机定检质量，确保飞机投入运行后安全可靠。  `,
        cc:"反馈措施111"
      },
      {
        aa: "武汉",
        bb: `A320S 飞行机组操作手册（FCOM）的操作程序中提出，高温天气可能导致飞机机翼气源管道周围过热被探测，容易触发左/右机翼气源渗漏警告（AIR L/R WING LEAK） `,
        cc:"反馈措施111"
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
      this.riskList = [];
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
    upload(row) {},
    addRisk() {
      this.riskList.push({
        aa: "",
        bb: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

