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
        @click="handleEmp"
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
      <el-table-column prop="no" label="编号" width="130" />
      <el-table-column prop="title" label="主题" min-width="150" show-overflow-tooltip />
      <!-- <el-table-column prop="background" label="背景" min-width="150" show-overflow-tooltip />
      <el-table-column prop="existingRisk" label="安全风险" min-width="150" show-overflow-tooltip /> -->
      <el-table-column prop="responseDept" label="责任单位" show-overflow-tooltip />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.issuer}}]</template>
      </el-table-column>
      <el-table-column label width="80">
        <template slot-scope="{row}" v-if="row.pdfUrl!=null">
          <el-link type="primary" :href="pdfUrl(row)" target="_blank">查看PDF</el-link>
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
    <eform ref="form" :isAdd="isAdd" />
    <selectEmplotee :deptPath="deptPath" ref="selectEmplotee" @on-submit="doSubmit" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import selectEmplotee from './selectEmplotee'
import { riskNoticeDetail, riskNoticeDelete, riskNoticeSubmit, needSubmit2Leader } from "@/api/risk";
export default {
  components: { eform, selectEmplotee },
  data() {
    return {
      selections: [],
      deptPath: "",
      needLeader: true, // 是否需要领导,提交/下发
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
  created() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/draft/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections.map((r) => r.id);
      if (selections.length > 0)
        this.deptPath = selections[0].deptPath;
    },
    edit() {
      this.isAdd = false;
      let id = this.selections[0];
      let _this = this.$refs.form;
      riskNoticeDetail(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = {
            id: obj.id,
            no: obj.no,
            title: obj.title,
            background: obj.background,
            existingRisk: obj.existingRisk,
            measures: obj.measuresVos,
            deptPath: obj.deptPath,
            pdf: obj.pdf
          };
          _this.id = obj.id;
          _this.files = res.obj.files; 
          _this.dialog = true;
        }
      });
    },
    subDelete() {
      let id = this.selections[0];
      this.$confirm("确定删除嘛？")
        .then(() => {
          riskNoticeDelete(id).then((res) => {
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
    handleEmp() {
      needSubmit2Leader(this.deptPath).then(res => {
        if (!!res.obj) {
          let _this = this.$refs.selectEmplotee;
          _this.dialog = true;
        } else {
          this.doSubmit("");
        }
      })
    },
    doSubmit(sqlUserId) {
      let id = this.selections[0];
      riskNoticeSubmit(id, { sqlUserId }).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success("提交成功");
          this.init();
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
.head-container {
  margin-bottom: 10px;
}
</style>