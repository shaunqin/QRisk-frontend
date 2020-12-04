<template>
  <div>
    <el-table :data="data" size="mini" :span-method="objectSpanMethod">
      <el-table-column label="部门" prop="deptPathCn" />
      <el-table-column label="风险" prop="riskName" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="填报措施">
        <template slot-scope="{row}">
          <span v-if="!row.riskControlRiskVoList">-</span>
          <ul class="ul-risk" v-else>
            <li v-for="item in row.riskControlRiskVoList" :key="item.id">{{item.riskMeasures}}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="{row}">
          <span v-if="!row.reviewing">-</span>
          <el-button v-else type="primary" size="mini" @click="subHandle(row)">办理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ehandle ref="ehandle" />
  </div>
</template>

<script>
import ehandle from './handleTo4'
import { riskControlQueryDetailTask } from '@/api/risk'
export default {
  components: { ehandle },
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
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    subHandle(row) {
      this.loading = true;
      riskControlQueryDetailTask(row.taskId, row.formId).then((res) => {
        this.loading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let _this = this.$refs.ehandle;
          _this.data = res.obj;
          _this.form.taskId = row.taskId;
          _this.form.formId = res.obj.id;
          _this.parentTaskId = row.parentTaskId;
          if (res.obj.riskVoList && res.obj.riskVoList.length > 0) {
            _this.form.riskControlRisk = res.obj.riskVoList;
          }
          _this.dialog = true;
        }
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.ul-risk {
  list-style: decimal;
  text-align: left;
  margin: 0;
}
</style>