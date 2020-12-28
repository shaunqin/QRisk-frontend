<template>
  <div>
    <div class="head-container">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-edit"
        @click="edit"
        :disabled="selections.length!=1"
      >修改</el-button>
      <el-button
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="subDelete"
        :disabled="selections.length!=1"
      >删除</el-button>
      <el-button
        size="mini"
        type="success"
        icon="el-icon-upload"
        @click="doSubmit()"
        :disabled="selections.length!=1"
      >提交</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column prop="no" label="编号" width="140" />
      <el-table-column prop="title" label="标题" min-width="140" show-overflow-tooltip />
      <el-table-column key="noteContent" v-if="assessmentType!='1' && assessmentType!='3'" prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip />
      <el-table-column prop="issueDept" key="issueDept">
        <template slot="header">
          {{assessmentType!='1' && assessmentType!='3' ?'下发单位':'单位/部门'}}
        </template>
      </el-table-column>
      <el-table-column key="issueName">
        <template slot="header">
          {{assessmentType!='1' && assessmentType!='3' ?'拟制人':'评估人'}}
        </template>
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
      </el-table-column>
      <el-table-column width="100" key="createDate">
        <template slot="header">
          {{assessmentType!='1' && assessmentType!='3' ?'发布日期':'评估日期'}}
        </template>
        <template slot-scope="{row}">{{formatShortDate(row.createDate)}}</template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <eform ref="form" :isAdd="isAdd" />
    <formSp ref="formSp" :isAdd="isAdd" />
    <selectEmplotee ref="selectEmplotee" @on-submit="doSubmit" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "../form";
import formSp from '../formSp';
import selectEmplotee from "../selectEmplotee";
import {
  specialRiskDetail,
  specialRiskDelete,
  specialRiskSubmit,
  queryRiskListMgr,
} from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { eform, selectEmplotee, formSp },
  data() {
    return {
      selections: [],
    };
  },
  mixins: [initData],
  props: ["assessmentType", "queryForm"],
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.page = 1;
        this.init();
      }
    },
    assessmentType(val) {
      this.page = 1;
      this.init()
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/draft/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = this.assessmentType
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections.map((r) => r.id);
    },
    edit() {
      this.isAdd = false;
      let id = this.selections[0];
      let _this = this.$refs.form;
      let _that = this.$refs.formSp;
      specialRiskDetail(id).then(async (res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          if(this.assessmentType == '4') {
            _that.assessmentType = this.assessmentType;
            _that.form = { ...obj }
            _that.form.endTime = formatShortDate(obj.endTime)
            _that.form.approvalDate = formatShortDate(obj.approvalDate)
            if (obj.hazardVoList && obj.hazardVoList.length > 0) {
              // _that.list = [...obj.hazardVoList]
              await _that.list.map((item, index) => {
                item.possibility = obj.hazardVoList[index].possibility
                item.rootCauseAnalysis = obj.hazardVoList[index].rootCauseAnalysis
                item.specialRiskMeasureList = obj.hazardVoList[index].specialRiskMeasureList
              })
            }
            _that.dialog = true;
            if(obj.type=='1') {
              _that.form.issueDepts = obj.issueDept.split(',')
            } else {
              _that.form.issueDepts = obj.issueDept
            }
          } else {
            _this.assessmentType = this.assessmentType;
            _this.form = {
              id: obj.id,
              title: obj.title,
              endTime: formatShortDate(obj.endTime),
              noteContent: obj.noteContent,
              identificationUnit: obj.identificationUnit,
              assType: obj.assType,
              analysisTitle: obj.analysisTitle,
              analysisNo: obj.analysisNo,
              analysisDept: obj.analysisDept,
              analysis: obj.analysis,
              approval: obj.approval,
              approvalDate: formatShortDate(obj.approvalDate),
              releasePath: obj.releasePath,
              type: obj.type
            };
            if (obj.hazardVoList && obj.hazardVoList.length > 0) {
              _this.form.hazardList = obj.hazardVoList.map(item => {
                item.specialRiskMeasureList.map(childItem => {
                  childItem.deadline = formatShortDate(childItem.deadline)
                })
                return item
              })
            } else { _this.form.hazardList = [] }
            if (obj.file && obj.file.length > 0) {
              _this.form.file = [...obj.file]
            } else { _this.form.file = [] }
            if(obj.specialRiskAnalyses &&  obj.specialRiskAnalyses.length > 0) {
              _this.form.specialRiskAnalyses = [...obj.specialRiskAnalyses]
            } else { _this.form.specialRiskAnalyses = [{
              product: "",  // 产品
              subSystem: "", // 子系统
              managementProcess: "", // 管理流程
              reponsibleUnit: null, // 责任单位
              post: "", // 岗位
              processHuman: "", // 人
              processMachine: "", // 机
              processMaterial: "", // 料
              processRegulation: "", // 法
              processEnvironment: "", // 环
              input: "", // 输入
              output: "", // 输出
            }] }
            await this.getRiskListMgr()
            if(obj.type=='1') {
              _this.form.issueDepts = obj.issueDept.split(',')
            } else {
              _this.form.issueDepts = obj.issueDept
            }
            _this.dialog = true;
          }
        }
      });
    },
    subDelete() {
      let id = this.selections[0];
      this.$confirm("确定删除嘛？")
        .then(() => {
          specialRiskDelete(id).then((res) => {
            if (res.code != "200") {
              this.$message.error(res.msg);
            } else {
              this.$message.success("删除成功");
              this.init();
            }
          });
        })
        .catch(() => { });
    },
    submit() {
      let _this = this.$refs.selectEmplotee;
      _this.id = this.selections[0];
      _this.dialog = true;
    },
    doSubmit(sqlUserId) {
      this.chooseAndSubmit(sqlUserId)
    },
    chooseAndSubmit(sqlUserId) {
      let id = this.selections[0];
      /* const params = {
        staffno: sqlUserId
      } */
      specialRiskSubmit(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.init();
        }
      });
    },
    async getRiskListMgr() {
      let _this = this.$refs.form;
      await queryRiskListMgr().then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          if(_this.form.hazardList.length == 0) {
            _this.form.hazardList.push({
              hazardSource: "",
              managementProcess: "",
              riskLevel1: "", //危险源层级1
              riskLevel2: "", //危险源层级2
              hazard: "", // 危险源
              possibility: "1",
              possibleRisks: "", // 可能导致的风险
              riskLevel: "1",
              rootCauseAnalysis: "",
              seriousness: "1",
              specialRiskMeasureList: [
                {
                  completion: "",
                  controlMeasure: "",
                  deadline: formatShortDate(null),
                  reponsibleDept: null
                }],
              subSystem: "",
              product: ""
            })
          }
          _this.form.hazardList[0].possibleRisks = res.obj[0].riskNo
          _this.possibleRisksList = res.obj
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>