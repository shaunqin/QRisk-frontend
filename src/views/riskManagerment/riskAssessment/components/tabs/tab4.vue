<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column prop="businessName" label="流程名称" width="200">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.businessName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" width="180">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="doFillin(row)">填报</el-button>
          <el-button type="primary" size="mini" @click="subHandle(row)">办理</el-button>
        </template>
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
    <!-- 处理待办 -->
    <handle ref="handle" />
    <!-- 填报 -->
    <fillin ref="fillin" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { specialRiskFill, queryRiskListMgr } from "@/api/risk";
import handle from "../handle";
import fillin from "../fillinDialog";
import { formatShortDate } from '@/utils/datetime'
export default {
  mixins: [initData],
  components: { handle, fillin },
  props: ["queryForm"],
  mounted() {
    this.init();
  },
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.init();
      }
    }
  },
  methods: {
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/queryTodo/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    subHandle(row) {
      specialRiskFill(row.taskId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = res.obj.id;
          _this.dialog = true;
        }
      });
    },
    doFillin(row) {
      let _this = this.$refs.fillin;
      this.loading = true;
      specialRiskFill(row.taskId).then(async (res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.form.id = res.obj.id;
          _this.form.analysisTitle = res.obj.analysisTitle;
          _this.form.analysis = res.obj.analysis;
          _this.form.analysisNo = res.obj.analysisNo;
          _this.form.approval = res.obj.approval;
          _this.form.identificationUnit = res.obj.identificationUnit;
          _this.form.analysisDept = res.obj.analysisDept;
          _this.form.approvalDate = formatShortDate(res.obj.approvalDate);
          if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
            _this.form.hazardList = res.obj.hazardVoList.map(item => {
              item.specialRiskMeasureList.map(childItem => {
                childItem.deadline = formatShortDate(childItem.deadline)
              })
              return item
            })
          }
          if(res.obj.specialRiskAnalyses &&  res.obj.specialRiskAnalyses.length > 0) {
            _this.form.specialRiskAnalyses = [...res.obj.specialRiskAnalyses]
          }
          await this.getRiskListMgr()
          this.loading = false;
          _this.dialog = true;
        }
      });
    },
    async getRiskListMgr() {
      let _this = this.$refs.fillin;
      await queryRiskListMgr().then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.form.hazardList[0].possibleRisks = res.obj[0].riskNo
          _this.possibleRisksList = res.obj
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>