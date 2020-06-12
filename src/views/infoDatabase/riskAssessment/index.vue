<template>
  <div class="app-container">
    <div class="head-container">
      <h3>数据筛选</h3>
      <el-form :model="form" :inline="true">
        <el-form-item label="责任单位:">
          <el-select size="mini" style="width:120px" v-model="form.aa" placeholder="请选择责任单位">
            <el-option label="北京基地" value="北京基地"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择产品:">
          <el-select size="mini" style="width:120px" v-model="form.bb" placeholder="请选择产品">
            <el-option label="发送机/APU" value="发送机/APU"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择系统:">
          <el-select size="mini" style="width:120px" v-model="form.cc" placeholder="请选择系统">
            <el-option label="计量检测" value="计量检测"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危险源分类:">
          <el-select size="mini" style="width:120px" v-model="form.dd" placeholder="请选择危险源分类">
            <el-option label="管理文件" value="管理文件"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危险源:">
          <el-select size="mini" style="width:150px" v-model="form.ee" placeholder="请选择危险源">
            <el-option label="程序编写存在缺陷" value="程序编写存在缺陷"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <h3 class="mt-0">分析数据</h3>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="标题" />
      <el-table-column prop="bb" label="发生时间" width="100" />
      <el-table-column prop="cc" label="责任单位" />
      <el-table-column prop="ff" label="产品" />
      <el-table-column prop="gg" label="系统" />
      <el-table-column prop="ii" label="危险源分类一" width="110" />
      <el-table-column prop="jj" label="危险源分类二" width="110" />
      <el-table-column prop="kk" label="危险源" />
      <el-table-column prop="ll" label="风险" />
      <el-table-column prop="mm" label="诱因" />
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
</template>

<script>
import initData from "@/mixins/initData";
import { infoDatabase } from "@/dataSource";
export default {
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      form: {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: ""
      }
    };
  },
  mounted() {
    this.loading = false;
    this.data = [
      {
        aa: "航安任务",
        bb: "2019/06/09",
        cc: "上海浦东",
        ff: "具体原因描述",
        gg: "运管部",
        hh: "动机/APU",
        ii: "外部检查",
        jj: "管理文件",
        kk: "工作程序",
        ll: "程序编写存在缺陷",
        mm: "程序编写存在缺陷",
        nn: "未构成差错不安全事件",
        oo: ""
      }
    ];
  },
  watch: {
    form: {
      deep: true, //  对象深度验证
      handler: val => {
        console.log(val);
      }
    },
    "form.aa"(val){
      console.log(val);
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
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  // margin-bottom: 20px;
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
.mt-0 {
  margin-top: 0;
}
</style>