<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="下发"
  >
    <el-form :model="hairdownForm" size="small" label-width="auto">
      <el-form-item label="措施内容">
        <el-input v-model="hairdownForm.content" placeholder style="width:100%"></el-input>
      </el-form-item>
      <el-row :gutter="16" v-for="(item,index) in hairdownForm.pathAndDeadLines" :key="index">
        <el-col :span="14">
          <el-form-item label="责任单位">
            <department
              style="width:100%"
              :value="item.deptPath"
              :measureId="measureId"
              @change="deptChange($event,item)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止时间">
            <el-date-picker
              v-model="item.deadline"
              value-format="yyyy-MM-dd"
              placeholder
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="delRow(index)"></el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col :span="24">
          <el-button
            plain
            icon="el-icon-plus"
            style="width: 100%;border-style: dashed;"
            @click="addRow"
          >添加</el-button>
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
import department from "@/components/Department/deptByRole";
import { riskNoticeIssue } from '@/api/risk'
export default {
  components: { department },
  data() {
    return {
      dialog: false,
      loading: false,
      hairdownForm: {
        content: this.data.deptMeasure ? this.data.deptMeasure.content : "",
        pathAndDeadLines: [
          {
            deadline: this.data.deptMeasure ? this.data.deptMeasure.deadline : "",
            deptPath: null
          }
        ],
        taskId: this.form.taskId,
        id: this.data.deptMeasure ? this.data.deptMeasure.id : "",
      },
      measureId: this.data.deptMeasure ? this.data.deptMeasure.id : "",
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    form: {
      type: Object,
      default: () => { },
    },
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.hairdownForm = {
        content: this.data.deptMeasure ? this.data.deptMeasure.content : "",
        pathAndDeadLines: [
          {
            deadline: this.data.deptMeasure ? this.data.deptMeasure.deadline : "",
            deptPath: null
          }
        ],
        taskId: this.form.taskId,
        id: this.data.deptMeasure ? this.data.deptMeasure.id : "",
      }
    },
    doSubmit() {
      this.loading = true;
      riskNoticeIssue(this.hairdownForm).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("下发成功");
          this.resetForm();
          // 刷新父页面
          debugger
          this.$parent.$parent.$parent.subHandle(this.form);
        }
      })
    },
    deptChange(val, item) {
      item.deptPath = val;
    },
    addRow() {
      this.hairdownForm.pathAndDeadLines.push({
        deadline: this.data.deptMeasure ? this.data.deptMeasure.deadline : "",
        deptPath: null
      });
    },
    delRow(index) {
      this.hairdownForm.pathAndDeadLines.splice(index, 1);
    },
  }
}
</script>

<style lang="scss" scoped>
</style>