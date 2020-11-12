<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增通知' : '编辑通知'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="80px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="截止日期">
            <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通知内容">
            <el-input v-model="form.noteContent" style="width: 100%;" type="textarea" rows="4" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="下发部门">
            <department :value="form.issueDept" @change="deptChange($event,'issueDept')"></department>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 系统和工作分析记录表 -->
      <el-card header="系统和工作分析记录表" v-if="form.assType==1||form.assType==2">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="form.analysisTitle"></el-input>
            </el-form-item>
            <el-form-item label="分析人">
              <el-input v-model="form.analysis"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="form.analysisNo"></el-input>
            </el-form-item>
            <el-form-item label="批准">
              <el-input v-model="form.approval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <department :value="form.analysisDept" @change="deptChange($event,'analysisDept')"></department>
            </el-form-item>
            <el-form-item label="批准日期">
              <el-date-picker
                v-model="form.approvalDate"
                value-format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              class="mb-10"
              type="info"
              size="mini"
              icon="el-icon-plus"
              @click="addCol"
            >新增一行</el-button>
          </el-col>
        </el-row>
        <el-table :data="form.specialRiskAnalyses" size="mini" max-height="500">
          <el-table-column label="系统" min-width="130">
            <template slot-scope="{row}">
              <dictSelect
                type="system"
                :value="row.system"
                @change="dictChange($event,row,'system')"
              />
            </template>
          </el-table-column>
          <el-table-column label="子系统" width="130">
            <template slot-scope="{row}">
              <dictSelect
                type="system"
                :value="row.subSystem"
                @change="dictChange($event,row,'subSystem')"
              />
            </template>
          </el-table-column>
          <el-table-column label="管理流程" min-width="130">
            <template slot-scope="{row}">
              <el-input v-model="row.managementProcess" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="责任单位" min-width="200">
            <template slot-scope="{row}">
              <department :value="row.reponsibleUnit" @change="deptChangeOnTb($event,row)"></department>
            </template>
          </el-table-column>
          <el-table-column label="岗位" min-width="130">
            <template slot-scope="{row}">
              <el-input v-model="row.post" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="流程要素">
            <el-table-column label="人" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processHuman" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="机" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processMachine" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processMaterial" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="法" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processRegulation" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="环" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processEnvironment" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="流程分析">
            <el-table-column label="输入" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.input" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="输出" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.output" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label fixed="right" width="80">
            <template slot-scope="{$index}">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="delCol($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { specialRiskAdd, specialRiskModify } from "@/api/risk";
import department from "@/components/Department";
import dictSelect from '@/components/common/dictSelect'

export default {
  components: { department, dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        title: "", // 标题
        endTime: "", // 截止日期
        noteContent: "", // 通知内容
        issueDept: null, // 下发部门
        assType: "", // 评估类别
        analysisTitle: "", // 分析标题
        analysisNo: "", // 分析编号
        analysisDept: null, // 分析单位
        analysis: "", // 分析人
        approval: "", // 批准
        approvalDate: "", // 批准日期
        type: "1", // 类别,1:通知,2:评估
        specialRiskAnalyses: [
          {
            system: "",  // 系统
            subSystem: "", // 子系统
            managementProcess: "", // 管理流程
            reponsibleUnit: null, // 责任单位
            post: "", // 岗位
            processHuman: "", // 人
            processMachine: "", // 机
            processMaterial: "", // 料
            processRegulation: "", // 法
            processEnvironment: "", // 环
            input: "", // 输入
            output: "", // 输出
          }
        ],
      },
      formRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
      },
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  created() { },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd()
          } else this.doModify()
        }
      });
    },
    doAdd() {
      specialRiskAdd(this.form)
        .then(res => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.resetForm();
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    doModify() {
      specialRiskModify(this.form)
        .then(res => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.resetForm();
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        title: "", // 标题
        endTime: "", // 截止日期
        noteContent: "", // 通知内容
        issueDept: null, // 下发部门
        assType: "", // 评估类别
        analysisTitle: "", // 分析标题
        analysisNo: "", // 分析编号
        analysisDept: null, // 分析单位
        analysis: "", // 分析人
        approval: "", // 批准
        approvalDate: "", // 批准日期
        type: "1", // 类别,1:通知,2:评估
        specialRiskAnalyses: [],
      };
    },
    deptChange(val, key) {
      this.form[key] = val;
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val;
    },
    addCol() {
      this.form.specialRiskAnalyses.push({
        system: "",  // 系统
        subSystem: "", // 子系统
        managementProcess: "", // 管理流程
        reponsibleUnit: null, // 责任单位
        post: "", // 岗位
        processHuman: "", // 人
        processMachine: "", // 机
        processMaterial: "", // 料
        processRegulation: "", // 法
        processEnvironment: "", // 环
        input: "", // 输入
        output: "", // 输出
      });
    },
    delCol(index) {
      this.form.specialRiskAnalyses.splice(index, 1);
    },
    dictChange(val, row, key) {
      row[key] = val;
    }
  }
};
</script>


<style lang="scss" scope>
.mb-10 {
  margin-bottom: 10px;
}
</style>
