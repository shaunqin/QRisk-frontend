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
            @change="queryForm.indexValue=indexList[0].value"
          >
            <el-option
              v-for="item in prodList"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标">
          <el-select v-model="queryForm.indexValue" placeholder style="width:150px">
            <el-option
              v-for="item in indexList"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery(queryForm)">搜索</el-button>
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
          <el-table-column v-for="(column,index) in columns" :key="column.name+index" :label="column.name" :prop="column.prop ? column.prop : null">
              <el-table-column
                v-for="(item,iindex) in column.children"
                :key="iindex"
                :label="item.name"
                :prop="item.prop"
              />
          </el-table-column>
          <!-- <el-table-column v-for="(column,index) in columns" :key="column.name+index" :label="column.name">
            <el-table-column
              v-for="(item,iindex) in column.children"
              :key="iindex"
              :label="item.name"
              :prop="item.prop"
            />
          </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import department from '@/components/Department';
import { queryDictByName } from '@/api/dict'
import { queryIndexList, queryDefaultValue } from '@/api/quality'
import { deepClone } from '@/utils/index'
export default {
  components: { department },
  data() {
    return {
      queryForm: {
        year: new Date().getFullYear().toString(),
        departmentPath: null,
        productValue: "",
        indexValue: ""
      },
      prodList: [],
      loading: false,
      data: [],
      columns: [
        {
          "name": "国航机队",
          "children": [
            { "name": "出厂检发现问题数量", "prop": "dividend0" },
            { "name": "全月出厂飞机总计划工时", "prop": "divisor0" },
            { "name": "出厂检发现问题万时率", "prop": "result0" }]
        },
        {
          "name": "客户机队",
          "children": [
            { "name": "出厂检发现问题数量", "prop": "dividend1" },
            { "name": "全月出厂飞机总计划工时", "prop": "divisor1" },
            { "name": "出厂检发现问题万时率", "prop": "result1" }]
        }]
    };
  },
  computed: {
    indexList() {
      if (this.queryForm.productValue != "") {
        return this.prodList.find(r => r.value == this.queryForm.productValue).children;
      }
      return []
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    toQuery(name) {
      let title = ''
      const bool1 = this.queryForm.month || this.queryForm.departmentPath
      const bool2 = this.queryForm.productValue == '2' || this.queryForm.productValue == '3'
      if(bool1 && bool2) {
        title = '_new'
      } else if (!bool1 && bool2) {
        title = '_old'
      }
      let obj = {
        setObjectName: `quality_product_index_${this.queryForm.productValue}_${this.queryForm.indexValue}${title}_title_cn`,
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
          queryIndexList(this.queryForm).then(res => {
            this.loading = false;
            if (res.code != '200') {
              this.$message.error(res.msg);
            } else {
              this.data = res.obj;
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
          this.queryForm.indexValue = res.obj[0].children[0].children[0].value;
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
      const param = deepClone(this.queryForm)
      param.fileType = '0'
      const params = qs.stringify(param);
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