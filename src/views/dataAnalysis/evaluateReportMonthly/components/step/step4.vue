<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
      <baseinfo :data="data" />
      <el-form-item label="标题">{{data.title}}</el-form-item>
      <el-form-item label="风险措施">
        <cmpRiskControl :data="data.riskControlExpVoList" :measuresEnable="fillRiskMeasuresEnable" />
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
import baseinfo from './baseInfo'
export default {
  components: { cmpRiskControl, baseinfo },
  data() {
    return {
      spanArr: [],
      position: 0,
      baseUrl: process.env.VUE_APP_BASE_API,
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