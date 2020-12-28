<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
    v-loading="dialogLoading"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-form ref="form" :model="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">{{form.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{form.issuerName}}[{{form.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围">{{form.applyScope}}</el-form-item>
      <el-form-item label="主题">{{form.title}}</el-form-item>
      <el-form-item label="背景">
        <htmlContent :html="form.background" />
      </el-form-item>
      <el-form-item label="安全风险">
        <htmlContent :html="form.existingRisk" />
      </el-form-item>
      <el-form-item label="风险防范" v-if="form.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in form.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="下发措施" v-if="form.firstLevelMeasure!=null">
        <el-table
          :data="form.firstLevelMeasure"
          size="mini"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          lazy
          :load="loadTree"
        >
          <el-table-column label="下发部门" prop="deptName" width="160" align="left"  />
          <el-table-column label="截止日期" width="100">
            <template slot-scope="{row}">{{row.data.deadline}}</template>
          </el-table-column>
          <el-table-column label="措施内容" min-width="150">
            <template slot-scope="{row}">{{row.data.content}}</template>
          </el-table-column>
          <el-table-column label="落实情况" min-width="200" align="left">
            <template slot-scope="{row}">
              <span style="white-space: pre-wrap;">{{row.data.impl}}</span>
            </template>
          </el-table-column>
          <el-table-column label="上报人" width="120" prop="filler" />
          <el-table-column label="附件预览" min-width="120">
            <template slot-scope="{row}">
              <div v-for="(item, index) in row.data.files" :key="index">
                <el-link
                  type="primary"
                  v-if="item!=null"
                  :href="getUrl(item.filePath)"
                  target="_blank"
                >{{item.originFileName}}</el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="{row}">
              <span v-if="row.status==0">待填</span>
              <span v-if="row.status==1">待填</span>
              <span v-if="row.status==2">待审核</span>
              <span v-if="row.status==3">通过</span>
              <span v-if="row.status==4">驳回</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="primary" @click="cancel">取消</el-button>
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeDetail } from "@/api/risk";
import childMeasures from './childMeasures'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
import transactor from '@/components/common/transactor'
import { riskNoticeLazyLoadIssueTree } from "@/api/risk";
export default {
  components: { childMeasures, leaderApprvalRecord, htmlContent, transactor },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogLoading: false,
      form: {},
    };
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    noticeComments() {
      if (this.form.noticeComments) {
        return this.form.noticeComments;
      }
      return []
    },
  },
  methods: {
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    loadTree(tree, treeNode, resolve) {
      console.log(tree);
      riskNoticeLazyLoadIssueTree(tree.id).then(res => {
        resolve(res.obj)
      })
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

