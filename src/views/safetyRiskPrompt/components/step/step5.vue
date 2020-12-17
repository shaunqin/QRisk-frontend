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
      <el-form-item label="背景">
        <htmlContent :html="data.background" />
      </el-form-item>
      <el-form-item label="安全风险">
        <htmlContent :html="data.existingRisk" />
      </el-form-item>
      <el-form-item label="风险防范">
        <el-table :data="[data.deptMeasure]" size="mini" key="deptMeasure">
          <el-table-column label="截止日期" prop="deadline" width="100" />
          <el-table-column label="措施内容" prop="content" width="200" show-overflow-tooltip />
          <el-table-column label="落实情况" min-width="200">
            <template>
              <el-input v-model="_form.comment" placeholder="请输入落实情况" type="textarea" rows="3"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="附件" width="100" v-if="!data.hiddenFill">
            <template slot-scope="{row}">
              <upload :id="row.id" :multiple="true" @success="success($event,row)" />
            </template>
          </el-table-column>
          <el-table-column label="预览" width="200">
            <template slot-scope="{row}" v-if="row">
              <div v-for="(item, index) in accessory" :key="index">
                <el-link
                  type="primary"
                  v-show="item!=null"
                  :href="getUrl(item?item.filePath:'')"
                  target="_blank"
                >{{item?item.originFileName:''}}</el-link>
                <el-popconfirm title="确定删除该附件吗？" @onConfirm="del(item)">
                  <i class="el-icon-delete" style="cursor: pointer;" slot="reference"></i>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="领导批复">
        <leaderApprvalRecord
          key="leaderrecord"
          :data="data.deptMeasure.measureComment"
          type="safety_measures"
        />
      </el-form-item>
      <el-form-item label="已下发措施" v-if="data.childMeasures!=null" key="childMeasures">
        <childMeasures :data="data.childMeasures" />
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
import { delUpload } from "@/api/upload"
import upload from "../upload";
import { format } from "@/utils/datetime";
import department from "@/components/Department/deptByRole";
import leaderApprvalRecord from '../leaderApprvalRecord'
import childMeasures from '../childMeasures'
import htmlContent from '@/components/common/htmlContent'
export default {
  components: { upload, department, leaderApprvalRecord, childMeasures, htmlContent },
  data() {
    return {
      dialog: false,
      loading: false,
      hairdownForm: {
        pathAndDeadLines: [],
        taskId: this.form.taskId,
        id: this.data.deptMeasure.id,
      },
      accessory: this.data.deptMeasure ? this.data.deptMeasure.accessory : [],
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
    data: {
      deep: true,
      handler(val) {
        // 重置附件
        this.accessory = this.data.deptMeasure ? this.data.deptMeasure.accessory : [];
      }
    },
  },
  mounted() { },
  methods: {
    format,
    success(res, row) {
      const data = {
        id: res.obj.id,
        filePath: res.obj.filePath,
        originFileName: res.obj.originFileName
      }
      this.accessory.push(data)
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
    },
    del(item) {
      delUpload(item.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("删除成功！");
          this.accessory.splice(this.accessory.indexOf(this.accessory.find(function (element) { return element.id === item.id; })), 1)
        }
      })
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
</style>