<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="安全隐患统计表"
    custom-class="big_dialog"
    v-loading="loading"
  >
    <h1 class="headTitle">安全生产隐患排查情况统计表</h1>
    <div class="headTime">{{ title }}</div>
    <el-form size="mini" inline>
      <el-form-item label="填报单位/部门：">
        <department
          class="mini"
          :value="queryForm.deptPath"
          @change="deptChange"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="doExport">导出</el-button>
      </el-form-item>
    </el-form>
    <!--表格渲染-->
    <el-table :data="data" size="small" style="width: 100%">
      <el-table-column label="排查治理隐患单位" prop="year"></el-table-column>
      <el-table-column label="一般隐患" label-class-name="noborder">
        <el-table-column label>
          <el-table-column label="排查一般隐患">
            <el-table-column label="(项)">
              <template slot-scope="{ row }">
                <el-input v-model="row.generalHiddenDanger" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="其中:已整改">
            <el-table-column label="(项)">
              <template slot-scope="{ row }">
                <el-input v-if="row.rectifiedAmount != null" v-model="row.rectifiedAmount" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="整改率">
            <el-table-column label="(%)" width="100">
              <template slot-scope="{ row }">
                <el-input v-if="row.generalRate != null" v-model="row.generalRate" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="重大隐患">
        <el-table-column label="排查治理重大隐患">
          <el-table-column label="排查重大隐患">
            <el-table-column label="(项)">
              <template slot-scope="{ row }">
                <el-input v-model="row.majorHiddenDangers" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="其中:已整改">
            <el-table-column label="(项)">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.majorRectifiedAmount != null"
                  v-model="row.majorRectifiedAmount"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="整改率">
            <el-table-column label="(%)" width="100">
              <template slot-scope="{ row }">
                <el-input v-if="row.majorRate != null" v-model="row.majorRate" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其中:列入治理计划的重大事故隐患">
          <el-table-column label="列入治理计划的重大隐患">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.governancePlanIncluded != null"
                  v-model="row.governancePlanIncluded"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理目标任务">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfGoals != null"
                  v-model="row.implOfGoals"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理经费物资">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfFunding != null"
                  v-model="row.implOfFunding"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理机构人员">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfInstStaff != null"
                  v-model="row.implOfInstStaff"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实治理时间">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfTime != null"
                  v-model="row.implOfTime"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="落实安全措施应急预案">
            <el-table-column label="(项)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfEmergPlan != null"
                  v-model="row.implOfEmergPlan"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="累计落实治理资金">
            <el-table-column label="(万元)" width="120">
              <template slot-scope="{ row }">
                <el-input-number
                  size="mini"
                  v-if="row.implOfFundingTotal != null"
                  v-model="row.implOfFundingTotal"
                  placeholder
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-form size="small" inline class="mt">
      <el-form-item label="到期隐患数量">
        <el-input v-model="result.numOfDue" disabled></el-input>
      </el-form-item>
      <el-form-item label="到期未整改数量">
        <el-input v-model="result.numOfUnrectified" disabled></el-input>
      </el-form-item>
      <el-form-item label="未按期关闭隐患率">
        <el-input v-model="result.rateOfUnclose" disabled></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit" v-if="editEnable">修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getStatistics, updateStatistics } from "@/api/hazards";
import department from "@/components/Department";
export default {
  components: {
    department,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      result: {
        numOfDue: "",
        numOfUnrectified: "",
        rateOfUnclosed: "",
      },
      year: "",
      queryForm: {
        deptPath: "000003",
        type: "",
        id: "",
      },
      data: [],
      title: "",
      form: {},
    };
  },
  watch: {
    queryForm: {
      deep: true,
      handler(form) {
        if (form.id)
          this.loadStatistics();
      },
    },
  },
  computed: {
    editEnable() {
      return this.$store.getters.monthReportEnable;
    }
  },
  methods: {
    loadStatistics() {
      this.loading = true;
      getStatistics(this.queryForm).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          // this.form = res.obj;
          const { obj } = res;
          let data = [];
          data.push({
            year: obj.year,
            // 一半隐患
            generalHiddenDanger: this.formatStr(obj.generalHiddenDanger),
            rectifiedAmount: this.formatStr(obj.rectifiedAmount),
            generalRate: this.formatStr(obj.generalRate),
            // 排查治理重大隐患
            majorHiddenDangers: this.formatStr(obj.majorHiddenDangers),
            majorRectifiedAmount: this.formatStr(obj.majorRectifiedAmount),
            majorRate: this.formatStr(obj.majorRate),
            // 重大事故隐患
            governancePlanIncluded: this.formatStr(obj.governancePlanIncluded),
            implOfGoals: this.formatStr(obj.implOfGoals),
            implOfFunding: this.formatStr(obj.implOfFunding),
            implOfInstStaff: this.formatStr(obj.implOfInstStaff),
            implOfTime: this.formatStr(obj.implOfTime),
            implOfEmergPlan: this.formatStr(obj.implOfEmergPlan),
            implOfFundingTotal: this.formatStr(obj.implOfFundingTotal),
          });
          // 上一年
          data.push({
            year: `${obj.year - 1}年遗留未整改`,
            generalHiddenDanger: this.formatStr(obj.lastYearGeneral),
            majorHiddenDangers: this.formatStr(obj.lastYearGeneral),
          });
          // 上2年
          data.push({
            year: `${obj.year - 2}年遗留未整改`,
            generalHiddenDanger: this.formatStr(obj.last2YearGeneral),
            majorHiddenDangers: this.formatStr(obj.last2YearMajor),
          });
          this.data = data;
          this.result = {
            numOfDue: obj.numOfDue,
            numOfUnrectified: obj.numOfUnrectified,
            rateOfUnclose: obj.rateOfUnclose + "%",
          };
          this.title = `(${obj.year}年1月1日 -- ${obj.curMonth}月${obj.curDays}日)`;
          this.form.id = obj.id;
        }
      });
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      if (this.data.length > 0) {
        let row = this.data[0];
        this.form.governancePlanIncluded = row.governancePlanIncluded;
        this.form.implOfGoals = row.implOfGoals;
        this.form.implOfFunding = row.implOfFunding;
        this.form.implOfInstStaff = row.implOfInstStaff;
        this.form.implOfTime = row.implOfTime;
        this.form.implOfEmergPlan = row.implOfEmergPlan;
        this.form.implOfFundingTotal = row.implOfFundingTotal;
        console.log(this.form);
        this.loading = true;
        updateStatistics(this.form).then((res) => {
          this.loading = false;
          if (res.code != "200") {
            this.$message.error(res.msg);
          } else {
            this.$message.success("修改成功!");
          }
        });
      } else {
        this.$message("无数据")
      }
    },
    resetForm() {
      this.dialog = false;
      this.form = {};
      this.queryForm = {
        deptPath: "000003",
        type: "",
        id: "",
      };
      this.data = [];
    },
    deptChange(val) {
      this.queryForm.deptPath = val;
    },
    formatStr(str) {
      return str != null ? str : "";
    },
    doExport() {
      const qs = require("qs");
      let url = `${process.env.VUE_APP_BASE_API}/riskmgr_mgr/hidden_danger/exportStatistics?${qs.stringify(this.queryForm)}`;
      location.href = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.headTitle {
  text-align: center;
}
.headTime {
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
}
/deep/ .el-dialog__body {
  padding-top: 0;
}
/deep/ .noborder {
  border-bottom: none;
  position: relative;
  overflow: visible;
  &.cell {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1;
    transform: translateY(-50%);
  }
}
.mt {
  margin-top: 10px;
}
/deep/ .vue-treeselect--append-to-body {
  z-index: 100 !important;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #000;
}
/deep/ .el-input-number {
  width: 100%;
}
</style>
