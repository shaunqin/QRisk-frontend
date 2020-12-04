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
        <el-col :span="8">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年份">{{`${data.year}-${data.month}`}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟制人">{{data.issueName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题">{{data.title}}</el-form-item>
      <el-form-item label="风险措施">
        <el-table :data="data.riskControlExpVoList" size="mini">
          <el-table-column label="下发单位" prop="deptPathCn" />
          <el-table-column label="风险" prop="riskName" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="填报截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.fillDeadline)}}</template>
          </el-table-column>
          <el-table-column label="落实截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.implementDeadline)}}</template>
          </el-table-column>
          <el-table-column label="填报措施" min-width="150">
            <template slot-scope="{row}">
              <span v-if="!row.riskControlRiskVoList">-</span>
              <ul class="ul-risk" v-else>
                <li v-for="item in row.riskControlRiskVoList" :key="item.id">{{item.riskMeasures}}</li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 审批记录 -->
      <el-form-item label="审批记录" key="apprvalRecord" v-if="noticeComments.length>0">
        <apprvalRecord :data="noticeComments" />
      </el-form-item>
      <!-- 下发措施 -->
      <el-form-item key="childRisk" label="下发措施" v-if="childRisk.length>0">
        <childRisk :data="childRisk" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import childRisk from './childRisk'
import apprvalRecord from './apprvalRecord'
export default {
  components: { childRisk, apprvalRecord },
  data() {
    return {
      dialog: false,
      data: {}
    };
  },
  computed: {
    childRisk() {
      if (this.data.childRiskControlExpVoList) {
        return this.data.childRiskControlExpVoList;
      }
      return []
    },
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      } else {
        return []
      }
    }
  },
  mounted() { },
  methods: {
    formatShortDate,
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
.ul-risk {
  list-style: decimal;
  text-align: left;
  margin: 0;
}
</style>