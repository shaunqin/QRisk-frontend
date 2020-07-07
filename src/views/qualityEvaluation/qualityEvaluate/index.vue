<template>
  <div class="app-container">
    <div class="head-container">
      <el-form :model="queryForm" label-width="auto" inline size="mini">
        <el-form-item label="日期">
          <el-date-picker v-model="queryForm.aa" placeholder style="width:130px"></el-date-picker>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="queryForm.bb" placeholder style="width:130px">
            <el-option :label="'请选择部门'" :value="'请选择部门'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="queryForm.cc" placeholder style="width:130px">
            <el-option v-for="item in menu1" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标">
          <el-select v-model="queryForm.dd" placeholder style="width:130px">
            <el-option v-for="item in menu2" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button
            class="filter-item"
            type="success"
            icon="el-icon-search"
            @click="toQuery(queryForm)"
          >搜索</el-button>
          <el-link
            class="filter-item"
            type="success"
            icon="el-icon-download"
            href="#/test"
            target="_blank"
            style="margin-left: 10px;"
          >生成国航文件</el-link>
          <el-link
            class="filter-item"
            type="success"
            icon="el-icon-download"
            href="/asssts/files/质量事件调查万时率.xlsx"
            target="_blank"
            style="margin-left: 10px;"
          >生成客户文件</el-link>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="data"
          size="small"
          :stripe="true"
          :highlight-current-row="true"
          style="width: 100%;"
          @selection-change="selectionChange"
        >
          <!-- <el-table-column type="index" width="50" /> -->
          <el-table-column prop="nn" label width="90" />
          <el-table-column label="国航机队">
            <el-table-column label="全月定检出厂飞机第一个航班不正常数量之和" prop="aa" />
            <el-table-column label="全月出厂飞机总计划工时" prop="bb" />
            <el-table-column prop="cc" label="定检出厂首班机械原因不正常万时率‱" />
          </el-table-column>
          <el-table-column label="客户机队">
            <el-table-column label="全月定检出厂飞机第一个航班不正常数量之和" prop="dd" />
            <el-table-column label="全月出厂飞机总计划工时" prop="ee" />
            <el-table-column prop="ff" label="定检出厂首班机械原因不正常万时率‱" />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <eform ref="form" :is-add="isAdd"></eform>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import { qualityEvaluate } from "@/dataSource";
export default {
  components: { eform },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      queryForm: {
        aa: "",
        bb: "",
        cc: "",
        dd: ""
      },
      menu1: ["定检产品", "发动机APU产品", "附件产品", "航线产品"],
      menu2: [
        "出厂检发现问题万时率",
        "定检出厂首班机械原因不正常万时率",
        "定检出场一周机械原因不正常万时率",
        "客户满意度调查平均值",
        "客户质量投诉",
        "质量事件调查万时率"
      ]
    };
  },
  mounted() {
    this.loading = false;
    this.data = [
      {
        nn: "一月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "二月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "三月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "四月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "五月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "六月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "七月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "八月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "九月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "十月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "十一月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "十二月",
        aa: "2",
        bb: "132189.00",
        cc: "0.15",
        dd: "1",
        ee: "102724.70",
        ff: "0.10"
      },
      {
        nn: "一至十二月",
        aa: "23",
        bb: "1132189.00",
        cc: "0.15",
        dd: "1",
        ee: "1102724.70",
        ff: "0.10"
      }
    ];
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
// .head-container {
//   margin-bottom: 20px;
// }
</style>