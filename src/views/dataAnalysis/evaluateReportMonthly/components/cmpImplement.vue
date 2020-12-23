<template>
  <div>
    <el-table v-loading="loading" :data="data" size="mini" border>
      <el-table-column label="部门" prop="deptPathCn" />
      <el-table-column label="风险" prop="riskName" />
      <el-table-column label="填报措施" prop="riskMeasures" />
      <el-table-column label="落实情况" prop="implementationMeasures" />
      <el-table-column label="填报人">
        <template slot-scope="{row}">
          <span v-if="row.fillerName">{{`${row.fillerName}[${row.filler}]`}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人" width="80">
        <template slot-scope="{row}">
          <span v-if="!row.reviewerInfo">-</span>
          <el-popover v-else placement="left">
            <transactor :data="row.reviewerInfo" />
            <el-button size="mini" type="text" slot="reference">详细</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="{row}">
          <span v-if="row.status==0">待处理</span>
          <span v-else-if="row.status==1">已下发</span>
          <span v-else-if="row.status==2">已上报</span>
          <span v-else-if="row.status==3">同意</span>
          <span v-else-if="row.status==4">驳回</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import transactor from '@/components/common/transactor'
export default {
  components: { transactor },
  data() {
    return {
      loading: false
    }
  },
  props: ["data"],
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.ul-risk {
  list-style: decimal;
  text-align: left;
  margin: 0;
  padding-left: 10px;
}
</style>