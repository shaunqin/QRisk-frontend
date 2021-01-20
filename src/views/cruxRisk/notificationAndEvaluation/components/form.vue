<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      size="small"
      label-width="100px"
    >
      <el-row :gutter="16">
        <el-col :span="12" v-if="isAdd">
          <el-form-item label="类型">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option label="通知" value="1"></el-option>
              <el-option label="评估" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期">
                <el-date-picker
                  v-model="form.endTime"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" v-if="form.type != '2'" key="noteContent">
          <el-form-item label="通知内容">
            <el-input
              v-model="form.noteContent"
              style="width: 100%"
              type="textarea"
              rows="4"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="releasePath" label="发起部门">
            <el-select v-model="form.releasePath" style="width: 100%">
              <el-option
                v-for="item in deptList"
                :key="item.deptPath"
                :label="item.deptNameCn"
                :value="item.deptPath"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="issueDepts" key="issueDepts">
            <template slot="label">
              {{ form.type != '2' ? '下发部门' : '分析单位' }}
            </template>
            <deptByRole
              v-if="form.type != '2'"
              :value="form.issueDepts"
              :deptPath="form.releasePath"
              :multiple="true"
              :url="'/risk_mgr/special_risk_notice_mgr/query/depts'"
              @change="deptChange($event, 'issueDepts')"
            ></deptByRole>
            <department
              v-else
              class="form-dept-tree mini"
              :value="form.issueDepts"
              @change="deptChange($event, 'issueDepts')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件">
            <eupload @success="success"></eupload>
            <span v-for="(item, index) in form.file" :key="index">
              <el-link
                type="primary"
                v-show="item != null"
                :href="getUrl(item ? item.filePath : '')"
                target="_blank"
                >{{ item ? item.originFileName : '' }}</el-link
              >
              <el-popconfirm title="确定删除该附件吗？" @onConfirm="del(item)">
                <i
                  class="el-icon-delete"
                  style="cursor: pointer; margin-right: 10px"
                  slot="reference"
                ></i>
              </el-popconfirm>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 风险清单 -->
      <el-card header="风险" key="2" style="margin-top: 20px">
        <el-badge :value="form.keyRiskLists.length">
          <el-button
            type="primary"
            size="mini"
            @click="addRisk"
            style="margin-bottom: 10px"
            >新增风险</el-button
          >
        </el-badge>
        <el-card
          shadow="never"
          v-for="(item, index) in form.keyRiskLists"
          :key="index"
          class="chead"
        >
          <div slot="header" class="clearfix">
            <span>风险{{ index + 1 }}</span>
            <span style="margin: 0px 15px">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delRisk(index)"
                >{{ '删除风险' + (index + 1) }}</el-button
              >
            </span>
          </div>
          <el-form size="mini" inline label-width="70px" :key="index">
            <el-form-item label="可能导致的风险" label-width="125px">
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
                :value="item.seriousness"
                :showName="true"
                :disabled="true"
                style="width: 178px"
                type="severity_level"
                @change="dictChange($event, item, 'seriousness')"
              />
            </el-form-item>
            <el-form-item label="风险等级" v-if="form.type=='2'">
              <dict-select
                :value="item.riskLevel"
                type="risk_level"
                @change="dictChange($event, item, 'riskLevel')"
                style="width: 178px"
                :disabled="true"
              />
            </el-form-item>
          </el-form>
          <el-badge v-if="form.type == '2'" :value="item.hazardList.length">
            <el-button
              type="primary"
              size="mini"
              @click="addHazard(item)"
              style="margin-bottom: 10px"
              >新增危险源</el-button
            >
          </el-badge>
          <div v-if="form.type == '2'">
            <el-card
              shadow="never"
              v-for="(itemHazard, indexHazard) in item.hazardList"
              :key="indexHazard"
            >
              <div slot="header" class="clearfix">
                <span>危险源{{ indexHazard + 1 }}</span>
                <span style="float: right">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delHazard(item, indexHazard)"
                    >{{ '删除危险源' + (indexHazard + 1) }}</el-button
                  >
                </span>
              </div>
              <el-form size="mini" inline label-width="70px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="危险源描述" label-width="100px">
                      <el-input
                        v-model="itemHazard.hazardSource"
                        type="textarea"
                        rows="2"
                        style="width: 178px"
                        @input="$forceUpdate()"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="可能性">
                      <dict-select
                        :clearable="false"
                        :showName="true"
                        :value="itemHazard.possibility"
                        type="probability_level"
                        @change="
                          dictChange($event, item, 'possibility', itemHazard)
                        "
                        style="width: 178px"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="风险等级">
                      <dict-select
                        :value="itemHazard.riskLevel"
                        type="risk_level"
                        @change="dictChange($event, itemHazard, 'riskLevel')"
                        style="width: 178px"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- 风险表格 -->
              <el-button
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
              >
                <el-table-column type="index" width="50" />
                <el-table-column label="控制措施">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.controlMeasure"
                      type="textarea"
                      rows="3"
                      @input="$forceUpdate()"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="责任单位">
                  <template slot-scope="scope">
                    <!-- <deptByRole
                      :value="scope.row.reponsibleDept"
                      :deptPath="form.type == '2' ? form.issueDepts : ''"
                      :multiple="true"
                      @change="srmDeptChange($event, scope.row)"
                      :url="'/risk_mgr/special_risk_notice_mgr/query/depts'"
                    /> -->
                    <department
                      :value="scope.row.reponsibleDept"
                      :multiple="true"
                      :path="form.type == '2' ? form.issueDepts : ''"
                      @change="srmDeptChange($event, scope.row)"
                      :url="'/risk_mgr/key_risk_mgr/query/tree'"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="完成期限">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.deadline"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      style="max-width: 100%"
                      @change="$forceUpdate()"
                    ></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column width="80">
                  <template slot-scope="{ $index }">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click="delCol($index, itemHazard)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-card>
      </el-card>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(false)">{{
        form.type == '2' ? '暂存' : '确认'
      }}</el-button>
      <el-button
        v-if="form.type == '2'"
        type="success"
        @click="doSubmit(true)"
        :loading="loading"
        >提交</el-button
      >
    </div>
    <!-- <selectEmplotee ref="selectEmplotee" @on-submit="doSubmit" /> -->
  </el-dialog>
</template>

<script>
import { delUpload } from '@/api/upload'
import {
  keyRiskAdd,
  keyRiskModify,
  getKeyRiskSeriousnessLevel,
  getKeyRiskLevel,
  querySpeRiskMgrDept,
} from '@/api/risk'
import { queryDictByName } from '@/api/dict'
import { queryHazardList } from '@/api/standard'
import { deepClone } from '@/utils/index'
import department from '@/components/Department/index'
import deptByRole from '@/components/Department/deptByRole'
import dictSelect from '@/components/common/dictSelect'
import eupload from '@/components/Upload/index'
// import selectEmplotee from './selectEmplotee'

export default {
  components: { department, deptByRole, dictSelect, eupload },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        title: '', // 标题
        endTime: '', // 截止日期
        noteContent: '', // 通知内容
        issueDepts: null, // 下发部门
        releasePath: '', // 发起部门
        type: '1', // 类别,1:通知,2:评估
        keyRiskLists: [],
        file: [],
      },
      riskLevel1List: [],
      riskLevel2List: [],
      totalhazardList: [], // 全部危险源
      hazardList: [], // 危险源
      possibleRisksList: [], // 可能导致的风险列表
      deptList: [],
      formRules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        issueDepts: [
          { required: true, message: '部门/单位不能为空', trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    'form.type'(val) {
      this.form.issueDepts = null
    },
    'form.releasePath'(val) {
      if (this.form.type == '1') {
        this.form.issueDepts = null
      }
    },
    'form.issueDepts'(val) {
      if (this.form.keyRiskLists.length > 0) {
        this.form.keyRiskLists.map(item => {
          if (item.hazardList.length > 0) {
            item.hazardList.map(hazadItem => {
              if(hazadItem.specialRiskMeasureList.length > 0) {
                hazadItem.specialRiskMeasureList.map(specialItem => {
                  specialItem.reponsibleDept = null
                })
              }
            })
          }
        })
      }
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
    // 发起部门
    querySpeRiskMgrDept().then((res) => {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        if (res.obj.length > 0) {
          this.deptList = res.obj
          // 设置默认选中
          if (res.obj.length > 0) {
            this.form.releasePath = res.obj[0].deptPath
          }
        }
      }
    })
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit(sqlUserId) {
      if (!this.form.issueDepts || !this.form.title)
        return this.$message.error('请填写完整！')
      this.loading = true
      if (this.isAdd) {
        this.doAdd(sqlUserId)
      } else this.doModify(sqlUserId)
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let _this = this.$refs.selectEmplotee
          // _this.id = this.selections[0];
          _this.dialog = true
        } else {
          this.$message.error('请填写完整！')
        }
      })
    },
    doAdd(sqlUserId) {
      let submit
      let issueDepts = []
      let params = { ...this.form, submit: submit }
      params = deepClone(params)
      if (this.form.type == '2') {
        params.submit = sqlUserId ? '1' : '2'
        params.analysisDept = this.form.issueDepts
        params.issueDepts = []
        this.changeReponsibleDept(params)
      } else {
        params.issueDepts = this.form.issueDepts
        params.analysisDept = ''
        params.keyRiskLists.map(item => {
          item.riskLevel = ''
        })
      }
      keyRiskAdd(params)
        .then((res) => {
          if (res.code === '200') {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.resetForm()
            this.$parent.init()
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    doModify(sqlUserId) {
      let submit
      let issueDepts = []
      let params = { ...this.form, submit: submit }
      params = deepClone(params)
      if (this.form.type == '2') {
        params.submit = sqlUserId ? '1' : '2'
        params.analysisDept = this.form.issueDepts
        params.issueDepts = []
        this.changeReponsibleDept(params)
      } else {
        params.issueDepts = this.form.issueDepts
        params.analysisDept = ''
        params.keyRiskLists.map(item => {
          item.riskLevel = ''
        })
      }
      keyRiskModify(params)
        .then((res) => {
          if (res.code === '200') {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            this.resetForm()
            this.$parent.init()
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    changeReponsibleDept(params) {
      if (params.keyRiskLists.length > 0) {
        params.keyRiskLists.map(item => {
          if (item.hazardList.length > 0) {
            item.hazardList.map(hazadItem => {
              if(hazadItem.specialRiskMeasureList.length > 0) {
                hazadItem.specialRiskMeasureList.map(specialItem => {
                  if(specialItem.reponsibleDept.length>0) {
                    let str = ''
                    specialItem.reponsibleDept.map((reponsItem, index) => {
                      if(index == 0) {
                        str = reponsItem
                      } else {
                        str = str + ',' + reponsItem
                      }
                    })
                    specialItem.reponsibleDept = str
                  }
                })
              }
            })
          }
        })
      }
      // return params
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        title: '', // 标题
        endTime: '', // 截止日期
        noteContent: '', // 通知内容
        issueDepts: null, // 下发部门
        releasePath: this.deptList.length > 0 ? this.deptList[0].deptPath : '',
        assType: '', // 评估类别
        analysisTitle: '', // 分析标题
        analysisNo: '', // 分析编号
        analysisDept: null, // 分析单位
        analysis: '', // 分析人
        approval: '', // 批准
        approvalDate: '', // 批准日期
        type: '1', // 类别,1:通知,2:评估
        keyRiskLists: [],
        file: [],
      }
    },
    deptChange(val, key) {
      this.form[key] = val
      this.$forceUpdate()
    },
    deptChangeOnTb(val, row) {
      row.reponsibleUnit = val
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
      if (!!itemHazard) {
        itemHazard[key] = val
      } else {
        item[key] = val
      }
      if (key == 'possibleRisks') {
        await this.querySeriousness(item.possibleRisks, item)
        item.hazardList.map((serItem) => {
          if (serItem.possibility !== '') {
            this.queryRiskLevel(serItem.possibility, item.seriousness, serItem)
          }
        })
      }
      if (key == 'possibility') {
        await this.queryRiskLevel(
          itemHazard.possibility,
          item.seriousness,
          itemHazard
        )
      }
      setTimeout(() => {
        const arr = item.hazardList.map(serItem => {
          if(serItem.riskLevel !== '' && serItem.riskLevel !== null && serItem.riskLevel !== undefined) {
            return serItem.riskLevel
          }
          return ''
        })
        item.riskLevel = Math.max.apply(null,arr) + ''
        if(item.riskLevel == '-Infinity') item.riskLevel = '1'
        this.$forceUpdate()
      }, 500);
      this.$forceUpdate()
    },
    addRisk() {
      if (this.form.type == '1') {
        this.form.keyRiskLists.push({
          possibleRisks: '',
          riskLevel: '1',
          seriousness: '',
          appliance: '0',
          hazardList: [],
        })
      } else {
        this.form.keyRiskLists.push({
          possibleRisks: '',
          riskLevel: '1',
          seriousness: '',
          appliance: '0',
          hazardList: [
            {
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
            },
          ],
        })
      }
      this.$forceUpdate()
    },
    delRisk(index) {
      this.form.keyRiskLists.splice(index, 1)
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
            return serItem.riskLevel
          }
          return ''
        })
        item.riskLevel = Math.max.apply(null,arr) + ''
        if(item.riskLevel == '-Infinity') item.riskLevel = '1'
        this.$forceUpdate()
      }, 500);
      this.$forceUpdate()
    },
    srmDeptChange(val, row) {
      row.reponsibleDept = val
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
        this.$forceUpdate()
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
    success(res) {
      if (res.code != '200') {
        this.$message.error(res.msg)
      } else {
        this.form.file = this.form.file ? this.form.file : []
        this.form.file.push(res.obj)
        this.$forceUpdate()
      }
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url
    },
    del(item) {
      delUpload(item.id).then((res) => {
        if (res.code != '200') {
          this.$message.error(res.msg)
        } else {
          this.$message.success('删除成功！')
          this.form.file.splice(
            this.form.file.indexOf(
              this.form.file.find(function (element) {
                return element.id === item.id
              })
            ),
            1
          )
          this.$forceUpdate()
        }
      })
    },
  },
}
</script>


<style lang="scss" scope>
.mb-10 {
  margin-bottom: 10px;
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
