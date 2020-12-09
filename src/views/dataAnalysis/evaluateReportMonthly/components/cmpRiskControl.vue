<template>
  <div>
    <el-table :data="data" size="mini" :span-method="objectSpanMethod" border>
      <el-table-column label="下发单位" prop="deptPathCn" />
      <el-table-column label="风险" prop="riskName" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="填报截止日期">
        <template slot-scope="{ row }">{{ formatShortDate(row.fillDeadline) }}</template>
      </el-table-column>
      <el-table-column label="落实截止日期">
        <template slot-scope="{ row }">{{ formatShortDate(row.implementDeadline) }}</template>
      </el-table-column>
      <el-table-column label="办理人" width="100">
        <template slot-scope="{ row }">
          <span v-if="!row.reviewerInfo">-</span>
          <el-popover v-else placement="left">
            <el-table size="mini" :data="row.reviewerInfo" style="width: 600px">
              <el-table-column label="任务名称" prop="taskName" />
              <el-table-column label="角色">
                <template slot-scope="{ row }">
                  <span v-if="!row.groupName">-</span>
                  <span v-else>{{ row.groupName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="候选人">
                <template slot-scope="{ row }">
                  <span v-if="!row.groupName">-</span>
                  <span v-else>{{ row.users }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分配人">
                <template slot-scope="{ row }">
                  <span v-if="!row.groupName">{{ row.name }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
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
      <el-table-column label="填报措施" min-width="150">
        <template slot-scope="{ row }">
          <span v-if="!row.riskControlRiskVoList">-</span>
          <ul class="ul-risk" v-else>
            <li v-for="item in row.riskControlRiskVoList" :key="item.id">{{ item.riskMeasures }}</li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
export default {
  data() {
    return {
      spanArr: [],
      position: 0
    }
  },
  props: ["data"],
  created() {
    this.getRowSpan(this.data);
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.getRowSpan(data)
      }
    }
  },
  methods: {
    formatShortDate,
    getRowSpan(data) {
      this.spanArr = [];
      this.position = 0;
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (data[index].deptPathCn === data[index - 1].deptPathCn) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (column.label == '下发单位' || column.label == '办理人' || column.label == '状态') {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
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