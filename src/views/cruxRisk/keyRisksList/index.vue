<template>
  <div class="app-container">
    <div class="head-container">
      <el-form size="mini" inline>
        <el-form-item label="发起时间">
          <el-date-picker
            v-model="date"
            unlink-panels
            type="daterange"
            placeholder
            value-format="yyyy-MM-dd"
            style="width: 220px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button type="success" icon="el-icon-search" @click="toQuery"
            >查询</el-button
          >
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            @click="refresh"
            >{{ $t('global.reset') }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%"
    >
      <el-table-column type="index" width="50">
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
          :key="column.children.nameCN + index"
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
          return item
        })
        this.columns = res.obj.headers
        this.loading = false
      })
    },
    detail(row, item) {
      console.log(row, item)
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
  min-height: calc(100vh - 56px);
  padding: 20px 0 0 20px;
}
</style>