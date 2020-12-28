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
      <el-table-column prop="no" label="编号" />
      <el-table-column prop="title" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" />
      <el-table-column prop="createTime" label="发起时间" />
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
    <edetail ref="edetail" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import { riskControlHasDoneDetailByFormId } from '@/api/risk';
import edetail from '../doneDetail'
export default {
  components: { edetail },
  mixins: [initData],
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
    format,
    beforeInit() {
      this.url = `/riskControlManage/riskControlManage/query/queryHasDone/${this.page}/${this.size}`;
      this.params = { ...this.queryForm };
      return true;
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    detail(row) {
      this.loading = true;
      riskControlHasDoneDetailByFormId(row.id).then(res => {
        this.loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.edetail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>