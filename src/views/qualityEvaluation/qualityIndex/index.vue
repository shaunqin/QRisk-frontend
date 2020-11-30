<template>
  <div class="app-container">
    <div class="head-container">
      <el-form class="query" :model="queryForm" label-width="auto" inline>
        <el-form-item label="年份">
          <el-date-picker
            :editable="false"
            :clearable="false"
            v-model="queryForm.year"
            type="year"
            value-format="yyyy"
            placeholder
            style="width:100px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="月份">
          <el-select v-model="queryForm.month" placeholder style="width:80px;" clearable>
            <el-option v-for="num in 12" :key="num" :label="num" :value="num"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <department :value="queryForm.departmentPath" @change="deptChange" style="width:180px;" />
        </el-form-item>
        <el-form-item label="产品">
          <el-select
            v-model="queryForm.productValue"
            placeholder
            style="width:160px"
          >
            <el-option
              v-for="item in prodList"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否国航" v-if="queryForm.productValue == '1' || queryForm.productValue == '4'">
          <el-select
            v-model="queryForm.type"
            placeholder
            style="width:160px"
          >
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery(queryForm)" :loading="subLoading">{{ subLoading ? "搜索中" : "搜索"}}</el-button>
          <el-button type="text" icon="el-icon-download" @click="download">生成文件</el-button>
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
        >
          <el-table-column label width="120">
            <template slot-scope="{row}">{{renderTbCol(row)}}</template>
          </el-table-column>
          <el-table-column v-for="(column,index) in columns" :key="index" :label="column.name">
            <el-table-column
              v-for="(item,iindex) in column.children"
              :key="iindex"
              :label="item.name"
              :prop="item.prop"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import department from '@/components/Department';
import { queryDictByName } from '@/api/dict'
import { queryProductIndexList, queryDefaultValue } from '@/api/quality'
export default {
  components: { department },
  data() {
    return {
      queryForm: {
        year: new Date().getFullYear().toString(),
        departmentPath: null,
        productValue: ""
      },
      prodList: [],
      subLoading: false,
      loading: false,
      data: [],
      columns: [
        {
          "name": "定检产品质量评价指数",
          "children": [
            {"name":"北京基地OB","prop":"000003000003"},
            {"name":"成都分公司OW","prop":"000003000006"},
            {"name":"华北中心LN","prop":"000003000001"},
            {"name":"西南航线中心LW","prop":"000003000014"},
            {"name":"重庆分公司LWY","prop":"000003000014000008"},
            {"name":"杭州分公司LSH","prop":"000003000024"},
            {"name":"天津分公司LNJ","prop":"000003000001000014"},
            {"name":"上海分公司LSS","prop":"000003000025"},
            {"name":"呼和浩特分公司LNH","prop":"000003000001000012"},
            {"name":"武汉分公司WUH","prop":"000003000027"},
            {"name":"贵阳分公司LWG","prop":"000003000014000004"},
            {"name":"公司总共","prop":"total"},
            {"name":"公司平均","prop":"average"}]
        }]
    };
  },
  /* computed: {
    indexList() {
      if (this.queryForm.productValue != "") {
        return this.prodList.find(r => r.value == this.queryForm.productValue).children;
      }
      return []
    }
  }, */
  created() {
    this.loadData();
  },
  methods: {
    toQuery(name) {
      this.subLoading = true
      let obj = {
        setObjectName: `quality_product_index_${this.queryForm.productValue}_index_title_cn`,
        type: 2
      };
      queryDefaultValue(obj).then(res => {
        if (res.code != '200') {
          this.$message.error("未配置参数");
          return false;
        } else {
          this.columns = res.obj;
          return true;
        }
      }).then(data => {
        if (data) {
          this.loading = true;
          queryProductIndexList(this.queryForm).then(res => {
            this.loading = false;
            this.subLoading = false
            if (res.code != '200') {
              this.$message.error(res.msg);
            } else {
              this.data = res.obj.map(item => {
                const obj = {...item, ...item.resultValues}
                return obj
              });
            }
          })
        }
      })

    },
    loadData() {
      queryDictByName("quality_product_index").then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.prodList = res.obj[0].children;
          // 默认值
          this.queryForm.productValue = res.obj[0].children[0].value;
        }
      })
    },
    deptChange(val) {
      this.queryForm.departmentPath = val;
    },
    renderTbCol(row) {
      if (row.departmentName) {
        return row.departmentName
      } else if (row.month) {
        let month = "";
        switch (row.month) {
          case 1: month = "一月"; break;
          case 2: month = "二月"; break;
          case 3: month = "三月"; break;
          case 4: month = "四月"; break;
          case 5: month = "五月"; break;
          case 6: month = "六月"; break;
          case 7: month = "七月"; break;
          case 8: month = "八月"; break;
          case 9: month = "九月"; break;
          case 10: month = "十月"; break;
          case 11: month = "十一月"; break;
          case 12: month = "十二月"; break;
          default: break;
        }
        return month;
      } else {
        return "一月至十二月";
      }
    },
    download() {
      const qs = require('qs')
      let params = qs.stringify(this.queryForm);
      let url = `${process.env.VUE_APP_BASE_API}/quality_mgr/downLoad/produceFile?${params}`;
      location.href = url;
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
.query {
  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>