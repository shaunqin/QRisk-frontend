<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '填报'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="产品" label-width="40px">
            <el-select v-model="product" placeholder="请选择产品" style="width:100%" clearable>
              <el-option
                v-for="item in prodList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期" label-width="40px">
            <el-date-picker
              v-model="fillInDate"
              value-format="yyyy-MM-dd"
              placeholder
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label>
        <el-table :data="productIndex">
          <el-table-column label prop="name" />
          <el-table-column label="客户机对" v-if="product=='1'||product=='4'">
            <template slot-scope="{row}" v-if="row.key1!=null">
              <el-input-number v-model="row.value1" placeholder></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="国航机对" v-if="product=='1'||product=='4'">
            <template slot-scope="{row}" v-if="row.key0!=null">
              <el-input-number v-model="row.value0" placeholder></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="值" v-if="product=='2'||product=='3'">
            <template slot-scope="{row}" v-if="row.key0!=null">
              <el-input-number v-model="row.value0" placeholder></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { taskAdd, taskModify, updateMonthTaskParam } from "@/api/quality";
import { queryDictByName } from "@/api/dict";
import dictSelect from "@/components/common/dictSelect";

export default {
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      monthTaskId: "",
      fillInDate: "",
      form: {},
      formRules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
      },
      prodList: [],
      product: "",
      params: {}
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    productIndex() {
      let arr = [];
      if (!!this.product) {
        let data = this.prodList.find((r) => r.value == this.product).children;
        data.map((item) => {
          arr.push({
            name: item.name,
            key0: item.value0,
            key1: item.value1,
            value0: this.params[item.value0] || 0,
            value1: this.params[item.value1] || 0,
          });
        });
      }
      console.log(arr)
      return arr;
    },
  },
  created() {
    this.prodList = [
      {
        name: "定检产品", value: '1', children: [
          { name: '出厂检发现问题数量', value0: 'outCheckProblemNum0', value1: 'outCheckProblemNum1' },
          { name: '出厂首班机械原因不正常航班数量', value0: 'outFirstMechanicalNum0', value1: 'outFirstMechanicalNum1' },
          { name: '国航出厂一周机械原因不正常航班数量', value0: 'outWeekMechanicalNum', value1: null },
          { name: '维修差错及质量调查数量', value0: 'repairErrorAndQauditNum0', value1: 'repairErrorAndQauditNum1' },
          { name: '客户质量投诉数量', value0: null, value1: 'customerQuComplaintNum' },
          { name: '客户满意度调查全月份数', value0: null, value1: 'custSatisfactionMonthSurveyNum' },
          { name: '客户满意度调查全月份数总分数之和', value0: null, value1: 'custSatisfactionMonthSurveyScoresSum' },
        ]
      },
      {
        name: '发动机/APU产品', value: '2', children: [
          { name: '全月出厂发动机/APU车台重复试车次数', value0: 'outRepeatTestRunNum', value1: null },
          { name: '全月出厂发动机/APU总台数', value0: 'outTotalNum', value1: null },
          { name: '发动机/APU在保修期全月返厂台数', value0: 'returnWithinWarrantyPeriodNum', value1: null },
          { name: '维修差错及质量调查数量', value0: 'repairErrorAndQauditNum', value1: null },
          { name: '客户质量投诉数量', value0: 'customerQuComplaintNum', value1: null },
        ]
      },
      {
        name: '附件修理产品', value: '3', children: [
          { name: '装机时间50小时以下非计划拆换的附件数量', value0: 'fiftyHourComponentNum', value1: null },
          { name: '全月出厂附件总数量', value0: 'outComponentTotalNum', value1: null },
          { name: '全月装机时间低于1000小时返厂修理/索赔的附件数量', value0: 'thousandHourComponentNum', value1: null },
          { name: '维修差错及质量调查数量', value0: 'repairErrorAndQauditNum', value1: null },
          { name: '出厂检发现问题数量', value0: 'outCheckProblemNum', value1: null },
          { name: '客户质量投诉数量', value0: 'customerQuComplaintNum', value1: null },
        ]
      },
      {
        name: '航线维修产品', value: '4', children: [
          { name: '出港基地机械原因航班不正常数量全月之和', value0: 'outMechanicalNum0', value1: 'outMechanicalNum1' },
          { name: '出港基地航班数量全月之和', value0: 'outTotalNum0', value1: 'outTotalNum1' },
          { name: '执管基地国航机队机组报告故障（TLB、CLB上问题）全月数量', value0: null, value1: 'reportFaultNum' },
          { name: '执管基地国航机队重复故障全月数量', value0: null, value1: 'repeatFaultNum' },
          { name: '执管基地国航机队总飞行时间', value0: null, value1: 'flyHoursTotalNum' },
          { name: '维修差错及质量调查数量', value0: 'repairErrorAndQauditNum0', value1: 'repairErrorAndQauditNum1' },
          { name: '客户质量投诉数量', value0: null, value1: 'customerQuComplaintNum' },
        ]
      }
    ]
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      // 格式化数据
      let data = {};
      this.productIndex.map(item => {
        if (item.key0 != null) {
          data[item.key0] = item.value0;
        }
        if (item.key1 != null) {
          data[item.key1] = item.value1;
        }
      })
      let formData = {
        fillData: data,
        fillInDate: this.fillInDate,
        monthTaskId: this.monthTaskId
      }
      // console.log(data)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else this.doModify(formData);
        }
      });
    },
    doAdd() {
      taskAdd(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify(formData) {
      updateMonthTaskParam(formData)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        taskName: "",
        year: "",
        defaultDay: "",
        productValue: "",
        monthTasks: [],
        type: 2,
      };
      this.product = "";
    },
    dictChange(val) {
      this.form.productValue = val;
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
