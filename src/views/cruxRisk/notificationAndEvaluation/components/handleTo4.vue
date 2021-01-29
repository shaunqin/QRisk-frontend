<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{ data.no }}</el-form-item>
        <el-form-item label="截止日期">
          {{
          formatShortDate(data.endTime)
          }}
        </el-form-item>
        <el-form-item
          :label="data.type=='1'?'下发部门':'分析单位'"
        >{{ data.type=='1'?data.issueDeptName:data.analysisDeptName }}</el-form-item>
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
                >{{ item ? item.originFileName : '' }}</el-link>
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
          <el-form-item label="可能导致的风险" label-width="125px">{{ item.possibleRisksName }}</el-form-item>
          <el-form-item label="严重性">{{ item.seriousnessName }}</el-form-item>
          <el-form-item label="风险等级">{{ item.riskLevelName }}</el-form-item>
          <el-form-item label="是否适用于本单位" label-width="125px">{{ item.appliance == '1' ? '否' : '是' }}</el-form-item>
        </el-form>
        <el-table :data="item.hazardList" size="mini">
          <el-table-column label="危险源描述" prop="hazardSource" width="200" show-overflow-tooltip />
          <el-table-column label="可能性" prop="possibilityName" width="160" />
          <el-table-column label="风险等级" prop="riskLevelName" width="160" />
          <el-table-column label="风险控制措施" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ item.controlMeasure }}</span>
                    <div class="text" slot="reference">{{ item.controlMeasure }}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="风险责任单位" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ item.reponsibleDeptName }}</span>
                    <div class="text" slot="reference">{{ item.reponsibleDeptName }}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="风险完成期限" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <ul class="tab-ul">
                <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                  <el-popover trigger="hover" v-if="true" placement="top">
                    <span>{{ formatShortDate(item.deadline) }}</span>
                    <div class="text" slot="reference">{{ formatShortDate(item.deadline) }}</div>
                  </el-popover>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>

    <el-card>
      <el-form ref="form" :model="form" size="small" label-width="auto">
        <el-form-item label>
          <el-radio-group v-model="form.processFlag">
            <el-radio label="1">同意</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
          <el-input v-model="form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        v-if="step == 2 || step == 6 || step == 8"
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >确认</el-button>
    </div>
    <!-- 抄送 -->
    <ccPerson ref="ccPerson" :deptPath="deptPath" @subCC="subCC" />
  </el-dialog>
</template>

<script>
import { keyRiskComplete } from '@/api/risk'
import hairdown from './hairdown'
import ccPerson from './ccPerson'
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { ccPerson },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        comment: '', // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: '1',
        implementStatus: '', // 落实情况
      },
      data: {}, // 父组件赋值
      password: '',
      parentTaskId: '',
    }
  },
  props: {
    isSecChild: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: '',
    },
  },
  computed: {
    step() {
      return this.data.step
    },
    hiddenFill() {
      return this.data.hiddenFill
    },
    deptPath() {
      return this.data.deptMeasure ? this.data.deptMeasure.deptPath : ''
    },
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm()
    },
    formChange(form) {
      this.form = form
    },
    doSubmit() {
      switch (this.step) {
        case 2:
        case 6:
        case 8:
          this.judgeCC()
          break
        default:
          break
      }
    },
    judgeCC() {
      // 领导审核同意
      if (this.data.leaderApprove && this.form.processFlag == '1') {
        this.$refs.ccPerson.dialog = true
      } else if (
        !this.data.leaderApprove &&
        this.form.processFlag == '2' &&
        this.data.cc
      ) {
        // 上级风险管理员驳回
        if (this.form.comment == '') {
          this.$message.error('请输入驳回备注！')
          return
        }
        this.$refs.ccPerson.dialog = true
      } else {
        if (this.form.processFlag == '2' && this.form.comment == '') {
          this.$message.error('请输入驳回备注！')
          return
        }
        this.subCC({})
      }
    },
    subCC(params) {
      if (this.form.processFlag == '2' && this.form.comment == '') {
        this.$message.error('请输入驳回备注！')
        return
      }
      this.loading = true
      keyRiskComplete({ ...this.form, ...params }).then(async (res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          this.resetForm()
          if (this.source == 'smart') {
            await this.$parent.$parent.$parent.$parent.$parent.$parent.keyRisk()
          } else {
            const obj = { taskId: this.parentTaskId }
            if (this.$parent.$parent.$parent.$parent.$parent.step == 1) {
              this.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(obj)
            } else {
              this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(
                obj
              )
            }
          }
        }
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.form = {
        comment: '', // 驳回备注
        taskId: 0,
        formId: 0,
        processFlag: '1',
        implementStatus: '', // 落实情况
      }
    },
    loadCount() {
      this.$parent.$parent.$parent.loadCount()
    },
  },
}
</script>

<style lang="scss" scoped>
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
.el-card + .el-card {
  margin-top: 20px;
}
</style>

