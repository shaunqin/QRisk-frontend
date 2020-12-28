<template>
  <div>
    <div class="head-container"></div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column prop="no" label="编号" width="130" />
      <el-table-column label="标题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.filePath">{{row.title}}</span>
          <el-link
            v-else
            type="primary"
            size="mini"
            :href="pdfUrl(row)"
            target="_blank"
          >{{row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="deptPathCn" label="下发部门" />
      <el-table-column label="拟制人">
        <template slot-scope="{row}">{{row.issueName}}[{{row.issuer}}]</template>
      </el-table-column>
      <el-table-column label="发布日期" width="100">
        <template slot-scope="{row}">{{formatShortDate(row.createTime)}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="detail(row)">详情</el-button>
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
    <edetail ref="detail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { formatShortDate } from "@/utils/datetime";
import edetail from "../detail";
import { riskControlDetail } from "@/api/risk";
export default {
  components: { edetail },
  mixins: [initData],
  data() {
    return {
      selections: []
    };
  },
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
    formatShortDate,
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    add() {
      this.isAdd = true;
      let _this = this.$refs.form;
      _this.form.assType = this.assessmentType;
      _this.form.type = "1"; // 通知
      _this.dialog = true;
    },
    detail(row) {
      this.loading = true;
      riskControlDetail(row.id).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.detail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      });
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.filePath}`
    }
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  margin-bottom: 10px;
}
</style>