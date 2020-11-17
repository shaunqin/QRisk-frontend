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
        <el-button type="warning" size="mini" icon="el-icon-delete-solid" @click="subClean">清空</el-button>
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
        <el-table-column prop="content" label="系统提示" min-width="200" />
        <el-table-column prop="msg" label="自定义内容" min-width="150" show-overflow-tooltip />
        <el-table-column label="发送时间" width="160">
          <template slot-scope="{row}">
            <span>{{format(row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isRead" label="是否已读">
          <template slot-scope="{row}">
            <el-tag v-if="row.isRead=='0'" type="danger" size="mini">
              <i class="el-icon-warning">&nbsp;未读</i>
            </el-tag>
            <el-tag v-else type="success" size="mini">
              <i class="el-icon-success">&nbsp;已读</i>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接收人">
          <template slot-scope="{row}">{{`${row.receiverName}[${row.receiver}]`}}</template>
        </el-table-column>
        <el-table-column label="发送人">
          <template slot-scope="{row}">{{`${row.senderName}[${row.sender}]`}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="showDetail(row)">详情</el-button>
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
      <edetail ref="detail" :msgType="msgType" />
    </div>
  </el-scrollbar>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import { deleteBatch, clean, queryHazardList } from "@/api/message";
import edetail from './components/detail';
export default {
  components: { edetail },
  mixins: [initData],
  data() {
    return {
      selections: [],
      msgType: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    format,
    beforeInit() {
      this.url = `/notice/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.params };
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
    subClean() {
      this.$confirm("确认清空吗？")
        .then(() => {
          clean().then((res) => {
            if (res.code != "200") {
              this.$message.error(res.msg);
            } else {
              this.$message.success("清空成功");
              this.init();
            }
          });
        })
        .catch(() => { });
    },
    showDetail(row) {
      queryHazardList(row.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.msgType = res.obj.module;
          let _this = this.$refs.detail;
          _this.data = res.obj.object;
          _this.dialog = true;
          this.$nextTick(() => {
            this.init();
          })
        }
      })
    }
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