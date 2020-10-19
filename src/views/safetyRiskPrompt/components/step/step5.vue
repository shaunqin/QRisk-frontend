<template>
  <div>
    <el-form ref="form" :model="_form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围">{{data.applyScope}}</el-form-item>
      <el-form-item label="主题">{{data.title}}</el-form-item>
      <el-form-item label="安全风险">
        <span style="white-space: pre-wrap;">{{data.existingRisk}}</span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;">{{data.background}}</span>
      </el-form-item>
      <el-form-item label="风险防范">
        <el-table :data="[data.deptMeasure]" size="mini">
          <el-table-column label="截止日期" prop="deadline" />
          <el-table-column label="措施内容" prop="content" />
          <el-table-column label="落实情况" width="200">
            <template>
              <el-input v-model="_form.comment" placeholder="请输入落实情况"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="附件" width="100">
            <template slot-scope="{row}">
              <upload :id="row.id" @success="success" />
            </template>
          </el-table-column>
          <el-table-column label="预览" min-width="120">
            <template slot-scope="{row}">
              <el-link
                type="primary"
                v-if="row.accessory!=null"
                :href="getUrl(row.accessory.filePath)"
                target="_blank"
              >{{row.accessory.originFileName}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="领导批复">
        <el-table :data="data.deptMeasure.measureComment">
          <el-table-column label="内容" prop="remark" />
          <el-table-column label="批复人">
            <template slot-scope="{row}">{{row.name}}[{{row.sqlUserId}}]</template>
          </el-table-column>
          <el-table-column label="批复时间">
            <template slot-scope="{row}">{{format(row.createTime)}}</template>
          </el-table-column>
          <el-table-column label="批复结果">
            <template slot-scope="{row}">
              <span v-if="row.processFlag=='1'">同意</span>
              <span v-else>驳回</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="cancel"
      :visible.sync="dialog"
      title="下发"
    >
      <el-form :model="hairdownForm" size="small" label-width="auto" inline>
        <el-form-item label="责任单位">
          <department style="width:540px" />
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="hairdownForm.aa" value-format="yyyy-MM-dd" placeholder></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from "../upload";
import { format } from "@/utils/datetime";
import department from "@/components/Department/deptByRole";
export default {
  components: { upload, department },
  data() {
    return {
      dialog: false,
      loading: false,
      hairdownForm: {
        pathAndDeadLines: [],
        taskId: this.form.taskId,
        id: this.data.deptMeasure.id,
      },
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
  mounted() { },
  methods: {
    format,
    success(res) {
      console.log(res);
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    doSubmit() {
      console.log(this.hairdownForm)
    }
  },
};
</script>

<style lang="scss" scoped>
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>