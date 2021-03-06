<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">
            {{data.no}}
            <el-link
              type="primary"
              v-if="data.pdf"
              :href="getUrl(data.pdf.filePath)"
              target="_blank"
              size="mini"
            >查看PDF</el-link>
          </el-form-item>
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
      <el-form-item label="风险防范" v-if="data.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in data.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="风险防范" v-if="deptMeasure.length>0">
        <el-table :data="deptMeasure" size="mini">
          <el-table-column label="截止日期" prop="deadline" />
          <el-table-column label="措施内容" prop="content" />
          <el-table-column label="落实情况" min-width="200" align="left">
            <template slot-scope="{row}">
              <span style="white-space: break-spaces;" v-html="row.implementStatus"></span>
            </template>
          </el-table-column>
          <el-table-column label="填报人">
            <template slot-scope="{row}">
              <span v-if="row.fillerName">{{row.fillerName}}[{{row.filler}}]</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="预览附件" min-width="120">
            <template slot-scope="{row}">
              <div v-for="(item, index) in row.accessory" :key="index">
                <el-link
                  type="primary"
                  v-if="item!=null"
                  :href="getUrl(item.filePath)"
                  target="_blank"
                >{{item.originFileName}}</el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="办理人" width="80">
            <template slot-scope="{row}">
              <div v-if="row.reviewerInfo==null">-</div>
              <el-popover v-else placement="left">
                <el-button type="text" slot="reference">详情</el-button>
                <transactor :data="row.reviewerInfo" />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="已下发措施" v-if="childMeasures.length>0">
        <childMeasures :data="childMeasures" key="childMeasures" />
      </el-form-item>
      <el-form-item label="处理记录" v-if="measureComment.length>0">
        <leaderApprvalRecord key="measureComment" :data="measureComment" type="safety_measures" />
      </el-form-item>
      <el-form-item label="处理记录" v-if="noticeComments.length>0">
        <leaderApprvalRecord
          key="leaderApprvalRecord"
          :data="noticeComments"
          type="safety_risk_notice"
        />
      </el-form-item>
      <el-form-item key="reviewerInfo" label="办理人" v-if="reviewerInfo.length>0">
        <transactor :data="reviewerInfo" width="100%" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import childMeasures from '@/views/safetyRiskPrompt/components/childMeasures';
import leaderApprvalRecord from '@/views/safetyRiskPrompt/components/leaderApprvalRecord';
import transactor from '@/components/common/transactor'
import htmlContent from '@/components/common/htmlContent'
export default {
  components: { childMeasures, leaderApprvalRecord, transactor, htmlContent },
  props: ["data"],
  computed: {
    deptMeasure() {
      if (this.data.deptMeasure) {
        return [this.data.deptMeasure]
      }
      return []
    },
    measureComment() {
      if (this.data.deptMeasure && this.data.deptMeasure.measureComment) {
        return this.data.deptMeasure.measureComment;
      }
      return []
    },
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      }
      return []
    },
    childMeasures() {
      if (this.data.childMeasures) {
        return this.data.childMeasures;
      }
      return []
    },
    reviewerInfo() {
      if (this.data.reviewerInfo) {
        return this.data.reviewerInfo;
      }
      return []
    }
  },
  methods: {
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
  }
}
</script>

<style lang="scss" scoped>
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>