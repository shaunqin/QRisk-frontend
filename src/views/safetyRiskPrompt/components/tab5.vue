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
      <el-table-column prop="title" label="主题" min-width="300" show-overflow-tooltip />
      <el-table-column prop="dept" label="部门" min-width="140" show-overflow-tooltip />
      <el-table-column prop="content" label="措施内容" min-width="300" show-overflow-tooltip />
      <el-table-column label="填报人">
        <template slot-scope="{row}">{{renderColum(row)}}</template>
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" width="120" />
      <el-table-column label="发起时间" width="140">
        <template slot-scope="{row}">{{formatShortDate(row.createTime)}}</template>
      </el-table-column>
      <el-table-column label width="100">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label width="80">
        <template slot-scope="{ row }" v-if="row.pdfUrl != null">
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
    <doneDetail ref="doneDetail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format, formatShortDate } from "@/utils/datetime";
import { riskNoticeDoneDetail } from '@/api/risk';
import doneDetail from './doneDetail'
export default {
  components: { doneDetail },
  mixins: [initData],
  mounted() {
    this.init();
  },
  props: ["queryForm"],
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
      this.url = `/riskmgr_mgr/safety_risk_notice_mgr/query/hasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    detail(row) {
      this.loading = true;
      riskNoticeDoneDetail(row.formId).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.doneDetail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
    renderColum(row) {
      if (row.filler && row.fillerName) {
        return `${row.fillerName}[${row.filler}]`
      } else if (row.filler) {
        return `${row.filler}`
      } else if (row.fillerName) {
        return `${row.fillerName}`
      } else {
        return ""
      }
    },
    pdfUrl(row) {
      return `${process.env.VUE_APP_BASE_API}${row.pdfUrl}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>