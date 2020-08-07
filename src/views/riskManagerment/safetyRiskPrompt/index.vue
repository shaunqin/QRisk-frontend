<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd"></eform>
    <div class="head-container">
      <el-form :model="form" size="mini" inline>
        <el-form-item label="编号">
          <el-input v-model="form.aa" placeholder="请输入编号" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="form.bb" placeholder="请输入主题" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="责任单位">
          <el-input v-model="form.cc" placeholder="请输入责任单位" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="下发单位">
          <el-input v-model="form.ee" placeholder="请输入责任单位" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="form.dd" placeholder="请输入发布时间" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery(query)">查询</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="add"
          >新建</el-button>
           <el-button type="info" icon="el-icon-document-copy" @click="copy(selections[0])" :disabled="selections.length!=1">复制</el-button>
           <el-button type="info" >输出报告</el-button>
        </el-form-item>
      </el-form>
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
      <el-table-column prop="jj" label="编号" width="110" />
      <el-table-column prop="gg" label="发布时间" width="100" />
      <el-table-column label="主题" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <a class="title" @click="detail(row)">{{row.aa}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="bb" label="背景" min-width="180" align="left" show-overflow-tooltip />
      <el-table-column prop="cc" label="安全风险" min-width="180" align="left" show-overflow-tooltip />
      <el-table-column prop="dd" label="风险防范" min-width="180" align="left" show-overflow-tooltip />
      <el-table-column prop="ee" label="责任单位" show-overflow-tooltip />
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button-group>
           
            <el-button size="mini" @click="edit(scope.row)">落实验证反馈</el-button>
            <!-- <el-button size="mini" @click="check(scope.row)">措施验证</el-button> -->
            <!-- <el-button size="mini" @click="detail(scope.row)">查看</el-button> -->
          </el-button-group>
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
    <echeck ref="check"></echeck>
    <edetail ref="detail"></edetail>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import echeck from "./components/check";
import edetail from "./components/detail";
export default {
  components: { eform, echeck, edetail },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      form: {
        aa: "",
      },
    };
  },
  mounted() {
    this.loading = false;
    for (let i = 0; i < 5; i++) {
      this.data.push({
        aa: "重复故障影响飞机安全运行的风险提示",
        bb:
          "2020 年 6 月 5 日，A321/B-1833 飞机执行 CA1948 航班，成都起 飞后地面监控出现 AIR R WING LEAK 警告信息，飞机返航…",
        cc: "飞机在运行过程中出现大翼引气渗漏等重复性故障后，存在返 航、备降…",
        dd:
          "1、认真做好重复性故障的管控工作。各单位要高度重视飞机出 现的重复性故障，加强对排故力量的组织;对于飞机运行中出现的 重复、疑难故障，工程技术人员要及时研究和制定排…",
        ee: "杭州、上海、武汉",
        jj: "SN202005050" + i,
        ff: "admin",
        gg: "2020-06-04",
        hh: "2020-06-04",
      });
    }
  },
  methods: {
    toQuery(name) {
      if (!name) {
        this.page = 1;
        this.init();
        return;
      }
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    copy(row) {
      this.isAdd = true;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    check(row) {
      let _this = this.$refs.check;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    detail(row) {
      let _this = this.$refs.detail;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
// .head-container {
//   margin-bottom: 20px;
// }
.title{
  color: #1890ff;
}
</style>