
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
      <el-table-column prop="remark" label="内容" />
      <el-table-column label="创建时间">
        <template slot-scope="{row}">{{format(row.createTime)}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
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
    <commentDetail ref="commentDetail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format, formatShortDate } from "@/utils/datetime";
import { rejectDetail } from '@/api/process';
import commentDetail from '../commentDetail'
export default {
  components: { commentDetail },
  mixins: [initData],
  mounted() {
    this.init();
  },
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
  methods: {
    format,
    formatShortDate,
    beforeInit() {
      this.url = `/process/query/rejectHistory/${this.page}/${this.size}`;
      this.params = { formName: "hidden_danger_control", ...this.queryForm };
      return true;
    },
    detail(row) {
      this.loading = true;
      rejectDetail(row.id).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.commentDetail;
          _this.form = res.obj;
          _this.dialog = true;
        }
      }).catch(() => {
        this.loading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>