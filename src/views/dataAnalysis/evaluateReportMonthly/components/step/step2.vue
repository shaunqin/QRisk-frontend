<template>
  <div>
    <el-form ref="form" size="mini" inline>
      <el-row class="full-row">
        <el-col :span="24">
          <el-form-item label="标题">
            <el-input v-model="detailForm.riskControl.title" placeholder></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审批记录" key="noticeComments" v-if="noticeComments.length>0">
            <apprvalRecord :data="noticeComments" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-card
        v-loading="cdLoading"
        :gutter="8"
        v-for="(item,index) in detailForm.riskControl.riskControlExpList"
        :key="index"
      >
        <el-form-item label="风险图">
          <el-select
            v-model="item.riskSource"
            placeholder
            @change="picSourceChange($event,item)"
            clearable
          >
            <el-option
              v-for="item in picSource"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险">
          <riskSelect
            :filterArr="imageRiskList.length>0&&!!item.riskSource?imageRiskList.find(r=>r.name==item.riskSource).children:[]"
            :value="item.risk"
            @change="riskChange($event,item)"
            style="width:150px"
          />
        </el-form-item>
        <el-form-item label="填报截止日期">
          <el-date-picker v-model="item.fillDeadline" value-format="yyyy-MM-dd" style="width:140px"></el-date-picker>
        </el-form-item>
        <el-form-item label="落实截止日期">
          <el-date-picker
            v-model="item.implementDeadline"
            value-format="yyyy-MM-dd"
            style="width:140px"
          ></el-date-picker>
        </el-form-item>
        <el-row class="full-row">
          <el-col :span="24">
            <el-form-item label="责任单位">
              <department
                class="mini"
                :value="item.deptPathList"
                @change="deptChange($event,item)"
                style="width:100%;"
                :multiple="true"
                :flat="true"
              ></department>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="item.remark" placeholder></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align:center">
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" @click="delRow(index)"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-button
      class="mt"
      icon="el-icon-plus"
      style="width:100%;border-style: dashed;"
      @click="addRow"
    >新增</el-button>
  </div>
</template>

<script>
import { getRiskAssessmentChartData } from "@/api/risk";
import department from "@/components/Department";
import { format } from "@/utils/datetime";
import riskSelect from '@/views/dataAnalysis/riskEvaluateMonthly/components/riskSelect';
import apprvalRecord from '../apprvalRecord'
export default {
  components: { department, riskSelect, apprvalRecord },
  data() {
    return {
      loading: false,
      cdLoading: false,
      save_loading: false,
      detailForm: {
        riskControl: {
          fileId: "",
          title: "",
          year: "",
          month: "",
          riskControlExpList: [
            {
              remark: "",// 图备注
              risk: "", // 风险
              riskSource: "", // 图来源:1-1
              deptPathList: [], // 部门
              fillDeadline: "", // 填报截止日期
              implementDeadline: "", // 落实截止日期
            }
          ]
        }
      },
      picSource: [
        { label: '1-1、月度关键风险状态', value: '1_1' },
        { label: '1-2、年度关键风险状态', value: '1_2' },
        { label: '1-3、关键风险TOP3趋势', value: '1_3' },
        { label: '1-4、关键风险TOP3状态(各产品)', value: '1_4' },
        { label: '1-5、关键风险TOP3状态(各单位)', value: '1_5' },
        { label: '1-6、关键风险TOP3关联危险源', value: '1_6' }
      ],
      imageRiskList: []
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    form: {
      type: Object,
      default: () => { },
    },
  },
  created() { this.loadData(); },
  computed: {
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      } else {
        return []
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.loadData();
      },
    },
  },
  methods: {
    format,
    loadData() {
      let data = JSON.parse(JSON.stringify(this.data));
      this.detailForm = {
        riskControl: {
          id: data.id,
          fileId: data.fileId,
          title: data.title,
          year: data.year,
          month: data.month,
          riskControlExpList: data.riskControlExpVoList || []
        }
      }
      this.cdLoading = true;
      getRiskAssessmentChartData({ dateValue1: data.year, dateValue2: data.month, dateType: 2 }).then(res => {
        this.cdLoading = false;
        if (res.code == '200') {
          this.imageRiskList = res.obj.map(item => {
            return {
              name: item.imageNo,
              children: item.data.map(r => r.name)
            }
          })
        }
      })
    },
    addRow() {
      this.detailForm.riskControl.riskControlExpList.push({
        remark: "",// 图备注
        risk: "", // 风险
        riskSource: "", // 图来源:1-1
        deptPathList: [], // 部门
        fillDeadline: "", // 填报截止日期
        implementDeadline: "", // 落实截止日期
      })
    },
    delRow(index) {
      this.detailForm.riskControl.riskControlExpList.splice(index, 1);
    },
    deptChange(val, item) {
      item.deptPathList = val;
    },
    riskChange(val, item) {
      item.risk = val;
    },
    picSourceChange(val, item) {
      item.risk = "";
    }
  },
};
</script>

<style lang="scss" scoped>
.full-row {
  /deep/.el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
.el-card + .el-card {
  margin-top: 10px;
}
.mt {
  margin-top: 10px;
}
/deep/ .vue-treeselect--append-to-body {
  z-index: 100 !important;
}
</style>

