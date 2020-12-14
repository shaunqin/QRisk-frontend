<template>
  <div class="app-container">
    <div class="head-container">
      <el-form :model="form" label-width="auto" size="mini" inline>
        <el-form-item label="评估类型">
          <el-select v-model="form.assType" placeholder="请选择评估类型" clearable>
            <el-option label="流程/标准" value="1"></el-option>
            <el-option label="变革管理" value="2"></el-option>
            <el-option label="维修能力" value="3"></el-option>
            <el-option label="航站审定" value="4"></el-option>
            <el-option label="关键风险" value="5"></el-option>
            <el-option label="全员风险" value="6"></el-option>
            <el-option label="其他评估" value="7"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标题">
          <el-input v-model="form.analysisTitle" placeholder></el-input>
        </el-form-item> -->
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="date"
            unlink-panels
            type="daterange"
            placeholder
            value-format="yyyy-MM-dd"
            style="width:220px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="toQuery">查询</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            @click="refresh"
          >{{$t('global.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe
      @selection-change="selectionChange"
    >
      <el-table-column prop="assTypeName" label="评估类型" show-overflow-tooltip />
      <el-table-column prop="createTime" label="发布日期" width="100">
        <template slot-scope="{row}">{{formatShortDate(row.createTime)}}</template>
      </el-table-column>
      <el-table-column prop="analysisNo" label="编号" width="120" show-overflow-tooltip />
      <el-table-column label="标题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="detail(row)">{{row.analysisTitle}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="危险源" prop="hazardSourceName" width="200" show-overflow-tooltip />
      <el-table-column label="根原因分析" prop="rootCauseAnalysis" width="120" show-overflow-tooltip />
      <el-table-column label="风险等级" prop="riskLevelName" />
      <el-table-column label="可能导致的风险" prop="possibleRisksName" width="200" show-overflow-tooltip />
      <!-- <el-table-column label="控制目标" prop="controlObj" show-overflow-tooltip /> -->
      <el-table-column label="控制措施" prop="controlMeasure" show-overflow-tooltip />
      <el-table-column label="责任单位" prop="reponsibleDeptName" width="120" show-overflow-tooltip />
      <el-table-column label="完成期限" prop="deadline" width="100">
        <template slot-scope="{row}">{{formatShortDate(row.deadline)}}</template>
      </el-table-column>
      <el-table-column label="措施落实验证情况" prop="verifyMeasure" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template v-slot="{row}">
          <span v-if="row.status == '11'">在控</span>
          <span v-if="row.status == '12'">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定通知吗？"
            @onConfirm="notice(scope.row)"
          >
            <el-button size="mini" type="warning" slot="reference">通知</el-button>
          </el-popconfirm>
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
    <detail ref="detail"></detail>
  </div>
</template>

<script>
import { getEvalReport, notifyUser } from "@/api/risk"
import initData from "@/mixins/initData";
import eform from "./form";
import detail from "./components/detail";
import { formatShortDate } from '@/utils/datetime'
export default {
  components: { eform, detail },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      form: { assType: '' },
      date: ""
    };
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startTime = val[0];
        this.form.endTime = val[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/risk_mgr/riskMeasureControl_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    toQuery() {
      this.queryForm = Object.assign({}, this.form);
      this.page = 1;
      this.init();
    },
    refresh() {
      this.queryForm = {},
      this.form = { assType: '' },
      this.date = ""
      this.toQuery()
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    riskControl() {
      let _this = this.$refs.riskControl;
      _this.dialog = true;
    },
    detail(row) {
      let _this = this.$refs.detail;
      const params = {
        noteId: row.noteId
      }
      getEvalReport(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          _this.form = [...res.obj]
          _this.dialog = true
        }
      })
    },
    notice(row) {
      const params = {
        noteId: row.noteId
      }
      notifyUser(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.$message.success("通知成功！");
          this.init()
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
// .head-container {
//   margin-bottom: 20px;
// }
</style>