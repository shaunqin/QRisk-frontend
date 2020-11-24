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
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.existingRisk"></span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.background"></span>
      </el-form-item>
      <el-form-item label="风险防范">
        <el-table :data="[data.deptMeasure]" size="mini">
          <el-table-column label="截止日期" prop="deadline" width="100" />
          <el-table-column label="措施内容" prop="content" width="200" show-overflow-tooltip />
          <el-table-column label="落实情况" min-width="200">
            <template slot-scope="{row}" v-if="row">
              <el-input
                v-model="_form.implementStatus"
                placeholder="请输入落实情况"
                type="textarea"
                rows="3"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="经办人" prop="implementStatus">
            <template slot-scope="{row}">{{row.fillerName}}[{{row.filler}}]</template>
          </el-table-column>
          <el-table-column label="附件" width="100">
            <template slot-scope="{row}">
              <upload :id="row.id" @success="success($event,row)" />
            </template>
          </el-table-column>
          <el-table-column label="预览附件" width="150">
            <template slot-scope="{row}">
              <el-link
                type="primary"
                v-if="accessory.filePath==null&&row.accessory!=null"
                :href="getUrl(row.accessory.filePath)"
                target="_blank"
              >{{row.accessory.originFileName}}</el-link>
              <el-link
                type="primary"
                v-show="accessory!=null"
                :href="getUrl(accessory.filePath)"
                target="_blank"
              >{{accessory.originFileName}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label>
        <el-radio-group v-model="_form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
        <el-input v-model="_form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from "../upload";
export default {
  components: { upload },
  data() {
    return {
      accessory: {}
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