<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="false"
      :highlight-current-row="false"
      style="width: 100%"
      cell-class-name="detail"
      @cell-dblclick="detailCell"
    >
      <el-table-column type="index" width="50" fixed="left">
        <template slot="header">
          <span>序列</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.nameEN + index"
        :label="column.nameEN"
        :prop="column.prop ? column.prop : null"
        :fixed="column.prop ? 'left' : null"
        show-overflow-tooltip
        width="150px"
      >
        <template slot-scope="{ row }" v-if="column.prop == 'riskName'">
          <div>
            {{ row[column.prop] }}
          </div>
        </template>
        <el-table-column
          v-if="column.prop != 'riskName'"
          :key="column.children.nameCN + index"
          :label="column.children.nameCN"
          :prop="column.children.prop"
        >
          <template slot-scope="{ row }">
            <div :style="{backgroundColor: row.children2[column.children.prop]}">
              {{ row[column.children.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <detail ref="detail" :showChildNotes="false" />
  </div>
</template>
<script>
import { queryTableList, getTableData } from '@/api/risk'
import detail from '@/views/cruxRisk/notificationAndEvaluation/components/detail'
export default {
  components: {detail},
  data() {
    return {
      loading: false,
      data: [],
      columns: [],
      list: {
        headers: [{ nameEN: '' }],
      },
      form: {},
      date: '',
    }
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startTime = val[0]
        this.form.endTime = val[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
  },
  created() {
    this.toQuery()
  },
  methods: {
    toQuery() {
      this.loading = true
      queryTableList({ ...this.form }).then((res) => {
        this.list = res.obj
        this.data = res.obj.datas.map((item) => {
          item = Object.assign(item, item.children)
          res.obj.headers.map(headItem => {
            const keyArr = !!item.children2 ? Object.keys(item.children2) : []
            const bool = keyArr.includes(headItem.nameEN)
            if(!bool && headItem.nameEN!=="关键风险项目") {
              item.children2 = item.children2?item.children2:{}
              item.children2[headItem.nameEN] = '#fff'
            }
          })
          return item
        })
        this.columns = res.obj.headers
        this.loading = false
      })
    },
    detailCell(row, column, cell, event) {
      if(!row[column.property]) return this.$message.error("无数据！")
      let params = {
        riskNo: row.riskNo
      }
      this.columns.map(item => {
        if(item.nameEN == column.property) {
          params.deptPath = item.path
        }
      })
      getTableData(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          let _this = this.$refs.detail;
          _this.data = res.obj;
          _this.dialog = true;
        }
      })
    },
    refresh() {
      this.form = {}
      this.date = ''
      this.toQuery()
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-container {
  /* min-height: calc(100vh - 56px); */
  padding: 20px 0 0 20px;
  /deep/ .detail {
    padding: 0;
    height: 40px;
    &:hover {
      cursor: pointer;
    }
    .cell {
      padding: 0;
      height: 40px;
    }
    div {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>