<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
  >
    <!-- 风险 -->
        <el-form size="mini" inline label-width="70px" class="info">
          <el-form-item label="风险">
            {{ data.possibleRisksName }}
          </el-form-item>
          <el-form-item label="严重性">
            {{ data.seriousnessName }}
          </el-form-item>
          <el-form-item label="风险等级">
            {{ data.riskLevelName }}
          </el-form-item>
          <el-form-item label="部门">
            {{ data.deptName }}
          </el-form-item>
        </el-form>
        <el-table :data="data.riskControlRiskVos" size="mini">
          <!-- <el-table-column label="危险源描述" prop="hazardSource" width="200" show-overflow-tooltip />
          <el-table-column label="可能性" prop="possibilityName" width="160" />
          <el-table-column label="风险等级" prop="riskLevelName" width="160" /> -->
          <el-table-column
            label="风险控制措施"
            prop="riskMeasures"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="风险责任单位"
            prop="respDeptName"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="风险完成期限"
            prop="deadline"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="{ row }">
              <span>{{ formatShortDate(row.deadline) }}</span>
            </template> -->
          </el-table-column>
        </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { },
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