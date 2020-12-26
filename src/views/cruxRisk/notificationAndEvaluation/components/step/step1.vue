<template>
  <div>
    <el-card header="详细信息">
      <el-form size="small" label-width="80px" class="info" inline>
        <el-form-item label="编号">{{ data.no }}</el-form-item>
        <el-form-item label="截止日期">{{
          formatShortDate(data.endTime)
        }}</el-form-item>
        <el-form-item :label="data.type=='1'?'下发部门':'分析单位'">{{ data.type=='1'?data.issueDeptName:data.analysisDeptName }}</el-form-item>
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="标题">{{ data.title }}</el-form-item>
            <el-form-item label="通知内容">{{ data.noteContent }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="hslot">
        <span>风险</span>
      </div>
      <el-badge :value="data.keyRiskLists.length">
        <el-button
          :disabled="formEnable"
          type="primary"
          size="mini"
          @click="addRisk"
          style="margin-bottom: 10px"
          >新增风险</el-button
        >
      </el-badge>
      <el-card
        shadow="never"
        v-for="(item, index) in data.keyRiskLists"
        :key="index"
        class="chead"
      >
        <div slot="header" class="clearfix">
            <span>风险{{ index + 1 }}</span>
            <span style="margin: 0px 15px;">
              是否适用于本单位
              <span style="margin: 0px 15px;">
                <el-radio-group v-model="item.appliance" @change="changeAppliance(item.appliance, item)">
                  <el-radio label="0" :disabled="formEnable || !!item.disabledAppliance">是</el-radio>
                  <el-radio label="1" :disabled="formEnable || !!item.disabledAppliance">否</el-radio>
                </el-radio-group>
              </span>
            </span>
            <span>
              <el-button
                :disabled="formEnable || item.disabledRisk"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delRisk(index)"
                >{{'删除风险'+(index+1)}}</el-button
              >
            </span>
          </div>
        <el-form size="mini" inline label-width="70px" :disabled="formEnable || item.disabledRisk">
          <el-form-item label="可能导致的风险" label-width="115px">
            <el-select
              v-model="item.possibleRisks"
              clearable
              placeholder="请选择可能导致的风险"
              style="width: 178px"
              @change="dictChange(item.possibleRisks, item, 'possibleRisks')"
            >
              <el-option
                v-for="childItem in possibleRisksList"
                :key="childItem.riskNo"
                :label="childItem.riskName"
                :value="childItem.riskNo"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="严重性">
            <dict-select
              :clearable="false"
              :showName="true"
              :disabled="true"
              :value="item.seriousness"
              type="severity_level"
              @change="dictChange($event, item, 'seriousness')"
            />
          </el-form-item>
          <el-form-item label="风险等级">
            <dict-select
              :value="item.riskLevel"
              type="risk_level"
              @change="dictChange($event, item, 'riskLevel')"
              style="width: 178px"
              :disabled="true"
            />
          </el-form-item>
        </el-form>
        <el-badge :value="item.hazardList.length">
          <el-button
            :disabled="formEnable || item.disabledRisk"
            type="primary"
            size="mini"
            @click="addHazard(item)"
            style="margin-bottom: 10px"
            >新增危险源</el-button
          >
        </el-badge>
        <el-card
          shadow="never"
          v-for="(itemHazard, indexHazard) in item.hazardList"
          :key="indexHazard"
        >
        <div slot="header" class="clearfix">
            <span>危险源{{ indexHazard + 1 }}</span>
            <span style="float: right;">
            <el-button
              :disabled="formEnable || item.disabledRisk"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delHazard(item, indexHazard)"
              >{{'删除危险源'+(indexHazard+1)}}</el-button
            >
            </span>
          </div>
          <el-form size="mini" inline label-width="70px" :disabled="formEnable || item.disabledRisk">
            <el-form-item label="危险源描述" label-width="115px">
              <el-input
                v-model="itemHazard.hazardSource"
                type="textarea"
                rows="2"
                style="width: 178px"
                @input="$forceUpdate()"
              ></el-input>
            </el-form-item>
            <el-form-item label="可能性">
              <dict-select
                :clearable="false"
                :showName="true"
                :value="itemHazard.possibility"
                type="probability_level"
                @change="dictChange($event, item, 'possibility', itemHazard)"
                style="width: 178px"
              />
            </el-form-item>
            <el-form-item label="风险等级">
              <dict-select
                :value="itemHazard.riskLevel"
                type="risk_level"
                @change="dictChange($event, itemHazard, 'riskLevel')"
                style="width: 178px"
                :disabled="true"
              />
            </el-form-item>
          </el-form>
          <!-- 风险表格 -->
          <el-button
            :disabled="riskEnable || item.disabledRisk"
            type="info"
            size="mini"
            class="at"
            @click="addRow(itemHazard)"
            >新增一行</el-button
          >
          <el-table
            :data="itemHazard.specialRiskMeasureList"
            size="small"
            max-height="400px"
            :key="specialRiskMeasureKey"
          >
            <el-table-column type="index" width="50" />
            <el-table-column label="控制措施">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.controlMeasure"
                  :disabled="riskEnable || item.disabledRisk"
                  type="textarea"
                  rows="3"
                  @input="$forceUpdate()"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="责任单位">
              <template slot-scope="scope">
                <department
                  :value="scope.row.reponsibleDept"
                  :path="data.issueDept"
                  @change="deptChange($event, scope.row)"
                  :disabled="riskEnable || item.disabledRisk"
                  :url="'/risk_mgr/key_risk_mgr/query/tree'"
                />
              </template>
            </el-table-column>
            <el-table-column label="完成期限">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.deadline"
                  value-format="yyyy-MM-dd"
                  :disabled="riskEnable || item.disabledRisk"
                  :picker-options="pickerOptions"
                  style="max-width: 100%"
                  @change="$forceUpdate()"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template slot-scope="{ $index }">
                <el-button
                  :disabled="riskEnable || item.disabledRisk"
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delCol($index, itemHazard)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>
    </el-card>

    <el-card header="已下发通知" key="childNotes" v-if="showChildNotes">
      <childNotes :data="data" />
    </el-card>
    <el-card
      header="审批记录"
      key="noticeComments"
      v-if="data.noticeComments && data.noticeComments.length > 0"
    >
      <apprvalRecord :data="data.noticeComments" />
    </el-card>
  </div>
</template>

<script>
import { formatShortDate } from '@/utils/datetime'
import apprvalRecord from '../apprvalRecord'
import dictSelect from '@/components/common/dictSelect'
import department from '@/components/Department'
import leaderApprvalRecord from '../leaderApprvalRecord'
import childNotes from '../childNotes'
import {
  getKeyRiskLevel,
  getKeyRiskSeriousnessLevel,
  queryKeyRiskListMgr,
} from '@/api/risk'
import { queryDictByName } from '@/api/dict'
import { queryHazardList } from '@/api/standard'

export default {
  components: {
    apprvalRecord,
    dictSelect,
    department,
    leaderApprvalRecord,
    childNotes,
  },
  data() {
    return {
      formId: '',
      riskLevel1List: [],
      riskLevel2List: [],
      totalhazardList: [], // 全部危险源
      hazardList: [], // 危险源
      possibleRisksList: [], // 可能导致的风险列表
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      specialRiskMeasureKey: true
    }
  },
  props: ['data', 'form'],
  computed: {
    type() {
      return this.data.step
    },
    formEnable() {
      return (
        this.data.step == 4 ||
        this.data.step == 5 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
    },
    riskEnable() {
      return (
        this.data.step == 4 ||
        this.data.step == 5 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
    },
    showChildNotes() {
      const bool = !(
        (this.data.step == 1 && this.data.hiddenIssue) ||
        this.data.step == 2 ||
        this.data.step == 4 ||
        this.data.step == 6 ||
        this.data.step == 7 ||
        this.data.step == 8
      )
      return bool
    },
    showChildMeasures() {
      return this.data.step == 4 || this.data.step == 5 || this.data.step == 6
    },
  },
  created() {
    // 危险源层级
    queryDictByName('hazard_source').then((response) => {
      this.riskLevel1List = response.obj[0].children
    })
    // 危险源
    queryHazardList().then((res) => {
      this.totalhazardList = res.obj
      this.hazardList = this.totalhazardList
    })
    queryKeyRiskListMgr().then((res) => {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        this.possibleRisksList = res.obj
      }
    })
  },
  methods: {
    formatShortDate,
    addCol() {
      this.data.specialRiskAnalyses.push({
        product: '', // 产品
        subSystem: '', // 子系统
        managementProcess: '', // 管理流程
        reponsibleUnit: null, // 责任单位
        post: '', // 岗位
        processHuman: '', // 人
        processMachine: '', // 机
        processMaterial: '', // 料
        processRegulation: '', // 法
        processEnvironment: '', // 环
        input: '', // 输入
        output: '', // 输出
      })
    },
    delAnalysesCol(index) {
      this.data.specialRiskAnalyses.splice(index, 1)
    },
    addRisk() {
      this.data.keyRiskLists.push({
        possibleRisks: '',
        riskLevel: '',
        seriousness: '',
        appliance: '0',
        hazardList: [{
          hazardSource: '',
          possibility: '',
          riskLevel: '',
          specialRiskMeasureList: [
            {
              controlMeasure: '',
              deadline: '',
              reponsibleDept: null,
            },
          ],
        }],
      })
      this.$forceUpdate()
    },
    delRisk(index) {
      this.data.keyRiskLists.splice(index, 1)
      this.$forceUpdate()
    },
    addHazard(item) {
      item.hazardList.push({
        hazardSource: '',
        possibility: '',
        riskLevel: '',
        specialRiskMeasureList: [
          {
            controlMeasure: '',
            deadline: '',
            reponsibleDept: null,
          },
        ],
      })
      this.$forceUpdate()
    },
    delHazard(item, indexHazard) {
      item.hazardList.splice(indexHazard, 1)
      setTimeout(() => {
        const arr = item.hazardList.map(serItem => {
          if(serItem.riskLevel !== '' && serItem.riskLevel !== null && serItem.riskLevel !== undefined) {
            console.log(serItem.riskLevel)
            return serItem.riskLevel
          }
          return ''
        })
        item.riskLevel = Math.max.apply(null,arr) + ''
        this.$forceUpdate()
      }, 500);
      this.$forceUpdate()
    },
    addRow(item) {
      item.specialRiskMeasureList.push({
        controlMeasure: '',
        deadline: '',
        reponsibleDept: null,
      })
      this.$forceUpdate()
    },
    delCol(index, item) {
      item.specialRiskMeasureList.splice(index, 1)
      this.$forceUpdate()
    },
    async dictChange(val, item, key, itemHazard) {
      console.log(key)
      if(!!itemHazard) { itemHazard[key] = val } else { item[key] = val }
      if (key == 'possibleRisks') {
        await this.querySeriousness(item.possibleRisks, item)
        item.hazardList.map(serItem => {
          if(serItem.possibility !== '') {
            this.queryRiskLevel(serItem.possibility, item.seriousness, serItem);
          }
        })
      }
      if (key == 'possibility') {
        await this.queryRiskLevel(itemHazard.possibility, item.seriousness, itemHazard);
      }
      setTimeout(() => {
        const arr = item.hazardList.map(serItem => {
          if(serItem.riskLevel !== '' && serItem.riskLevel !== null && serItem.riskLevel !== undefined) {
            console.log(serItem.riskLevel)
            return serItem.riskLevel
          }
          return ''
        })
        item.riskLevel = Math.max.apply(null,arr) + ''
        this.$forceUpdate()
      }, 500);
      this.$forceUpdate()
    },
    deptChange(val, row) {
      row.reponsibleDept = val
      this.$forceUpdate()
    },
    deptAnalysisChange(val, key) {
      this.data[key] = val
      this.$forceUpdate()
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val
      this.$forceUpdate()
    },
    ideUnitChange(val) {
      this.data.identificationUnit = val
      this.$forceUpdate()
    },
    /**查询风险 */
    async queryRiskLevel(possibility, seriousness, item) {
      if (!!possibility && !!seriousness) {
        await getKeyRiskLevel(possibility, seriousness).then((res) => {
          if (res.code == '200') {
            /* item.possibility = res.obj.possibility;
            item.seriousness = res.obj.seriousness; */
            item.riskLevel = `${res.obj}`
            this.$forceUpdate()
          }
        })
      }
    },
    /* 根据风险查询严重性 */
    async querySeriousness(possibility, item) {
      if (!!possibility) {
        await getKeyRiskSeriousnessLevel(possibility).then((res) => {
          if (res.code == '200') {
            /* item.possibility = res.obj.possibility;
            item.seriousness = res.obj.seriousness; */
            item.seriousness = `${res.obj}`
            this.$forceUpdate()
          }
        })
      }
    },
    chooseRiskLevel1(val, item) {
      if (this.riskLevel1List.length > 0) {
        let list = this.riskLevel1List.filter((r) => r.value == val)
        if (list && list.length > 0) {
          this.riskLevel2List = list[0].children
        }
        item.riskLevel2 = this.riskLevel2List[0].value
        this.chooseRiskLevel2(item.riskLevel2, item)
      }
    },
    chooseRiskLevel2(val, item) {
      let list = this.totalhazardList.filter((r) => r.cateValue == val)
      if (list && list.length > 0) {
        this.hazardList = list
      }
      item.hazard = this.hazardList[0] ? this.hazardList[0].diskNo : ''
      this.$forceUpdate()
    },
    changeAppliance(val, item) {
      if(val=='0') {
        item.disabledRisk = false
      } else {
        item.disabledRisk = true
      }
      this.specialRiskMeasureKey = !this.specialRiskMeasureKey
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss" scoped>
.info {
  /deep/ .el-form-item__content {
    min-width: 200px;
  }
}
.info2 {
  /deep/ .el-form-item__content {
    min-width: 140px;
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
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
  margin: 0;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.chead {
  /deep/ .el-card__header {
    padding: 5px 20px;
  }
  .hslot {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>