<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="formRules" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号" prop="no">
            <el-input
              v-model="detailForm.no"
              style="width: 100%;"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主题" prop="title">
            <el-input
              v-model="detailForm.title"
              style="width: 100%;"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
          <el-form-item label="背景" prop="background">
            <editer ref="background" v-model="detailForm.background" v-if="dialog" />
          </el-form-item>
          <el-form-item label="存在的安全风险" prop="existingRisk">
            <editer ref="existingRisk" v-model="detailForm.existingRisk" v-if="dialog" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="风险防范措施" class="measures">
        <el-card
          v-for="(item, index) in detailForm.measures"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div>
            <department
              :value="!item.deptPath ? [] : item.deptPath.split(',')"
              @change="deptChange($event, item)"
              :multiple="true"
              style="line-height: 20px"
              :deptPath="data.deptPath"
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
                @keyup.native="formChangeStatus"
              />
            </div>
            <div style="width: 180px; margin: 0 10px">
              <el-date-picker
                v-model="item.deadline"
                value-format="yyyy-MM-dd"
                placeholder="为空则是长期选项"
                style="width: 100%"
                @change="formChangeStatus"
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
                  :href="baseUrl+row.filePath"
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
      <el-form-item label="审批记录">
        <leaderApprvalRecord :data="data.noticeComments" type="safety_risk_notice" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { riskNoticeAdd, riskNoticeModify, riskNoticeSubmit } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
import leaderApprvalRecord from '../leaderApprvalRecord'
import editer from '@/components/Tinymce'
import eupload from "@/components/Upload/index";
export default {
  components: { department, leaderApprvalRecord, editer, eupload },
  data() {
    return {
      loading: false,
      save_loading: false,
      detailForm: {
        id: this.data.id,
        no: this.data.no,
        title: this.data.title,
        background: this.data.background,
        existingRisk: this.data.existingRisk,
        measures: this.data.measuresVos,
        accId: []
      },
      formRules: {
        no: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        title: [{ required: true, message: "主题不能为空", trigger: "blur" }],
        background: [
          { required: true, message: "背景不能为空", trigger: "blur" },
        ],
        existingRisk: [
          {
            required: true,
            message: "存在的安全风险不能为空",
            trigger: "blur",
          },
        ],
      },
      formChange: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      files: this.data.files,
    };
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
  created() { },
  computed: {
    _form: {
      get() {
        return this.form;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
    dialog() {
      return this.$parent.$parent.dialog;
    }
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        console.log(data)
        this.detailForm = {
          id: data.id,
          no: data.no,
          title: data.title,
          background: data.background,
          existingRisk: data.existingRisk,
          measures: data.measuresVos,
        };
        this.formChange = false;
        this.files = data.files;
      },
    },
    files(val) {
      if (val && val.length > 0) this.detailForm.accId = val.map((r) => r.id);
      else this.detailForm.accId = [];
    },
  },
  methods: {
    format,
    addRisk() {
      this.detailForm.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
      });
    },
    delRisk(index) {
      this.detailForm.measures.splice(index, 1);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
    formChangeStatus() {
      this.formChange = true;
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
.measures {
  /deep/ .el-form-item__content {
    padding: 0 4px;
  }
}
.file-table {
  margin-top: 10px;
}
</style>

