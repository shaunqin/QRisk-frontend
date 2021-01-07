<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="{ row }">
          <el-tag type="success">{{ renderType(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="no" label="编号" width="140" />
      <!-- <el-table-column prop="name" label="流程状态" width="180">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="标题" min-width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-link
            v-if="assessmentType == '1' || assessmentType == '3'"
            :type="row.pdfUrl ? 'primary' : 'info'"
            target="_blank"
            :href="row.pdfUrl ? baseUrl + row.pdfUrl : null"
          >{{ row.title }}</el-link>
          <el-button v-else type="text" size="mini" @click="detail(row)">
            {{
            row.title
            }}
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip /> -->
      <!-- <el-table-column prop="informant" label="填报人" width="130" />
      <el-table-column label="填报时间" width="140">
        <template slot-scope="{row}">
          {{format(row.informantTime)}}
        </template>
      </el-table-column>-->
      <el-table-column prop="releasePathName" label="发起部门" width="130" />
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140">
        <template slot-scope="{ row }">{{ format(row.createTime) }}</template>
      </el-table-column>
      <el-table-column prop="issueDeptName" label="下发部门" width="130" />
      <el-table-column prop="status" label="状态" width="130">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">
            <el-tag type="warning">创建提交</el-tag>
          </span>
          <span v-if="row.status == 1">
            <el-tag type="warning">下发中</el-tag>
          </span>
          <span v-if="row.status == 2">
            <el-tag type="warning">待审批</el-tag>
          </span>
          <span v-if="row.status == 3">
            <el-tag type="warning">领导驳回</el-tag>
          </span>
          <span v-if="row.status == 4">
            <el-tag type="warning">上报中</el-tag>
          </span>
          <span v-if="row.status == 5">
            <el-tag type="warning">措施待填报</el-tag>
          </span>
          <span v-if="row.status == 6">
            <el-tag type="warning">措施下发</el-tag>
          </span>
          <span v-if="row.status == 7">
            <el-tag type="warning">措施待审核</el-tag>
          </span>
          <span v-if="row.status == 8">
            <el-tag type="warning">措施审核中</el-tag>
          </span>
          <span v-if="row.status == 9">
            <el-tag type="warning">措施驳回中</el-tag>
          </span>
          <span v-if="row.status == 10">
            <el-tag type="warning">流程结束</el-tag>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发起人" width="130">
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
      </el-table-column>
      <el-table-column prop="createDate" label="发起时间" width="140">
        <template slot-scope="{row}">
          {{format(row.createDate)}}
        </template>
      </el-table-column>-->
      <el-table-column
        label="操作"
        width="100"
        fixed="right"
        v-if="assessmentType == '1' || assessmentType == '3'"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="detail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px; text-align: right"
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
import { specialRiskHasDoneDetail } from "@/api/risk";
import edetail from "../detail";
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
        this.page = 1;
        this.init();
      },
    },
    assessmentType(val) {
      this.page = 1;
      this.init();
    },
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
      specialRiskHasDoneDetail(row.id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          if (this.assessmentType == "4") {
            _this.assessmentType = this.assessmentType;
            _this.data = { ...res.obj };
            if (res.obj.hazardVoList && res.obj.hazardVoList.length == 25) {
              _this.list.map((item, index) => {
                item.possibility = res.obj.hazardVoList[index].possibility;
                item.rootCauseAnalysis = res.obj.hazardVoList[index].rootCauseAnalysis;
                item.specialRiskMeasureList =
                  res.obj.hazardVoList[index].specialRiskMeasureList;
              });
            } else {
              _this.list = [...res.obj.hazardVoList];
            }
            _this.completionEnable = res.obj.step == 7;
            _this.dialog = true;
          } else {
            _this.data = res.obj;
            _this.data.endTime = formatShortDate(res.obj.endTime);
            _this.assessmentType = this.assessmentType;
            _this.completionEnable = res.obj.step == 7;
            _this.dialog = true;
          }
        }
      });
    },
    renderType(row) {
      let type = "";
      switch (row.type) {
        case "1":
          type = "通知";
          break;
        case "2":
          type = "评估";
          break;
        default:
          break;
      }
      return type;
    },
  },
};
</script>

<style lang="scss" scoped></style>
