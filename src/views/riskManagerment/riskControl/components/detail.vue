<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'风险评价报告'"
    custom-class="big_dialog"
  >
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
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主送单位">
              <department
                class="mini"
                :value="form.distributeDept"
                @change="deptChange($event, 'distributeDept')"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送单位">
              <department
                class="mini"
                :value="form.copyDept"
                @change="deptChange($event, 'copyDept')"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景描述">
          <el-input
            v-model="form.background"
            type="textarea"
            rows="5"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <el-divider></el-divider> -->
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
                {{ item.controlMeasure }}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="责任单位" width="160" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.specialRiskMeasureList" :key="item.id">
                {{ item.reponsibleDeptName }}
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
                {{ formatShortDate(item.deadline) }}
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import department from '@/components/Department'

export default {
  components: { department },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      riskForm: {},
      roleSelect: [],
      entArr: [],
      dataString: '',
      bumen: '',
      data: [],
    }
  },
  created() {},
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      this.form = {}
    },
    deptChange(val, key) {
      this.form[key] = val;
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
</style>

