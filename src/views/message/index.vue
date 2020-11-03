<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="app-container">
      <div class="head-container">
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :disabled="selections.length==0"
          @click="subDelete"
        >删除</el-button>
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
        <el-table-column type="selection" width="50" />
        <el-table-column prop="content" label="内容" min-width="200" />
        <el-table-column label="发送时间" width="160">
          <template slot-scope="{row}">
            <span>{{format(row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isRead" label="是否已读">
          <template slot-scope="{row}">
            <span v-if="row.isRead=='0'">未读</span>
            <span v-else>已读</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiver" label="接收人" />
        <el-table-column prop="sender" label="发送人" />
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
    </div>
  </el-scrollbar>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import { deleteBatch } from "@/api/message";
export default {
  components: {},
  mixins: [initData],
  data() {
    return {
      userInfo: {},
      selections: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    format,
    beforeInit() {
      this.url = `/notice/query/pageList/${this.page}/${this.size}`;
      this.params = { type: 8, ...this.params };
      return true;
    },
    selectionChange(selections) {
      this.selections = selections.map((r) => r.id);
    },
    subDelete() {
      this.$confirm("确认删除吗？")
        .then(() => {
          deleteBatch(this.selections).then((res) => {
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
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.app-container {
  margin-top: 10px;
  .head-container {
    margin-bottom: 10px;
  }
}
/deep/ .scrollbar-wrapper {
  height: calc(100vh - 60px);
}
</style>