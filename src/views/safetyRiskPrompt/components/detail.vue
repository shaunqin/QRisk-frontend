<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'详情'"
    custom-class="big_dialog"
    :fullscreen="fullscreen"
    :close-on-press-escape="!fullscreen"
    :show-close="!fullscreen"
  >
    <el-tabs v-model="tabIndex" v-loading="dialogLoading">
      <el-tab-pane label="详情" name="1">
        <el-form ref="form" :model="form" size="small" label-width="80px">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="编号">{{form.no}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="拟制人">{{form.issuerName}}[{{form.issuer}}]</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准人">{{form.approver}}</el-form-item>
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
          <el-form-item label="附件">
            <ul class="measuresVos">
              <li v-for="(item,index) in files" :key="index">
                <el-link
                  type="primary"
                  :underline="false"
                  :href="baseApi+item.filePath"
                  target="_blank"
                >{{item.originFileName}}</el-link>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="下发措施" v-if="form.firstLevelMeasure!=null">
            <childMeasures :data="form.firstLevelMeasure" :hiddenField="['状态']" :source="fullscreen?'smart':'myIssued'" />
          </el-form-item>
          <el-form-item label="处理记录" v-if="noticeComments.length>0">
            <leaderApprvalRecord
              key="leaderApprvalRecord"
              :data="noticeComments"
              type="safety_risk_notice"
            />
          </el-form-item>
          <el-form-item label="办理人" v-if="form.reviewerInfo!=null">
            <transactor :data="form.reviewerInfo" width="100%" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="2">
        <charts ref="charts" :chartData="chartData" />
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer" v-if="!fullscreen">
      <el-button type="primary" @click="cancel">取消</el-button>
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { riskNoticeDetail, riskNoticeLazyProcessChart } from "@/api/risk";
import childMeasures from './childMeasures'
import leaderApprvalRecord from './leaderApprvalRecord'
import htmlContent from '@/components/common/htmlContent'
import transactor from '@/components/common/transactor'
import charts from '@/components/Charts'
export default {
  components: { childMeasures, leaderApprvalRecord, htmlContent, transactor, charts },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogLoading: false,
      form: {},
      files: [],
      baseApi: process.env.VUE_APP_BASE_API,
      tabIndex: "1",
      chartData: {}
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
  watch: {
    tabIndex(val) {
      if (val == '2') {
        this.$refs.charts.resizeHandler();
        this.$refs.charts.chart.showLoading();
        riskNoticeLazyProcessChart(this.form.id).then(res => {
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.chartData = {
              tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
              },
              series: [
                {
                  type: 'tree',
                  data: [res.obj],
                  orient: 'TB',
                  symbolSize: 10,
                  label: {
                    position: 'top',
                    verticalAlign: 'middle',
                    align: 'center',
                    // fontSize: 9
                  },
                  leaves: {
                    label: {
                      position: 'bottom',
                      verticalAlign: 'middle',
                      align: 'center'
                    }
                  },
                  tooltip: {
                    formatter: '措施内容:{c}'
                  },
                  expandAndCollapse: false, // 节点展开
                }
              ]
            }
            this.$refs.charts.chart.hideLoading();
            this.$refs.charts.chart.on("click", (params) => {
              console.log(params);
            })
          }
        })
      }
    }
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
      this.tabIndex = "1";
      this.chartData = {};
      this.dialog = false;
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

