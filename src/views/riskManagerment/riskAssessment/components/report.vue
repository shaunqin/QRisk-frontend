<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="风险评价报告"
    custom-class="big_dialog"
  >
    <div style="text-align: right; margin-bottom: 5px;">
    <el-button
      class="mb"
      type="warning"
      icon="el-icon-download"
      @click="doExport()"
    >导出</el-button>
    </div>
    <el-card header="详细信息">
      <el-form class="form" size="mini" label-width="85px">
        <el-form-item label="标题">{{ form.analysisTitle }}</el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="编号">{{ form.analysisNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批准人">{{ form.approval }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">{{
              formatShortDate(form.approvalDate)
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="评价单位">
              <department
                class="mini"
                :value="form.evaluationUnit"
                @change="deptChange($event, 'evaluationUnit')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主送单位">
              <department
                class="mini"
                :value="form.distributeDept"
                @change="deptChange($event, 'distributeDept')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送单位">
              <department
                class="mini"
                :value="form.copyDept"
                @change="deptChange($event, 'copyDept')"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景描述">
          <el-input
            v-model="form.background"
            type="textarea"
            rows="5"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="风险识别">
      <el-table :data="form.specialRiskHazardVos" size="mini">
        <el-table-column label="危险源" prop="hazardName" />
        <el-table-column label="可能性等级" prop="possibilityName" />
        <el-table-column label="严重性等级" prop="seriousnessName" />
        <el-table-column label="风险等级" prop="riskLevelName" />
        <el-table-column
          label="根原因分析"
          prop="rootCauseAnalysis"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          label="可能导致的风险"
          prop="possibleRisksName"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column label="控制措施" width="160" show-overflow-tooltip>
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
        <el-table-column label="责任单位" width="160" show-overflow-tooltip>
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
        <!-- <el-table-column label="控制目标" width="160" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                {{ item.controlObj }}
              </li>
            </ul>
          </template>
        </el-table-column> -->
        <el-table-column label="完成期限" width="160" show-overflow-tooltip>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        v-if="!disabled"
        :loading="loading"
        type="primary"
        @click="doSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { specialRiskGetEvalReport, specialRiskSaveEvalReport, exportEvalReport } from '@/api/risk'
import { formatShortDate } from '@/utils/datetime'
import department from '@/components/Department'

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      disabled: false,
    }
  },
  props: {
    formId: {
      type: String,
      default: '',
    },
  },
  computed: {
    _formId: {
      get() {
        return this.formId
      },
      set(val) {
        this.$emit('change', val)
      },
    },
  },
  watch: {
    _formId(val) {
      if (val) {
        this.loadData(val)
      }
    },
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      specialRiskSaveEvalReport(this.form).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          this.resetForm()
          this.$parent.$parent.resetForm()
          this.$parent.$parent.$parent.init()
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.form = {}
      this._formId = ''
    },
    loadData(formId) {
      specialRiskGetEvalReport(formId).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this._formId = ''
          this.form = res.obj
        }
      })
    },
    deptChange(val, key) {
      this.form[key] = val
    },
    doExport() {
      this.$loading();
      exportEvalReport(this.form.id).then(res => {
        this.$loading().close();
        if (res.code != '200') {
          this.$message.error(res.obj);
        } else {
          let url = `${process.env.VUE_APP_BASE_API}${res.obj}`;
          location.href = url;
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
.form .el-form-item {
  margin-bottom: 4px;
}
</style>

