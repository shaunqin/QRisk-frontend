<template>
  <div>
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50">
        <template slot="header">
          <span>序列</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.nameEN + index"
        :label="column.nameEN"
        :prop="column.prop ? column.prop : null"
      >
        <template slot-scope="{ row }" v-if="column.prop == 'riskName'">
          <div>
            {{ row[column.prop] }}
          </div>
        </template>
        <el-table-column
          v-if="column.prop != 'riskName'"
          :key="column.children.nameCN+index"
          :label="column.children.nameCN"
          :prop="column.children.prop"
        >
          <template slot-scope="{ row }">
            <div @click="detail(row, column.children)">
              {{ row[column.children.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryTableList } from '@/api/risk'
export default {
  data() {
    return {
      loading: false,
      data: [],
      columns: [],
      list: {
        headers: [{nameEN: ''}]
      }
    }
  },
  created() {
    this.toQuery()
  },
  methods: {
    toQuery() {
      this.loading = true
      queryTableList().then(res => {
        this.list = res.obj
        this.data = res.obj.datas.map(item => {
          item = Object.assign(item, item.children)
          return item
        })
        this.columns = res.obj.headers
        this.loading = false
      })
    },
    detail(row, item) {
      console.log(row, item)
    },
  },
}
</script>