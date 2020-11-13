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
      <el-table-column prop="businessName" label="流程名称" width="200">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.businessName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" width="180">
        <template slot-scope="{row}">
          <el-tag type="warning">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTitle" label="任务标题" show-overflow-tooltip />
      <el-table-column prop="createBy" label="发起人" width="130" />
      <el-table-column prop="createTime" label="发起时间" width="140" />
      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="doFillin(row)">填报</el-button>
          <el-button type="primary" size="mini" @click="subHandle(row)">办理</el-button>
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
    <!-- 处理待办 -->
    <handle ref="handle" />
    <!-- 填报 -->
    <fillin ref="fillin" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { specialRiskFill } from "@/api/risk";
import handle from "../handle";
import fillin from '../fillinDialog';
export default {
  mixins: [initData],
  components: { handle, fillin },
  mounted() {
    this.init();
  },
  methods: {
    beforeInit() {
      this.url = `/risk_mgr/special_risk_notice_mgr/query/queryTodo/${this.page}/${this.size}`;
      return true;
    },
    subHandle(row) {
      specialRiskFill(row.taskId).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.handle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = res.obj.id;
          _this.dialog = true;
        }
      });
    },
    doFillin(row) {
      let _this = this.$refs.fillin;
      _this.dialog = true;
      specialRiskFill(row.taskId).then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          _this.data = res.obj;
          _this.form.id = res.obj.id;
          if (res.obj.hazardVoList && res.obj.hazardVoList.length > 0) {
            _this.form.hazardList = res.obj.hazardVoList;
          }
          _this.dialog = true;
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>