<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="填报"
    custom-class="big_dialog"
  >
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{data.no}}</el-form-item>
        <el-form-item label="截止日期">{{formatShortDate(data.endTime)}}</el-form-item>
        <el-form-item label="下发部门">{{data.issueDeptName}}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{data.title}}</el-form-item>
            <el-form-item label="通知内容">{{data.noteContent}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 系统和工作分析记录表 -->
      <el-card header="系统和工作分析记录表" key="1">
        <el-form size="mini" label-width="80px">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="form.analysisTitle"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input :disabled="true" v-model="form.analysisNo"></el-input>
            </el-form-item>
            <el-form-item label="分析人">
              <el-input v-model="form.analysis"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="识别单位">
            <department class="mini" :value="form.identificationUnit" @change="ideUnitChange"></department>
          </el-form-item>
            <el-form-item label="批准">
              <el-input :disabled="true" v-model="form.approval"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <department :value="form.analysisDept" @change="deptAnalysisChange($event,'analysisDept')"></department>
            </el-form-item>
            <el-form-item label="批准日期">
              <el-date-picker
                v-model="form.approvalDate"
                value-format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        <el-row>
          <el-col :span="24">
            <el-button
              class="mb-10"
              type="info"
              size="mini"
              icon="el-icon-plus"
              @click="addCol"
            >新增一行</el-button>
          </el-col>
        </el-row>
        <el-table :data="form.specialRiskAnalyses" size="mini" max-height="500">
          <el-table-column label="产品" min-width="130">
            <template slot-scope="{row}">
              <dictSelect
                type="product"
                :value="row.product"
                @change="dictChange($event,row,'product')"
              />
            </template>
          </el-table-column>
          <el-table-column label="子系统" width="130">
            <template slot-scope="{row}">
              <dictSelect
                type="system"
                :value="row.subSystem"
                @change="dictChange($event,row,'subSystem')"
              />
            </template>
          </el-table-column>
          <el-table-column label="管理流程" min-width="130">
            <template slot-scope="{row}">
              <el-input v-model="row.managementProcess" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="责任单位" min-width="200">
            <template slot-scope="{row}">
              <department :value="row.reponsibleUnit" @change="deptChangeOnTb($event,row)"></department>
            </template>
          </el-table-column>
          <el-table-column label="岗位" min-width="130">
            <template slot-scope="{row}">
              <el-input v-model="row.post" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="流程要素">
            <el-table-column label="人" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processHuman" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="机" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processMachine" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processMaterial" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="法" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processRegulation" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="环" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.processEnvironment" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="流程分析">
            <el-table-column label="输入" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.input" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="输出" min-width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.output" type="textarea" rows="1" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label fixed="right" width="80">
            <template slot-scope="{$index}">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="delAnalysesCol($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>


    <el-card header="危险源">
      <el-button
        :disabled="formEnable"
        type="primary"
        size="mini"
        @click="addHazard"
        style="margin-bottom:10px"
      >新增危险源</el-button>
      <el-card shadow="never" v-for="(item,index) in form.hazardList" :key="index">
        <el-form size="mini" inline label-width="70px" :disabled="formEnable">
          <el-form-item label="产品">
            <dict-select
              :value="item.product"
              type="product"
              @change="dictChange($event,item,'product')"
              style="width:130px"
            />
          </el-form-item>
          <el-form-item label="子系统">
            <dict-select
              :value="item.subSystem"
              type="system"
              @change="dictChange($event,item,'subSystem')"
              style="width:130px"
            />
          </el-form-item>
          <el-form-item label="管理流程">
            <el-input v-model="item.managementProcess"></el-input>
          </el-form-item>
          <el-form-item label="危险源层级一" label-width="115px">
            <el-select
              clearable
              v-model="item.riskLevel1"
              placeholder="请选择层级一"
              style="width: 130px"
              @change="chooseRiskLevel1(item.riskLevel1, item)"
            >
              <el-option
                v-for="item in riskLevel1List"
                :key="item.key"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="危险源层级二" label-width="115px">
            <el-select
              clearable
              v-model="item.riskLevel2"
              placeholder="请选择层级二"
              style="width: 130px;"
              @change="chooseRiskLevel2(item.riskLevel2, item)"
            >
              <el-option
                v-for="item in riskLevel2List"
                :key="item.key"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="危险源">
            <el-select v-model="item.hazard" placeholder="请选择危险源" style="width:130px" @change="dictChange(item.hazard,item,'hazard')">
              <el-option
                v-for="childItem in hazardList"
                :key="childItem.diskNo"
                :label="childItem.diskName"
                :value="childItem.diskNo"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可能导致的风险" label-width="115px">
            <el-select v-model="item.possibleRisks" clearable placeholder="请选择可能导致的风险" style="width:130px" @change="dictChange(item.possibleRisks,item,'possibleRisks')">
              <el-option
                v-for="childItem in possibleRisksList"
                :key="childItem.riskNo"
                :label="childItem.riskName"
                :value="childItem.riskNo"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可能性">
            <dict-select
              :value="item.possibility"
              type="probability_level"
              @change="dictChange($event,item,'possibility')"
              style="width:130px"
            />
          </el-form-item>
          <el-form-item label="严重性">
            <dict-select
              :value="item.seriousness"
              type="severity_level_matrix_graph"
              @change="dictChange($event,item,'seriousness')"
            />
          </el-form-item>
          <el-form-item label="风险等级">
            <dict-select
              :value="item.riskLevel"
              type="risk_level"
              @change="dictChange($event,item,'riskLevel')"
              style="width:130px"
            />
          </el-form-item>
          <el-row :gutter="16" class="fill-row">
            <el-col :span="12">
              <el-form-item label="危险源描述">
                <el-input v-model="item.hazardSource" type="textarea" rows="3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="根原因分析">
                <el-input v-model="item.rootCauseAnalysis" type="textarea" rows="3"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 风险表格 -->
        <el-button
          :disabled="riskEnable"
          type="info"
          size="mini"
          class="at"
          @click="addRow(item)"
        >新增一行</el-button>
        <el-table :data="item.specialRiskMeasureList" size="small" max-height="400px">
          <el-table-column type="index" width="50" />
          <el-table-column label="控制措施">
            <template slot-scope="scope">
              <el-input v-model="scope.row.controlMeasure" :disabled="riskEnable" type="textarea" rows="1"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="责任单位">
            <template slot-scope="scope">
              <department
                :value="scope.row.reponsibleDept"
                @change="deptChange($event,scope.row)"
                :disabled="riskEnable"
              />
            </template>
          </el-table-column>
          <el-table-column label="控制状态">
            <template slot-scope="scope">
              <el-select v-model="scope.row.completion" :disabled="completionEnable">
                <el-option label="未控制" value="1"></el-option>
                <el-option label="控制中" value="2"></el-option>
                <el-option label="关闭" value="3"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="完成期限">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.deadline"
                value-format="yyyy-MM-dd"
                :disabled="riskEnable"
                style="max-width:100%"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column width="80">
            <template slot-scope="{$index}">
              <el-button
                :disabled="riskEnable"
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="delCol($index,item)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="center">
          <el-button
            :disabled="formEnable"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delHazard(index)"
          >删除</el-button>
        </div>
      </el-card>
    </el-card>
    <!-- 风险评价报告 -->
    <report ref="report" :formId="formId" />

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initData from "@/mixins/initData";
import { specialRiskSaveHazard, specialRiskQueryRiskLevel } from "@/api/risk";
import { queryDictByName } from "@/api/dict";
import { queryHazardList } from "@/api/standard";
import { formatShortDate } from "@/utils/datetime";
import dictSelect from "@/components/common/dictSelect";
import department from "@/components/Department";
import report from "./report";

export default {
  components: { dictSelect, department, report },
  mixins: [initData],
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: "",
        analysisTitle: "",
        analysis: "",
        analysisNo: "",
        approval: "",
        identificationUnit: null,
        approvalDate: "",
        analysisDept: "",
        specialRiskAnalyses: [{
            product: "",  // 产品
            subSystem: "", // 子系统
            managementProcess: "", // 管理流程
            reponsibleUnit: null, // 责任单位
            post: "", // 岗位
            processHuman: "", // 人
            processMachine: "", // 机
            processMaterial: "", // 料
            processRegulation: "", // 法
            processEnvironment: "", // 环
            input: "", // 输入
            output: "", // 输出
          }],
        hazardList: [
          {
            riskLevel1: "", //危险源层级1
            riskLevel2: "", //危险源层级2
            hazard: "", // 危险源
            hazardSource: "", // 危险源描述
            managementProcess: "", // 管理流程
            possibility: "", // 可能性
            possibleRisks: "", // 可能导致的风险
            riskLevel: "", // 风险等级
            rootCauseAnalysis: "", // 根原因分析
            seriousness: "", // 严重性
            specialRiskMeasureList: [
              {
                completion: "",
                controlMeasure: "",
                deadline: "",
                reponsibleDept: null,
              },
            ],
            subSystem: "", // 子系统
            product: "", //产品
          },
        ],
      },
      riskLevel1List: [],
      riskLevel2List: [],
      totalhazardList: [], // 全部危险源
      hazardList: [], // 危险源
      possibleRisksList: [], // 可能导致的风险列表
      data: {}, // 父级赋值
      formId: null,
    };
  },
  computed: {
    type() {
      return this.data.step;
    },
    formEnable() {
      return this.data.step == 4 || this.data.step == 5 || this.data.step == 6;
    },
    riskEnable() {
      return this.data.step == 5 || this.data.step == 6;
    },
    completionEnable() {
      return this.data.step != 5 && this.data.step != 6;
    },
  },
  mounted() {
    // 危险源
    queryHazardList().then((res) => {
      this.totalhazardList = res.obj;
      this.hazardList = this.totalhazardList
      // 危险源层级
      queryDictByName("hazard_source").then((response) => {
        this.riskLevel1List = response.obj[0].children;
      });
    });
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.loading = true;
      specialRiskSaveHazard(this.form).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          if (res.obj) {
            this.formId = this.data.id;
            this.$refs.report.dialog = true;
          } else {
            this.$message.success("填报成功");
            this.$parent.init();
            this.resetForm();
          }
        }
        this.loading = false;
      });
    },
    resetForm() {
      this.dialog = false;
      this.form = {
        id: "",
        analysisTitle: "",
        analysis: "",
        analysisNo: "",
        approval: "",
        identificationUnit: null,
        approvalDate: "",
        analysisDept: "",
        specialRiskAnalyses: [{
            product: "",  // 产品
            subSystem: "", // 子系统
            managementProcess: "", // 管理流程
            reponsibleUnit: null, // 责任单位
            post: "", // 岗位
            processHuman: "", // 人
            processMachine: "", // 机
            processMaterial: "", // 料
            processRegulation: "", // 法
            processEnvironment: "", // 环
            input: "", // 输入
            output: "", // 输出
          }],
        hazardList: [
          {
            hazard: "",
            riskLevel1: "", //危险源层级1
            riskLevel2: "", //危险源层级2
            diskNo: "",
            hazardSource: "",
            managementProcess: "",
            possibility: "",
            possibleRisks: "",
            riskLevel: "",
            rootCauseAnalysis: "",
            seriousness: "",
            specialRiskMeasureList: [
              {
                completion: "",
                controlMeasure: "",
                deadline: "",
                reponsibleDept: null,
              },
            ],
            subSystem: "",
            product: "",
          },
        ],
      };
      this.data = {};
      this.formId = null;
    },
    
    addCol() {
      this.form.specialRiskAnalyses.push({
        product: "",  // 产品
        subSystem: "", // 子系统
        managementProcess: "", // 管理流程
        reponsibleUnit: null, // 责任单位
        post: "", // 岗位
        processHuman: "", // 人
        processMachine: "", // 机
        processMaterial: "", // 料
        processRegulation: "", // 法
        processEnvironment: "", // 环
        input: "", // 输入
        output: "", // 输出
      });
    },
    delAnalysesCol(index) {
      this.form.specialRiskAnalyses.splice(index, 1);
    },
    addHazard() {
      this.form.hazardList.push({
        riskLevel1: this.riskLevel1List[0] ? this.riskLevel1List[0].value : "", //危险源层级1
        riskLevel2: this.riskLevel2List[0] ? this.riskLevel2List[0].value : "", //危险源层级2
        hazard: this.hazardList[0] ? this.hazardList[0].diskNo : "",
        hazardSource: "",
        managementProcess: "",
        possibility: "1",
        possibleRisks: this.possibleRisksList[0].riskNo,
        riskLevel: "1",
        rootCauseAnalysis: "",
        seriousness: "1",
        specialRiskMeasureList: [
          {
            completion: "",
            controlMeasure: "",
            deadline: "",
            reponsibleDept: null,
          },
        ],
        subSystem: "",
        product: "",
      });
      this.form.hazardList[this.form.hazardList.length-1].riskLevel1 = this.riskLevel1List[0].value
      this.chooseRiskLevel1(this.form.hazardList[this.form.hazardList.length-1].riskLevel1, this.form.hazardList[this.form.hazardList.length-1])
    },
    delHazard(index) {
      this.form.hazardList.splice(index, 1);
    },
    addRow(item) {
      item.specialRiskMeasureList.push({
        completion: "",
        controlMeasure: "",
        deadline: "",
        reponsibleDept: null,
      });
    },
    delCol(index, item) {
      item.specialRiskMeasureList.splice(index, 1);
    },
    dictChange(val, item, key) {
      item[key] = val;
      if (key == 'hazard' || key == 'possibleRisks') {
        this.queryRiskLevel(item.hazard, item.possibleRisks, item);
      }
    },
    deptChange(val, row) {
      row.reponsibleDept = val;
    },
    deptAnalysisChange(val, key) {
      this.form[key] = val;
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val;
    },
    ideUnitChange(val) {
      this.form.identificationUnit = val;
    },
    /**查询风险 */
    queryRiskLevel(hazard, risk, item) {
      if (!!hazard && !!risk) {
        specialRiskQueryRiskLevel(hazard, risk).then(res => {
          if (res.code == '200') {
            item.possibility = res.obj.possibility;
            item.seriousness = res.obj.seriousness;
            item.riskLevel = res.obj.riskLevel;
          }
        })
      }
    },
    chooseRiskLevel1(val, item) {
      if (this.riskLevel1List.length > 0) {
          let list = this.riskLevel1List.filter((r) => r.value == val);
          if (list && list.length > 0) {
            this.riskLevel2List = list[0].children;
          }
          item.riskLevel2 = this.riskLevel2List[0].value
          this.chooseRiskLevel2(item.riskLevel2, item)
        }
    },
    chooseRiskLevel2(val, item) {
      let list = this.totalhazardList.filter((r) => r.cateValue == val);
      if (list && list.length > 0) {
        this.hazardList = list;
      }
      item.hazard = this.hazardList[0] ? this.hazardList[0].diskNo : ""
    },
  },
};
</script>


<style lang="scss" scoped>
.info {
  /deep/ .el-form-item__content {
    min-width: 200px;
  }
}
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}

.el-card + .el-card {
  margin-top: 20px;
}
.center {
  margin-top: 8px;
  text-align: center;
}
.at {
  margin-bottom: 8px;
}
</style>
