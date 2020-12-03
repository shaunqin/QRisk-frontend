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
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.background"></span>
      </el-form-item>
      <el-form-item label="安全风险">
        <span style="white-space: pre-wrap;display: block;overflow: auto;" v-html="data.existingRisk"></span>
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
                <el-popconfirm
                  title="确定删除该附件吗？"
                  @onConfirm="del(item)"
                >
                <i class="el-icon-delete" style="cursor: pointer;" slot="reference"></i>
                </el-popconfirm>
              </div>
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
import { delUpload } from "@/api/upload"
import upload from "../upload";
export default {
  components: { upload },
  data() {
    return {
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
  mounted() { },
  methods: {
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
    del(item) {
      delUpload(item.id).then(res => {
        if(res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("删除成功！");
          this.accessory.splice(this.accessory.indexOf(this.accessory.find(function(element){ return element.id === item.id; })), 1)
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