<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="{row}">
          <el-tag type="success">{{renderType(row)}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="no" label="编号" width="140" /> -->
      <el-table-column prop="name" label="流程状态" width="180">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <!-- <el-table-column prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip /> -->
      <!-- <el-table-column prop="informant" label="填报人" width="130" />
      <el-table-column label="填报时间" width="140">
        <template slot-scope="{row}">
          {{format(row.informantTime)}}
        </template>
      </el-table-column> -->
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <!-- <el-table-column label="发起人" width="130">
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
      </el-table-column>
      <el-table-column prop="createDate" label="发起时间" width="140">
        <template slot-scope="{row}">
          {{format(row.createDate)}}
        </template>
      </el-table-column> -->
      <el-table-column label width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">查看详情</el-button>
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
    <edetail ref="edetail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format, formatShortDate } from "@/utils/datetime";
import { specialRiskGasDoneDetail, specialRiskDetail } from '@/api/risk';
import edetail from '../detail'
export default {
  components: { edetail },
  mixins: [initData],
  props: ["queryForm", "assessmentType"],
  mounted() {
    this.init();
  },
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.init();
      }
    },
    assessmentType(val) {
      this.init()
    }
  },
  methods: {
    format,
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/hasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = this.assessmentType;
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      specialRiskGasDoneDetail(row.taskId, row.formId).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          if(this.assessmentType == '4') {
            _this.assessmentType = this.assessmentType;
            _this.data = { ...res.obj }
            if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
              // _this.list = [...res.obj.hazardVoList]
              _this.list.map((item, index) => {
                item.possibility = res.obj.hazardVoList[index].possibility
                item.rootCauseAnalysis = res.obj.hazardVoList[index].rootCauseAnalysis
                item.specialRiskMeasureList[0].controlMeasure = res.obj.hazardVoList[index].specialRiskMeasureList[0].controlMeasure
                item.specialRiskMeasureList[0].reponsibleDept = res.obj.hazardVoList[index].specialRiskMeasureList[0].reponsibleDept
                item.specialRiskMeasureList[0].completion = res.obj.hazardVoList[index].specialRiskMeasureList[0].completion
              })
            }
            _this.dialog = true;
          } else {
            _this.data = res.obj;
            _this.data.endTime = formatShortDate(res.obj.endTime)
            _this.assessmentType = this.assessmentType
            _this.dialog = true;
          }
        }
      })
      /* specialRiskDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          if(this.assessmentType == '4') {
            _this.assessmentType = this.assessmentType;
            _this.data = { ...res.obj }
            if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
              // _this.list = [...res.obj.hazardVoList]
              _this.list.map((item, index) => {
                item.possibility = res.obj.hazardVoList[index].possibility
                item.rootCauseAnalysis = res.obj.hazardVoList[index].rootCauseAnalysis
                item.specialRiskMeasureList[0].controlMeasure = res.obj.hazardVoList[index].specialRiskMeasureList[0].controlMeasure
                item.specialRiskMeasureList[0].reponsibleDept = res.obj.hazardVoList[index].specialRiskMeasureList[0].reponsibleDept
                item.specialRiskMeasureList[0].completion = res.obj.hazardVoList[index].specialRiskMeasureList[0].completion
              })
            }
            _this.dialog = true;
          } else {
            _this.data = res.obj;
            _this.data.endTime = formatShortDate(res.obj.endTime)
            _this.assessmentType = this.assessmentType
            _this.dialog = true;
          }
        }
      }); */
    },
    renderType(row) {
      let type = "";
      switch (row.type) {
        case '1': type = "通知"; break;
        case '2': type = "评估"; break;
        default: break;
      }
      return type;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>