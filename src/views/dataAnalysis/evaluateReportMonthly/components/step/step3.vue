<template>
  <div>
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年份">{{`${data.year}-${data.month}`}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="拟制人">{{data.issueName}}[{{data.issuer}}]</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-link type="primary" target="_blank" :href="baseUrl+data.filePath">查看PDF</el-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题">{{data.title}}</el-form-item>
      <el-form-item label="风险措施">
        <el-table :data="data.riskControlExpVoList" size="mini">
          <el-table-column label="下发单位" prop="deptPathCn" />
          <el-table-column label="风险" prop="riskName" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column v-if="fillRiskMeasuresEnable" label="落实情况" min-width="200">
            <template slot-scope="{row}">
              <el-input v-model="measuresObj[row.id]" type="textarea" rows="3"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="填报截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.fillDeadline)}}</template>
          </el-table-column>
          <el-table-column label="落实截止日期">
            <template slot-scope="{row}">{{formatShortDate(row.implementDeadline)}}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 下发措施 -->
      <el-form-item key="childRisk" label="下发措施" v-if="childRisk.length>0">
        <childRisk :data="childRisk" :source="source" />
      </el-form-item>
      <el-form-item label="措施填报" v-if="!hiddenFill&&!fillRiskMeasuresEnable">
        <el-row
          v-for="(item,index) in form.riskControlRisk"
          :key="index"
          :gutter="16"
          class="cus-row"
        >
          <el-col :span="4">
            <el-select size="mini" v-model="item.riskId" placeholder="请选择风险" style="width:100%">
              <el-option v-for="r in riskList" :key="r.value" :label="r.label" :value="r.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input size="mini" v-model="item.riskMeasures" placeholder="请填写措施"></el-input>
          </el-col>
          <el-col :span="6">
            <department
              class="mini"
              :value="item.respDeptList"
              @change="deptChange($event,item)"
              style="width:100%"
              :multiple="true"
              :flat="true"
              :path="data.deptRisk.deptPath"
              :defaultExpand="Infinity"
            />
          </el-col>
          <el-col :span="4">
            <el-date-picker
              size="mini"
              v-model="item.deadline"
              value-format="yyyy-MM-dd"
              style="width:100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delRow(index)"></el-button>
          </el-col>
        </el-row>
        <el-button class="add-btn" size="mini" icon="el-icon-plus" @click="addRow">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime';
import childRisk from '../childRisk'
import department from '../department'
export default {
  components: { childRisk, department },
  data() {
    return {
      accessory: {},
      summary: "",
      measuresObj: {},
      baseUrl: process.env.VUE_APP_BASE_API,
    };
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
    source: {
      type: String,
      default: "",
    },
  },
  computed: {
    riskList() {
      return this.data.riskControlExpVoList.map(item => {
        return {
          label: item.riskName,
          value: item.id
        }
      })
    },
    childRisk() {
      if (this.data.childRiskControlExpVoList) {
        return this.data.childRiskControlExpVoList;
      }
      return []
    },
    hiddenFill() {
      return this.data.hiddenFill;
    },
    fillRiskMeasuresEnable() {
      try {
        return this.data.deptRisk.tag == '1'
      } catch (e) {
        return false
      }
    },
  },
  watch: {
    measuresObj: {
      deep: true,
      handler(val) {
        let arr = [];
        for (let x in val) {
          arr.push({
            measuresId: x,
            implementationMeasures: val[x]
          })
        }
        this.form.riskControlMeasures = arr;
      }
    }
  },
  created() {
    // this.form.comment = this.data.summary;
    let obj = {};
    this.data.riskControlExpVoList.map(item => {
      obj[item.id] = item.implementationMeasures || "";
    })
    this.measuresObj = obj;
  },
  methods: {
    formatShortDate,
    success(res, row) {
      console.log(res);
      this.accessory = {
        filePath: res.obj.filePath,
        originFileName: res.obj.originFileName
      }
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    addRow() {
      this.form.riskControlRisk.push({
        riskId: "",
        riskMeasures: "",
        respDeptList: [],
        deadline: "",

      })
    },
    delRow(index) {
      this.form.riskControlRisk.splice(index, 1);
    },
    deptChange(val, item) {
      item.respDeptList = val;
    }
  },
};
</script>

<style lang="scss" scoped>
.cus-row {
  margin: 0 !important;
  margin-bottom: 4px !important;
}
.add-btn {
  border-style: dashed;
  margin: 0 8px;
}
</style>