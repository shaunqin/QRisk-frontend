<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '反馈'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">
            <el-input v-model="form.jj" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟制人">
            <el-input v-model="form.ff" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止时间">
            <el-input v-model="form.gg" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="适用单位">
            <el-input v-model="form.ee" style="width: 400px" />
          </el-form-item>
          <el-form-item label="主题" prop="aa">
            <el-input v-model="form.aa" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="背景" prop="bb">
            <el-input v-model="form.bb" style="width: 100%;" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item label="存在的安全风险" prop="aa">
            <el-input v-model="form.cc" style="width: 100%;" type="textarea" rows="4" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isAdd">
        <el-col :span="24">
          <el-form-item label="风险防范措施" prop="dd">
            <el-row v-for="(item,index) in riskList" :key="index" style="margin-bottom: 10px;">
              <el-col :span="6" style="padding-right:10px">
                <el-select v-model="item.aa" placeholder="责任单位">
                  <el-option label="责任单位" value="责任单位"></el-option>
                </el-select>
              </el-col>
              <el-col :span="15" style="padding-right:10px">
                <el-input v-model="item.bb" style="width: 100%;" />
              </el-col>
              <el-col :span="2" :offset="1">
                <i class="el-icon-delete"></i>
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
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <el-form-item label="风险防范建议">
            <el-table :data="data" size="mini" style="width: 100%;">
              <!-- <el-table-column label="责任单位" prop="aa" width="100px" /> -->
              <el-table-column label="安全建议" prop="bb" align="left" width="400px" />
              <el-table-column label="风险防范措施">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.dd" placeholder="请输入风险防范措施" type="textarea" rows="4"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="责任单位">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ee" placeholder="请输入责任单位" type="textarea" rows="4"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="过多期限">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ff" placeholder="请输入过多期限" type="textarea" rows="4"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="反馈">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cc" placeholder="请输入反馈内容" type="textarea" rows="4"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                  <el-button type="text" @click="upload(scope.row)">上传</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="是否同意">
            <el-radio-group v-model="form.hh">
              <el-radio label="1">同意</el-radio>
              <el-radio label="0">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">提交</el-button>
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
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  created() {
    this.data = [
      {
        aa: "杭州",
        bb: `认真做好重复性故障的管控工作。各单位要高度重视飞机出现的重复性故障，加强对排故力量的组织；对于飞机运行中出现的重复、疑难故障，工程技术人员要及时研究和制定排故方案，彻底排除故障，确保飞行安全。 `
      },
      {
        aa: "上海",
        bb: `严格飞机航后和飞机定检维修质量。维修人员要严格按工作单卡执行飞机航后检查工作，及时发现并处理飞机故障，严把飞机放行关；飞机执行定检工作中，应切实提高飞机定检质量，确保飞机投入运行后安全可靠。  `
      },
      {
        aa: "武汉",
        bb: `A320S 飞行机组操作手册（FCOM）的操作程序中提出，高温天气可能导致飞机机翼气源管道周围过热被探测，容易触发左/右机翼气源渗漏警告（AIR L/R WING LEAK） `
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
        ee: "",
        ff: "",
        gg: ""
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
/deep/ .big_dialog {
  width: 1100px;
}
</style>

