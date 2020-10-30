<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新建任务' : '编辑任务'"
    custom-class="big_dialog"
  >
    <el-card header="基本信息">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="80px" inline>
        <el-row>
          <el-col :span="24" class="full-row">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="年度任务">
          <el-select v-model="form.taskType" placeholder style="width: 150px;" :disabled="!isAdd">
            <el-option label="年度任务" :value="1"></el-option>
            <el-option label="单次任务" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度" v-if="form.taskType==1" key="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            value-format="yyyy"
            placeholder
            style="width:100px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="默认日期" v-if="form.taskType==1" key="defaultDay">
          <el-select v-model="form.defaultDay" placeholder clearable style="width: 130px;">
            <el-option
              v-for="num in 28"
              :key="num"
              :label="'每月 '+(num<10?'0'+num:num)+' 日'"
              :value="num<10?'0'+num:num"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈日期" v-if="form.taskType==2" key="dueDate">
          <el-date-picker
            v-model="form.dueDate"
            value-format="yyyy-MM-dd"
            placeholder
            style="width:140px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="月度反馈日期设置" style="margin-top:20px" v-if="form.taskType==1">
      <el-form :model="form2" size="small" label-width="60px">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="一月">
              <el-date-picker v-model="form2['1']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="五月">
              <el-date-picker v-model="form2['5']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="九月">
              <el-date-picker v-model="form2['9']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二月">
              <el-date-picker v-model="form2['2']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="六月">
              <el-date-picker v-model="form2['6']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十月">
              <el-date-picker v-model="form2['10']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三月">
              <el-date-picker v-model="form2['3']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="七月">
              <el-date-picker v-model="form2['7']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十一月">
              <el-date-picker v-model="form2['11']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四月">
              <el-date-picker v-model="form2['4']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="八月">
              <el-date-picker v-model="form2['8']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="十二月">
              <el-date-picker v-model="form2['12']" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="单次任务部门" style="margin-top:20px" v-if="form.taskType==2">
      <department :value="form.deptPath" @change="deptChange" style="width:400px" />
    </el-card>
    <el-card header="附件上传" style="margin-top:20px">
      <eupload @success="uploadSuccess"></eupload>
      <el-table :data="files" size="mini" class="file-table">
        <el-table-column :label="$t('analysis.fileName')" prop="originFileName" />
        <el-table-column :label="$t('analysis.fileSize')">
          <template slot-scope="{row}">{{(row.fileSize/1024).toFixed(2)}}Kb</template>
        </el-table-column>
        <el-table-column :label="$t('global.operation')" width="100px">
          <template slot-scope="{row,$index}">
            <el-tooltip :content="$t('analysis.preview')" placement="left">
              <el-link
                type="primary"
                :underline="false"
                :href="baseApi+row.filePath"
                target="_blank"
              >
                <svg-icon icon-class="eye-open"></svg-icon>
              </el-link>
            </el-tooltip>&nbsp;&nbsp;
            <el-button type="text" icon="el-icon-delete" @click="delFile($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/hazards";
import eupload from "@/components/Upload/index";
import department from "@/components/Department";

export default {
  components: { eupload, department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        taskName: "",
        taskType: 1,
        accId: [],  // 附件
        dueDate: "", // 反馈日期
        year: new Date().getFullYear().toString(), // 年份
        deptPath: null,
        defaultDay: "", // 默认日期 day
      },
      formRules: {
        taskName: [{ required: true, message: "请填写任务名称", trigger: "blur" }],
      },
      form2: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '', 11: '', 12: '' },
      files: [],
      baseApi: process.env.VUE_APP_BASE_API
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  created() { },
  watch: {
    "form.defaultDay"(day) {
      this.formatDate(this.form.year, day);
    },
    "form.year"(year) {
      this.formatDate(year, this.form.defaultDay);
    },
    files(val) {
      if (val && val.length > 0) this.form.accId = val.map((r) => r.id);
      else this.form.accId = [];
    },
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd()
          } else this.doModify()
        }
      });
    },
    doAdd() {
      add({ ...this.form, dueDates: this.form2 })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success('添加成功');
            this.resetForm();
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      modify({ ...this.form, dueDates: this.form2 })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success('添加成功');
            this.resetForm();
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        taskName: "",
        taskType: 1,
        accId: "",  // 附件
        dueDate: "", // 反馈日期
        year: new Date().getFullYear().toString(), // 年份
        deptPath: null,
        defaultDay: "", // 默认日期 day
      };
      this.form2 = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '', 11: '', 12: '' };
      this.files = [];
    },
    deptChange(val) {
      this.form.deptPath = val;
    },
    formatDate(year, day) {
      if (!!year && !!day) {
        for (let m = 1; m <= 12; m++) {
          let month = m < 10 ? '0' + m : m;
          this.form2[m] = `${year}-${month}-${day}`;
        }
      }
    },
    uploadSuccess(response) {
      console.log(response);
      this.files.push(response.obj);
    },
    delFile(index) {
      this.files.splice(index, 1);
    },
  },
};
</script>


<style lang="scss" scoped>
.full-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
.file-table {
  margin-top: 10px;
}
</style>
