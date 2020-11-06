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
      <el-table-column prop="no" label="编号" width="120" />
      <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="noteContent" label="通知内容" min-width="150" show-overflow-tooltip />
      <el-table-column prop="issueDept" label="下发部门" />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.staffno}}]</template>
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
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "../form";
import {
  specialRiskDetail,
  specialRiskDelete,
  specialRiskSubmit,
} from "@/api/risk";
export default {
  components: { eform },
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
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/draft/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
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
      specialRiskDetail(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = {
            id: obj.id,
            title: obj.title,
            endTime: obj.endTime,
            noteContent: obj.noteContent,
            issueDept: obj.issueDept,
            assType: obj.assType,
            analysisTitle: obj.analysisTitle,
            analysisNo: obj.analysisNo,
            analysisDept: obj.analysisDept,
            analysis: obj.analysis,
            approval: obj.approval,
            approvalDate: obj.approvalDate,
            type: obj.type,
            specialRiskAnalyses: obj.specialRiskAnalyses || []
          };
          _this.dialog = true;
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
      let id = this.selections[0];
      specialRiskSubmit(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.init();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>