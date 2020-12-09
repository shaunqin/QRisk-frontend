<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年份">{{`${data.year}-${data.month}`}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟制人">{{data.issueName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题">{{data.title}}</el-form-item>
      <el-form-item label="风险措施">
        <el-table
          :data="data.riskControlExpVoList"
          size="mini"
          :span-method="objectSpanMethod"
          border
        >
          <el-table-column label="下发单位" prop="deptPathCn" />
          <el-table-column label="风险" prop="riskName" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column
            v-if="fillRiskMeasuresEnable"
            label="落实情况"
            prop="implementationMeasures"
            min-width="200"
          />
          <el-table-column label="填报截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.fillDeadline)}}</template>
          </el-table-column>
          <el-table-column label="落实截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.implementDeadline)}}</template>
          </el-table-column>
          <el-table-column label="填报人" width="130">
            <template slot-scope="{ row }">
              <span v-if="row.fillerName">{{row.fillerName}}[{{row.filler}}]</span>
              <span v-else>-</span>
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
            <template slot-scope="{row}">
              <span v-if="!row.riskControlRiskVoList">-</span>
              <ul class="ul-risk" v-else>
                <li v-for="item in row.riskControlRiskVoList" :key="item.id">{{ item.riskMeasures }}</li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label>
        <el-radio-group v-model="form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
        <el-input v-model="form.comment" type="textarea" rows="3" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import cmpRiskControl from '../cmpRiskControl'
export default {
  components: { cmpRiskControl, },
  data() {
    return {
      spanArr: [],
      position: 0
    };
  },
  computed: {
    fillRiskMeasuresEnable() {
      try {
        return this.data.deptRisk.tag == '1'
      } catch (e) {
        return false
      }
    },
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    form: {
      type: Object,
      default: () => { },
    },
  },
  created() {
    this.getRowSpan(this.data.riskControlExpVoList);
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.getRowSpan(data.riskControlExpVoList)
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
      if (column.label == '下发单位' || column.label == '填报人' || column.label == '状态') {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ul-risk {
  list-style: decimal;
  text-align: left;
  margin: 0;
  padding-left: 10px;
}
</style>