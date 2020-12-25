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
        @click="submit"
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
      <el-table-column prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip />
      <el-table-column prop="issueDept" label="下发部门" />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
      </el-table-column>
      <el-table-column label="发布日期" width="100">
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
    <selectEmplotee ref="selectEmplotee" @on-submit="doSubmit" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "../form";
import selectEmplotee from "../selectEmplotee";
import {
  keyRiskDetail,
  keyRiskDelete,
  keyRiskSubmit,
  queryKeyRiskListMgr,
} from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { eform, selectEmplotee },
  data() {
    return {
      selections: [],
    };
  },
  mixins: [initData],
  props: ["queryForm"],
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.page = 1;
        this.init();
      }
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
      this.params.assType = '5'
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
      keyRiskDetail(id).then(async (res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = {
            id: obj.id,
            title: obj.title,
            endTime: formatShortDate(obj.endTime),
            noteContent: obj.noteContent,
            issueDept: obj.issueDept,
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
          if (res.obj.keyRiskListVoLists && res.obj.keyRiskListVoLists.length > 0) {
            _this.form.keyRiskLists = res.obj.keyRiskListVoLists.map(item => {
              item.hazardList.map(hazardItem=> {
                hazardItem.specialRiskMeasureList.map(childItem => {
                  childItem.deadline = formatShortDate(childItem.deadline)
                })
              })
              return item
            })
          } else { _this.form.keyRiskLists = [] }
          if (obj.file && obj.file.length > 0) {
            _this.form.file = [...obj.file]
          } else { _this.form.file = [] }
          await this.getRiskListMgr()
          if(obj.type=='1') {
            _this.form.issueDepts = obj.issueDept.split(',')
          } else {
            _this.form.issueDepts = obj.issueDept
          }
          console.log(_this.form)
          _this.dialog = true;
        }
      });
    },
    subDelete() {
      let id = this.selections[0];
      this.$confirm("确定删除嘛？")
        .then(() => {
          keyRiskDelete(id).then((res) => {
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
      const params = {
        staffno: sqlUserId
      }
      keyRiskSubmit(id, params).then((res) => {
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
      await queryKeyRiskListMgr().then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          if(_this.form.keyRiskLists.length == 0) {
            _this.form.keyRiskLists.push({
              possibleRisks: '',
              riskLevel: '1',
              seriousness: '1',
              appliance: '0',
              hazardList: [{
                hazardSource: '',
                possibility: '',
                riskLevel: '1',
                specialRiskMeasureList: [
                  {
                    controlMeasure: '',
                    deadline: '',
                    reponsibleDept: null,
                  },
                ],
              }],
            })
          }
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