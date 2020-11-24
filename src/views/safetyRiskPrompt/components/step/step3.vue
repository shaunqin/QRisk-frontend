<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
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
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.existingRisk"></span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.background"></span>
      </el-form-item>
      <el-form-item label="风险防范">
        <el-table :data="deptMeasure" size="mini">
          <el-table-column label="截止日期" prop="deadline" width="100" />
          <el-table-column label="措施内容" prop="content" width="200" show-overflow-tooltip />
          <el-table-column label="落实情况" min-width="200">
            <template slot-scope="{row}" v-show="!!row">
              <el-input
                v-model="form.comment"
                placeholder="请输入落实情况"
                type="textarea"
                rows="3"
                :disabled="!!data.hiddenFill"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="附件" width="100" v-if="!data.hiddenFill">
            <template slot-scope="{row}">
              <upload :id="row.id" @success="success($event,row)" />
            </template>
          </el-table-column>
          <el-table-column label="预览" width="150">
            <template slot-scope="{row}" v-if="row">
              <el-link
                type="primary"
                v-show="accessory!=null"
                :href="getUrl(accessory?accessory.filePath:'')"
                target="_blank"
              >{{accessory?accessory.originFileName:''}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="已下发措施" v-if="data.childMeasures!=null">
        <childMeasures :data="data.childMeasures" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "../upload";
import childMeasures from '../childMeasures'
export default {
  components: { upload, childMeasures },
  data() {
    return {
      accessory: {},
      summary: ""
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
    deptMeasure() {
      return [{ ...this.data.deptMeasure }]
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.form.comment = val.summary;
      }
    }
  },
  created() {
    this.form.comment = this.data.summary;
  },
  methods: {
    success(res, row) {
      console.log(res);
      this.accessory = {
        filePath: res.obj.filePath,
        originFileName: res.obj.originFileName
      }
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
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