<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号" prop="no">
            <el-input v-model="form.no" style="width: 100%" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isAdd">
          <el-form-item label="发起单位">
            <el-select v-model="form.deptPath">
              <el-option
                v-for="item in deptList"
                :key="item.deptPath"
                :label="item.deptNameCn"
                :value="item.deptPath"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主题" prop="title">
            <el-input v-model="form.title" style="width: 100%" />
          </el-form-item>
          <el-form-item label="背景" prop="background">
            <editer ref="background" v-model="form.background" v-if="dialog" />
          </el-form-item>
          <el-form-item label="存在的安全风险" prop="existingRisk">
            <editer ref="existingRisk" v-model="form.existingRisk" v-if="dialog" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="风险防范措施" prop="measures">
        <el-card v-for="(item, index) in form.measures" :key="index" style="margin-bottom: 10px">
          <div>
            <department
              :value="!item.deptPath ? [] : item.deptPath.split(',')"
              @change="deptChange($event, item)"
              :multiple="true"
              style="line-height: 20px"
              :deptPath="form.deptPath"
            />
          </div>
          <div style="display: flex; margin-top: 10px">
            <div style="flex: 1">
              <el-input
                v-model="item.content"
                style="width: 100%"
                placeholder="措施内容"
                type="textarea"
                rows="3"
              />
            </div>
            <div style="width: 180px; margin: 0 10px">
              <el-date-picker
                v-model="item.deadline"
                value-format="yyyy-MM-dd"
                placeholder="为空则是长期选项"
                style="width: 100%"
                :picker-options="{disabledDate:date=>date.getTime() < Date.now() - 8.64e7}"
              ></el-date-picker>
            </div>
            <div style="width: 110px; margin-right: 10px">
              <el-input-number v-model="item.sort" style="width: 100%"></el-input-number>
            </div>
            <div style="width: 55px">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRisk(index)"></el-button>
            </div>
          </div>
        </el-card>
        <el-row style="margin-top: 10px">
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              style="width: 100%; border-style: dashed"
              @click="addRisk"
            >添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="附件">
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
      </el-form-item>
    </el-form>
    <selectEmplotee :deptPath="form.deptPath" ref="selectEmplotee" @on-submit="doSubmit" />
    <div slot="footer" class="dialog-footer">
      <el-link
        v-if="form.pdf&&form.pdf.filePath"
        :href="getUrl(form.pdf.filePath)"
        target="_blank"
        type="primary"
        :underline="false"
      >
        查看PDF
        <i class="el-icon-view el-icon--right"></i>
      </el-link>
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="save_loading" type="success" @click="doSave">暂存</el-button>
      <el-button :loading="loading" type="primary" @click="handleEmp">{{needLeader?'提交':'下发'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeAdd, riskNoticeModify, riskNoticeSaveandSubmit, riskNoticeUpdateandSubmit, getRiskNoticeNo, needSubmit2Leader } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
import selectEmplotee from "./selectEmplotee";
import editer from "@/components/Tinymce";
import eupload from "@/components/Upload/index";
export default {
  components: { department, selectEmplotee, editer, eupload },
  data() {
    return {
      loading: false,
      save_loading: false,
      dialog: false,
      form: {
        no: "",
        title: "",
        background: "",
        existingRisk: "",
        measures: [],
        deptPath: '',
        accId: []
      },
      roleSelect: [],
      formRules: {
        no: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        title: [{ required: true, message: "主题不能为空", trigger: "blur" }],
        background: [{ required: true, message: "背景不能为空", trigger: "blur" }],
        existingRisk: [{ required: true, message: "存在的安全风险不能为空", trigger: "blur" },],
        measures: [{ required: true, message: "风险防范措施不能为空", trigger: "blur" },],
      },
      deptList: [],
      needLeader: true, // 是否需要领导,提交/下发
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
  watch: {
    "form.deptPath"(val) {
      getRiskNoticeNo(val).then(res => {
        this.form.no = res.obj;
      })
      needSubmit2Leader(val).then(res => {
        this.needLeader = !!res.obj;
      })
    },
    files(val) {
      if (val && val.length > 0) this.form.accId = val.map((r) => r.id);
      else this.form.accId = [];
    },
  },
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          if (this.isAdd) {
            riskNoticeAdd(this.form).then((res) => {
              if (res.code === "200") {
                this.form.id = res.obj;
                this.$message.success("添加成功");
                this.save_loading = false;
                this.$parent.init();
              } else {
                this.$message.error(res.msg);
                this.save_loading = false;
              }
            });
          } else {
            riskNoticeModify(this.form).then((res) => {
              if (res.code === "200") {
                this.$message.success("保存成功");
                this.save_loading = false;
                this.$parent.init();
              } else {
                this.$message.error(res.msg);
                this.save_loading = false;
              }
            });
          }
        }
      });
    },
    handleEmp() {
      if (this.needLeader) {
        let _this = this.$refs.selectEmplotee;
        _this.dialog = true;
      } else {
        this.doSubmit("");
      }
    },
    doSubmit(sqlUserId) {
      if (this.isAdd) {
        this.saveAndSubmit(sqlUserId);
      } else {
        this.updateAndSubmit(sqlUserId);
      }
    },
    saveAndSubmit(sqlUserId) {
      this.loading = true;
      riskNoticeSaveandSubmit({ ...this.form, sqlUserId }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.resetForm();
          this.$parent.init();
        }
        this.loading = false;
      });
    },
    updateAndSubmit(sqlUserId) {
      this.loading = true;
      riskNoticeUpdateandSubmit({ ...this.form, sqlUserId }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.resetForm();
          this.$parent.init();
        }
        this.loading = false;
      });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        no: "",
        title: "",
        background: "",
        existingRisk: "",
        measures: [],
        deptPath: '',
        accId: []
      };
      this.files = [];
    },
    addRisk() {
      this.form.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
        sort: 0
      });
    },
    delRisk(index) {
      this.form.measures.splice(index, 1);
      console.log(this.form.measures);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
    editerChange(val, key) {
      this.form[key] = val;
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
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
.file-table {
  margin-top: 10px;
}
</style>
