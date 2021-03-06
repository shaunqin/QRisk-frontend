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
          <el-select v-model="queryForm.month" placeholder style="width:80px;">
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
          <el-table-column v-for="(column,index) in columns" :key="column.name+index" :label="column.name" :prop="column.prop ? column.prop : null">
              <template slot-scope="{row}" v-if="column.prop=='departmentName'">
                <span>{{row[column.prop]}}<span v-if="row.fillStatus == '1'"><i class="el-icon-star-on" style="color: #13ce66"></i></span></span>
              </template>
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
import department from '@/components/Department'
import { queryDictByName } from '@/api/dict'
import { queryProductIndexCount, queryDefaultSettingMgrList, queryDefaultValue } from '@/api/quality'
import { deepClone } from '@/utils/index'
export default {
  components: { department },
  data() {
    return {
      queryForm: {
        year: new Date().getFullYear().toString(),
        month: 1,
        departmentPath: null,
        productValue: ""
      },
      prodList: [],
      loading: false,
      data: [],
      columns: [
        {"name": "维修基地", "prop": "departmentName"},
        {
          "name": "国航机队",
          "children": [
            { "name": "出厂检发现质量问题万时率", "prop": "11_0" },
            { "name": "定检出厂首班机械原因不正常万时率", "prop": "12_0" },
            { "name": "定检出厂一周机械原因不正常万时率", "prop": "13_0" },
            { "name": "质量事件调查万时率（责任单位）", "prop": "14_0" }
          ]},
        {
          "name": "客户机队","children": [
            { "name": "出厂检发现质量问题万时率", "prop": "11_1" },
            { "name": "定检出厂首班机械原因不正常万时率）", "prop": "12_1" },
            { "name": "质量事件调查万时率（责任单位）", "prop": "14_1" },
            { "name": "客户质量投诉万时率（责任单位）", "prop": "15_1" },
            { "name": "客户满意度调查平均值", "prop": "16_1" }
          ]},
        {"name": "产品质量评价指数", "prop": "productQEResult"}]
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
      let obj = {
        setObjectName: `quality_product_index_${this.queryForm.productValue}_count_title_cn`,
        type: 2
      };
      let weights = {}
      queryDefaultValue(obj).then(res => {
        if (res.code != '200') {
          this.$message.error("未配置参数");
          return false;
        } else {
          if(this.queryForm.year >= '2020' && this.queryForm.month >= 10) {
            this.columns = res.obj.map(item => {
              if(item.name == "客户机队") {
                item.children.map((childrenItem, index) => {
                  if(childrenItem.name == "客户满意度调查平均值") {
                    item.children.splice(index, '1')
                  }
                })
              }
              return item
            })
          } else {
            this.columns = [...res.obj];
          }
          return true;
        }
      }).then(data => {
        if (data) {
          const defaultObj = {
            setName: '权重',
            setObjectName: `quality_product_index_${this.queryForm.productValue}`
          }
          queryDefaultSettingMgrList(defaultObj).then(res => {
            if (res.code != '200') {
              this.$message.error(res.msg);
              return false;
            } else {
              weights.departmentName = '权重'
              res.obj.map(item => {
                const key = item.setObjectName.substring(24, item.setObjectName.indexOf('_weight'))
                weights[key] = item.setValue + '%'
              })
              return true;
            }
          }).then(data => {
            if (data) {
              this.loading = true;
              queryProductIndexCount(this.queryForm).then(res => {
                if (res.code != '200') {
                  this.$message.error(res.msg);
                } else {
                  this.data = res.obj.map(item => {
                    const dataObj = {...item, ...item.resultValues}
                    return dataObj
                  });
                  this.data.unshift(weights)
                }
                this.loading = false;
              })
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
      const param = deepClone(this.queryForm)
      param.fileType = '2'
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