<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
  >
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{ data.no }}</el-form-item>
        <el-form-item label="截止日期">{{
          formatShortDate(data.endTime)
        }}</el-form-item>
        <el-form-item :label="data.type=='1'?'下发部门':'分析单位'">{{ data.type=='1'?data.issueDeptName:data.analysisDeptName }}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.title }}</el-form-item>
            <el-form-item label="通知内容">{{ data.noteContent }}</el-form-item>
            <el-form-item label="附件">
              <span v-for="(item, index) in data.file" :key="index">
                <el-link
                  type="primary"
                  v-show="item != null"
                  :href="getUrl(item ? item.filePath : '')"
                  target="_blank"
                  >{{ item ? item.originFileName : '' }}</el-link
                >
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 风险 -->
    <el-card key="keyRiskListVoLists" header="风险">
      <el-card
        shadow="never"
        v-for="(item, index) in data.keyRiskListVoLists"
        :key="index"
        class="chead"
      >
        <div slot="header" class="clearfix">
          <span>风险{{ index + 1 }}</span>
        </div>
        <el-form size="mini" inline label-width="70px" class="info">
          <el-form-item label="可能导致的风险" label-width="125px">
            {{ item.possibleRisksName }}
          </el-form-item>
          <el-form-item label="严重性">
            {{ item.seriousnessName }}
          </el-form-item>
          <el-form-item label="风险等级">
            {{ item.riskLevelName }}
          </el-form-item>
        </el-form>
        <el-table :data="item.hazardList" size="mini">
          <el-table-column label="危险源描述" prop="hazardSource" width="200" show-overflow-tooltip />
          <el-table-column label="可能性" prop="possibilityName" width="160" />
          <el-table-column label="风险等级" prop="riskLevelName" width="160" />
          <el-table-column
            label="风险控制措施"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ item.controlMeasure }}</span>
                    <div class="text" slot="reference">
                      {{ item.controlMeasure }}
                    </div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            label="风险责任单位"
            width="160"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ item.reponsibleDeptName }}</span>
                    <div class="text" slot="reference">
                      {{ item.reponsibleDeptName }}
                    </div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            label="风险完成期限"
            width="160"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ formatShortDate(item.deadline) }}</span>
                    <div class="text" slot="reference">
                      {{ formatShortDate(item.deadline) }}
                    </div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>

    <el-card
      header="办理人"
      key="reviewerInfo"
      v-if="data.reviewerInfo && data.reviewerInfo.length > 0"
    >
      <transactor :data="data.reviewerInfo" width="100%" />
    </el-card>
    
    <el-card header="下发通知" key="childNotes" v-if="showChildNotes">
      <childNotes :data="data" :showIssueRecord="true" />
    </el-card>

    <el-card
      header="审批记录"
      key="noticeComments"
      v-if="data.noticeComments && data.noticeComments.length > 0"
    >
      <apprvalRecord :data="data.noticeComments" />
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import apprvalRecord from './apprvalRecord'
import childNotes from './childNotes'
import transactor from '@/components/common/transactor'
export default {
  components: { apprvalRecord, transactor, childNotes },
  props: {
    showChildNotes: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formId: '',
      dialog: false,
      data: {},
    }
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url
    },
  },
}
</script>

<style lang="scss" scoped>
.info {
  /deep/ .el-form-item__content {
    min-width: 200px;
  }
}
.info2 {
  /deep/ .el-form-item__content {
    min-width: 140px;
  }
}
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}

.el-card + .el-card {
  margin-top: 20px;
}
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
  margin: 0;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.chead {
  /deep/ .el-card__header {
    padding: 5px 20px;
  }
  .hslot {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>