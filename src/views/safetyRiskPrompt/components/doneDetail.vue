<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="已办详情"
    custom-class="big_dialog"
  >
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
          <el-table-column label="经办人">
            <template slot-scope="{row}">{{row.fillerName}}[{{row.filler}}]</template>
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
              <el-popover v-else placement="left" width="1000">
                <el-button type="text" slot="reference">详情</el-button>
                <el-table :data="row.reviewerInfo">
                  <el-table-column label="任务名称" prop="taskName"></el-table-column>
                  <el-table-column label="分配人" width="135">
                    <template slot-scope="{row}">{{row.name||"-"}}</template>
                  </el-table-column>
                  <el-table-column label="角色">
                    <template slot-scope="{row}">{{row.groupName||"-"}}</template>
                  </el-table-column>
                  <el-table-column label="候选人">
                    <template slot-scope="{row}">{{row.users||"-"}}</template>
                  </el-table-column>
                </el-table>
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
      <el-form-item label="办理人" v-if="reviewerInfo.length>0">
        <el-table :data="reviewerInfo" key="reviewerInfo">
          <el-table-column label="任务名称" prop="taskName"></el-table-column>
          <el-table-column label="分配人" width="135">
            <template slot-scope="{row}">{{row.name||"-"}}</template>
          </el-table-column>
          <el-table-column label="角色">
            <template slot-scope="{row}">{{row.groupName||"-"}}</template>
          </el-table-column>
          <el-table-column label="候选人">
            <template slot-scope="{row}">{{row.users||"-"}}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { format } from '@/utils/datetime'
import childMeasures from './childMeasures'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
export default {
  components: { childMeasures, leaderApprvalRecord, htmlContent },
  data() {
    return {
      dialog: false,
      data: {}
    };
  },
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
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
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