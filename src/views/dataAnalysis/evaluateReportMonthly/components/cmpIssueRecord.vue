<template>
  <div>
      <el-table
      :data="data"
      size="mini"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="部门" prop="deptName" width="200" align="left" show-overflow-tooltip />
      <el-table-column label="措施内容" v-if="!implementEnable">
        <template slot-scope="{row}">
          <span v-if="!row.data.riskVoList">-</span>
          <ul class="ul-risk" v-else>
            <li v-for="item in row.data.riskVoList" :key="item.id">{{item.riskMeasures}}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" v-if="!implementEnable">
        <template slot-scope="{row}">
          <span v-if="!row.data.riskVoList">-</span>
          <ul class="ul-risk" v-else>
            <li v-for="item in row.data.riskVoList" :key="item.id">{{item.deadline}}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="落实情况" v-if="implementEnable">
        <template slot-scope="{row}">
          <span v-if="!row.data.measuresVoList">-</span>
          <ul class="ul-risk" v-else>
            <li v-for="item in row.data.measuresVoList" :key="item.id">{{item.implementationMeasures}}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="下发人" prop="issuer" width="130" />
      <el-table-column label="上报人" prop="filler" width="130" />
      <el-table-column label="状态" width="80">
        <template slot-scope="{row}">
          <span v-if="row.status==0">待填</span>
          <span v-if="row.status==1">待填</span>
          <span v-if="row.status==2">待审核</span>
          <span v-if="row.status==3">通过</span>
          <span v-if="row.status==4">驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人" width="80">
        <template slot-scope="{row}">
          <div v-if="row.reviewerInfo.length==0">-</div>
          <el-popover v-else placement="left">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <transactor :data="row.reviewerInfo" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审批记录" width="100">
        <template slot-scope="{row}">
          <div v-if="row.comments.length==0">-</div>
          <el-popover v-else placement="left" width="1000">
            <el-button type="text" size="mini" slot="reference">详情</el-button>
            <leaderApprvalRecord :data="row.comments" type="safety_measures" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import leaderApprvalRecord from "./apprvalRecord";
import transactor from '@/components/common/transactor'
export default {
  components: { leaderApprvalRecord, transactor },
  props: {
    data: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    implementEnable() {
      if (this.data.length > 0) {
        return this.data[0].data.tag == '1'
      }
      return false
    }
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