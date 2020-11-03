<template>
  <el-card header="填报">
    <p class="title">
      <b>{{titleForm.title}}</b>
    </p>
    <el-form ref="titleForm" size="mini" label-width="auto" inline>
      <el-form-item label="填表人">
        <span class="readonly">{{titleForm.reportName}}</span>
      </el-form-item>
      <el-form-item label="填表日期">
        <span class="readonly">{{titleForm.reportDate}}</span>
      </el-form-item>
      <el-form-item label="批准人" v-if="!!titleForm.approverName">
        <span class="readonly">{{titleForm.approverName}}</span>
      </el-form-item>
      <el-form-item label="批准日期" v-if="!!titleForm.approveDate">
        <span class="readonly">{{titleForm.approveDate}}</span>
      </el-form-item>
    </el-form>
    <!-- 填报 -->
    <el-button
      type="info"
      size="mini"
      style="margin-bottom: 10px"
      @click="addRow"
      v-if="!disabled"
    >新增</el-button>
    <el-card style="margin-bottom: 20px" v-for="(item, index) in fillinData" :key="index">
      <el-form ref="form" size="mini" inline label-width="80px">
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="隐患名称">
              <el-input
                v-model="item.hiddenName"
                placeholder
                style="width: 930px"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="编号">
          <el-input v-model="item.no" style="width: 140px" disabled></el-input>
        </el-form-item>
        <el-form-item label="发现时间">
          <el-date-picker
            v-model="item.findTime"
            value-format="yyyy-MM-dd"
            style="width: 140px"
            :disabled="disabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="来源">
          <dictSelect
            type="data_source"
            :value="item.source"
            @change="dictChange($event,item,'source')"
            style="width: 140px"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="类型">
          <dictSelect
            type="hazard_source"
            :value="item.type"
            @change="dictChange($event,item,'type')"
            style="width: 140px"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="等级">
          <dictSelect
            type="hidden_danger_level"
            :value="item.levels"
            @change="dictChange($event,item,'levels')"
            style="width: 140px"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="涉及业务">
          <dictSelect
            type="product"
            :value="item.involveBusiness"
            @change="dictChange($event,item,'involveBusiness')"
            style="width: 140px"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="涉及流程">
          <dictSelect
            type="system"
            :value="item.involveProcess"
            @change="dictChange($event,item,'involveProcess')"
            style="width: 140px"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="监管单位">
          <el-input v-model="item.supervisoryUnit" style="width: 140px" :disabled="disabled"></el-input>
        </el-form-item>
        <el-row class="fill-row" :gutter="16">
          <el-col :span="12">
            <el-form-item label="原因分析">
              <el-input
                v-model="item.reasonAnalysis"
                placeholder
                type="textarea"
                rows="3"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="item.remarks" type="textarea" rows="3" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="治理效果验证标准">
              <el-input
                v-model="item.verificationFollowUp"
                type="textarea"
                rows="3"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="整改进展">
              <el-input
                v-model="item.rectificationProgress"
                type="textarea"
                rows="3"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="info"
        size="mini"
        style="margin-bottom: 10px"
        @click="addItemRow(item)"
        v-if="!disabled"
      >新增一行</el-button>
      <!--表格渲染-->
      <el-table :data="item.controlList" size="small" style="width: 100%" max-height="400px">
        <el-table-column type="index" width="50" />
        <el-table-column label="等效措施">
          <template slot-scope="scope">
            <el-input v-model="scope.row.measures" size="mini" placeholder :disabled="disabled"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="责任人">
          <template slot-scope="{row}">
            <el-button
              :disabled="disabled"
              type="text"
              @click="PersonClick(row)"
            >{{!!row.realname?`${row.realname}[${row.responsiblePerson}]`:'请选择'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="整改时限">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.deadline"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:100%"
              :disabled="disabled"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="nn" label="措施实施情况跟踪">
          <template slot-scope="scope">
            <el-input v-model="scope.row.implementationOfMeasures" size="mini" :disabled="disabled"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="oo" label="治理结果情况跟踪">
          <template slot-scope="scope">
            <el-input v-model="scope.row.governanceResults" size="mini" :disabled="disabled"></el-input>
          </template>
        </el-table-column>
        <el-table-column label width="80" v-if="!disabled">
          <template slot-scope="{ $index }">
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="delItemRow(item, $index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="del" v-if="!disabled">
        <el-button type="danger" size="small" icon="el-icon-delete" @click="delRow(index)">删除</el-button>
      </div>
    </el-card>
    <emplotee ref="emplotee" @subPerson="subPerson" />
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { formatShortDate } from '@/utils/datetime'
import dictSelect from '@/components/common/dictSelect'
import emplotee from './person'
import { getNo } from '@/api/hazards'
import { eventBus } from '@/utils/eventBus'

export default {
  components: { dictSelect, emplotee },
  data() {
    return {
      loading: false,
      dialog: false,
      titleForm: {
        reportName: '',
        reportDate: formatShortDate(new Date()),
        title: "",
        approverName: "",
        approveDate: ""
      },
      fillinData: [],
    };
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.titleForm.title = this.data.controlListName;
      }
    }
  },
  created() {
    this.titleForm.reportName = this.userInfo.realname;
        this.titleForm.title = this.data.controlListName;
  },
  mounted() {
    eventBus.$on("accept-source", (data) => {
      // 循环获取编号
      data.map(item => {
        getNo(this.data.deptPath).then(res => {
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.fillinData.push({ ...item, no: res.obj });
          }
        })
      })
    });
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    formatShortDate,
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      //   this.$refs["form"].resetFields();
      this.fillinData = [];
    },
    addRow(e) {
      getNo(this.data.deptPath).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.fillinData.push({
            controlList: [
              {
                deadline: "",
                governanceResults: "",
                implementationOfMeasures: "",
                measures: "",
                responsiblePerson: "",
                realname: ''
              }
            ],
            deptPath: "",
            findTime: "",
            hiddenName: "",
            involveBusiness: "",
            involveProcess: "",
            levels: "",
            no: res.obj,
            reasonAnalysis: "",
            rectificationProgress: "",
            remarks: "",
            source: "",
            supervisoryUnit: "",
            type: "",
            verificationFollowUp: ""
          });
        }
      })

    },
    delRow(index) {
      this.fillinData.splice(index, 1);
    },
    addItemRow(item) {
      item.controlList.push({
        deadline: "",
        governanceResults: "",
        implementationOfMeasures: "",
        measures: "",
        responsiblePerson: "",
        realname: ''
      });
    },
    delItemRow(item, index) {
      item.controlList.splice(index, 1);
    },
    dictChange(val, row, key) {
      row[key] = val;
    },
    PersonClick(row) {
      let _this = this.$refs.emplotee;
      _this.item = row;
      _this.dialog = true;
    },
    subPerson(user, row) {
      row.realname = user.realname;
      row.responsiblePerson = user.sqlUserId;
    }
  },
};
</script>


<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 18px;
  margin-top: 0;
}
.readonly {
  width: 150px;
  display: inline-block;
}
.del {
  padding: 10px 0 0;
  text-align: center;
}
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
/deep/ .is-disabled {
  .el-input__inner,
  .el-textarea__inner {
    color: #000;
  }
}
</style>
