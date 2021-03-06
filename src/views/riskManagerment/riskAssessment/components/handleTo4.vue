<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="处理待办"
    custom-class="big_dialog"
  >
    <el-card header="危险源">
      <el-table :data="data.hazardVoList" size="mini">
        <el-table-column label="系统" prop="productName" />
        <el-table-column label="子系统" prop="subSystemName" />
        <el-table-column label="可能性" prop="possibilityName" />
        <el-table-column label="严重性" prop="seriousnessName" />
        <el-table-column label="风险等级" prop="riskLevelName" />
        <el-table-column label="管理流程" prop="managementProcess" />
        <el-table-column label="问题描述" prop="hazardSource" />
        <el-table-column label="根原因分析" prop="rootCauseAnalysis" width="140" show-overflow-tooltip />
        <el-table-column
          label="可能导致的风险"
          prop="possibleRisksName"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column label="风险控制措施" width="160" show-overflow-tooltip>
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
        <el-table-column label="落实情况" width="160" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                <el-popover trigger="hover" v-if="true" placement="top">
                  <span>{{item.completion}}</span>
                  <div class="text" slot="reference">{{item.completion}}</div>
                </el-popover>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="风险控制状态" width="160" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                <span v-if="item.measureStatus=='0'">不适用</span>
                <span v-if="item.measureStatus=='1'">未控制</span>
                <span v-if="item.measureStatus=='2'">在控</span>
                <span v-if="item.measureStatus=='3'">关闭</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          label="风险完成期限"
          width="160"
          show-overflow-tooltip
          v-if="this.data.assType != '4'"
        >
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
import { specialRiskComplete } from '@/api/risk'
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
      specialRiskComplete({ ...this.form, ...params }).then(async (res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          this.resetForm()
          if (this.source == 'smart') {
            await this.$parent.$parent.$parent.$parent.$parent.$parent.speciaRisk()
          } else {

            if (this.data.assType == '4') {
              // 更新父级危险源
              let hazardVoList = this.data.hazardVoList;
              let parentData = [...this.$parent.$parent.$parent.data.hazardVoList];
              debugger
              parentData.map((item, index) => {
                // 可能性不为空则添加
                if (!!hazardVoList[index].possibility) {
                  // 如果父级可能性没填,则覆盖
                  if (!item.possibility) {
                    item.possibility = hazardVoList[index].possibility;
                    if (hazardVoList[index].rootCauseAnalysis != null)
                      item.rootCauseAnalysis = hazardVoList[index].rootCauseAnalysis
                    item.specialRiskMeasureList = [...hazardVoList[index].specialRiskMeasureList];
                  } else {
                    if (hazardVoList[index].rootCauseAnalysis != null)
                      item.rootCauseAnalysis += "\r\n" + hazardVoList[index].rootCauseAnalysis
                    item.specialRiskMeasureList = [...item.specialRiskMeasureList, ...hazardVoList[index].specialRiskMeasureList];
                  }
                }
              })
              this.$parent.$parent.$parent.$parent.$parent.$parent.appendData = parentData;
            }
            const obj = { taskId: this.parentTaskId }
            if (this.$parent.$parent.$parent.$parent.$parent.step == 1) {
              await this.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(obj)
            } else {
              await this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(obj)
            }
          }
        }
        this.loading = false
      })
    },
    subHandle() {
      let promise = new Promise((resolve, reject) => {
        const obj = { taskId: this.parentTaskId }
        if (this.$parent.$parent.$parent.$parent.$parent.step == 1) {
          this.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(obj)
        } else {
          this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.subHandle(obj)
        }
        resolve(true);
      })
      return promise;
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

