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
      <el-table-column prop="no" label="编号" width="140" />
      <el-table-column label="标题" min-width="140" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link v-if="assessmentType=='1' || assessmentType=='3'" :type="row.pdfUrl?'primary':'info'" target="_blank" :href="row.pdfUrl?baseUrl+row.pdfUrl:null">{{row.title}}</el-link>
          <el-button v-else type="text" size="mini" @click="detail(row)">{{row.title}}</el-button>
        </template>
      </el-table-column>
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
      <el-table-column key="detail" label width="100" fixed="right" v-if="assessmentType=='1' || assessmentType=='3'">
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
    <edetail ref="detail" :showChildNotes="true" :showChildMeasures="true" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import edetail from "../detail";
import { specialRiskDetail } from "@/api/risk";
import { formatShortDate } from "@/utils/datetime";
export default {
  components: { edetail },
  mixins: [initData],
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
    };
  },
  mounted() {
    this.init();
  },
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
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/myIssued/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      this.params.assType = this.assessmentType
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      specialRiskDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
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
            _this.assessmentType = this.assessmentType
            _this.dialog = true;
          }
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`
    }
  },
};
</script>

<style lang="scss" scoped>
</style>