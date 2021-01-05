<template>
  <div>
    <el-form ref="form" :model="_form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" icon="el-icon-edit" @click="edit">编辑风险提示</el-button>
        </el-col>
      </el-row>
      <el-form-item label="主题">
        <span v-if="!data.pdf">{{data.title}}</span>
        <el-link
          v-else
          :href="baseUrl+data.pdf.filePath"
          target="_blank"
          type="primary"
        >{{data.title}}</el-link>
      </el-form-item>

      <el-form-item label>
        <el-radio-group v-model="_form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
        <el-input v-model="_form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="cancel"
      :visible.sync="dialog"
      :title="'编辑'"
      custom-class="big_dialog"
    >
      <el-form size="small" label-width="100px">
        <el-form-item label="背景">
          <editer ref="background" v-model="data.background" v-if="dialog" />
        </el-form-item>
        <el-form-item label="安全风险">
          <editer ref="existingRisk" v-model="data.existingRisk" v-if="dialog" />
        </el-form-item>
        <el-form-item label="风险防范措施">
          <el-card v-for="(item, index) in data.measures" :key="index" style="margin-bottom: 10px">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import department from "@/components/Department/deptByRole";
import editer from '@/components/Tinymce'
import { riskNoticeModify } from '@/api/risk'
import eupload from "@/components/Upload/index";
export default {
  components: { department, editer, eupload },
  data() {
    return {
      dialog: false,
      loading: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      files: [],
      accId: []
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
  computed: {
    _form: {
      get() {
        return this.form;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  watch: {
    files(val) {
      if (val && val.length > 0) this.accId = val.map((r) => r.id);
      else this.accId = [];
    },
  },
  mounted() {
  },
  methods: {
    addRisk() {
      this.data.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
      });
    },
    delRisk(index) {
      this.data.measures.splice(index, 1);
      console.log(this.form.measures);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
    edit() {
      this.files = this.data.files;
      this.dialog = true;
    },
    cancel() {
      this.files = [];
      this.accId = [];
      this.dialog = false;
    },
    doSubmit() {
      this.loading = true;
      let data = { ...this.data, genPdf: false, accId: this.accId };
      riskNoticeModify(data).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.cancel();
        }
      })
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
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
.file-table {
  margin-top: 10px;
}
</style>