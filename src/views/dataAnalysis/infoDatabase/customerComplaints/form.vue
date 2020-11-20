<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? $t('global.add') : $t('global.edit')"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item :label="$t('analysis.infoSource')" prop="infoSource">
            <dict-select
              :value="form.infoSource"
              type="info_source_customer"
              @change="dictChange($event,'infoSource',form)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('analysis.happenDate')" prop="happenDate">
            <el-date-picker v-model="form.happenDate" placeholder style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('analysis.place')" prop="place" label-width="70px">
            <el-input
              v-model="form.place"
              style="width: 100%;"
              :placeholder="$t('analysis.placrPhd')"
              @blur="checkPlace"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('analysis.aircraftType')" label-width="70px">
            <dict-select
              :value="form.aircraftType"
              type="aircraft"
              @change="dictChange($event,'aircraftType',form)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('analysis.title')" prop="title">
            <el-input v-model="form.title" style="width: 100%;" />
          </el-form-item>
          <el-form-item :label="$t('analysis.eventOverview')" prop="eventOverview">
            <el-input v-model="form.eventOverview" type="textarea" rows="3" style="width: 100%;" />
          </el-form-item>
          <el-form-item :label="$t('analysis.risk')" prop="risk">
            <risk-select :value="form.risk" @change="riskChange" style="width: 50%;"></risk-select>
          </el-form-item>
          <el-form-item :label="$t('analysis.fileUpload')">
            <eupload @success="uploadSuccess"></eupload>
          </el-form-item>
          <el-form-item label>
            <el-table :data="files" size="mini">
              <el-table-column :label="$t('analysis.fileName')" prop="originFileName" />
              <el-table-column :label="$t('analysis.fileSize')">
                <template slot-scope="{row}">{{(row.fileSize/1024).toFixed(2)}}Kb</template>
              </el-table-column>
              <el-table-column :label="$t('global.operation')" width="100px">
                <template slot-scope="{row,$index}">
                  <el-tooltip :content="$t('analysis.preview')" placement="left">
                    <el-link type="primary" :underline="false" :href="row.url" target="_blank">
                      <svg-icon icon-class="eye-open"></svg-icon>
                    </el-link>
                  </el-tooltip>&nbsp;&nbsp;
                  <el-button type="text" icon="el-icon-delete" @click="delFile($index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card v-for="(row,index) in data" :key="index" style="margin-bottom:20px">
        <el-form-item :label="$t('analysis.causeAnalysis')">
          <el-input v-model="row.causeAnalysis" placeholder type="textarea" rows="4"></el-input>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="$t('analysis.department')">
              <department :value="row.responsibleUnit" @change="deptChange($event,row)"></department>
            </el-form-item>
            <el-form-item :label="$t('analysis.riskLevel1')" label-width="100px">
              <el-select
                clearable
                v-model="row.riskLevel1"
                placeholder
                style="width: 100%;"
                @change="row.riskLevel2= row.sourceOfRisk=''"
              >
                <el-option
                  v-for="item in riskLevel1List"
                  :key="item.key"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('analysis.product')">
              <dict-select
                :value="row.product"
                type="product"
                @change="dictChange($event,'product',row)"
              />
            </el-form-item>
            <el-form-item :label="$t('analysis.riskLevel2')" label-width="100px">
              <riskLevel2CP
                :value="row.riskLevel2"
                :list="riskLevel1List"
                :riskLevel1="row.riskLevel1"
                @change="riskLevel2Change($event,row)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('analysis.system')">
              <dict-select
                :value="row.systemCode"
                type="system"
                @change="dictChange($event,'systemCode',row)"
              />
            </el-form-item>
            <el-form-item :label="$t('analysis.sourceOfRisk')">
              <el-select
                clearable
                filterable
                v-model="row.sourceOfRisk"
                placeholder
                style="width: 100%;"
              >
                <el-option
                  v-for="item in riskList.filter(r=>r.cateValue==row.riskLevel2)"
                  :key="item.diskNo"
                  :label="item.diskName"
                  :value="item.diskNo"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('analysis.incentive')">
          <incentive-select :value="row.incentive" @change="incentiveChange($event,row)"></incentive-select>
        </el-form-item>
        <el-form-item label style="text-align: center;">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delRows(index)"
          >{{$t('global.delete')}}</el-button>
        </el-form-item>
      </el-card>
      <el-form-item>
        <el-button
          type="info"
          size="mini"
          icon="el-icon-plus"
          @click="addRow"
        >{{$t('analysis.addCauseAnalysis')}}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">{{$t('global.cancel')}}</el-button>
      <el-button :loading="loading" type="success" @click="doSave">{{$t('global.temporaryStorage')}}</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">{{$t('global.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfobase } from "@/api/infodb";
import { queryDictByName } from "@/api/dict";
import { queryHazardList } from "@/api/standard";
import department from "@/components/Department";
import riskSelect from "../components/riskSelect";
import incentiveSelect from "../components/incentiveSelect";
import dictSelect from "@/components/common/dictSelect";
import eupload from "@/components/Upload/index";
import riskLevel2CP from "../components/riskLevel2CP";
import { re } from '@/utils/config-re'

export default {
  components: {
    department,
    riskSelect,
    incentiveSelect,
    dictSelect,
    eupload,
    riskLevel2CP,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        infoSource: "",
        happenDate: "",
        place: "",
        aircraftType: "",
        title: "",
        eventOverview: "",
        risk: "",
        filesId: [],
        type: "8",
      },
      roleSelect: [],
      formRules: {
        infoSource: [
          { required: true, message: this.$t('analysis.rulesInfoSource'), trigger: "blur" },
        ],
        happenDate: [
          { required: true, message: this.$t('analysis.ruleshappenDate'), trigger: "blur" },
        ],
        title: [
          { required: true, message: this.$t('analysis.rulestitle'), trigger: "blur" },
        ],
        eventOverview: [
          { required: true, message: this.$t('analysis.ruleseventOverview'), trigger: "blur" },
        ],
        risk: [{ required: true, message: this.$t('analysis.rulesrisk'), trigger: "blur" }],
      },
      entArr: [],
      infobaseList: [],
      riskLevel1List: [],
      riskLevel2List: [],
      riskList: [],
      airList: [],
      files: [],
      data: [
        {
          riskLevel1: "",
          riskLevel2: "",
          sourceOfRisk: "",
          responsibleUnit: null,
          product: "",
          systemCode: "",
          causeAnalysis: "",
          incentive: "",
        },
      ],
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.loadData();
  },
  watch: {
    files(val) {
      if (val && val.length > 0) this.form.filesId = val.map((r) => r.id);
      else this.form.filesId = [];
    },
    form: {
      handler(val) {
        for (let x in val) {
          if (!!val[x]) {
            this.$refs.form.clearValidate(x);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    loadData() {
      //危险源层级
      queryDictByName("hazard_source").then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.riskLevel1List = res.obj[0].children;
        }
      });
      //危险源
      queryHazardList().then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.riskList = res.obj;
        }
      });
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          }
        }
      });
    },
    doSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.form.status = "1";
            this.doAdd();
          }
        }
      });
    },
    doAdd() {
      let subData = [];
      this.data.map((item) => {
        subData.push({
          ...this.form,
          ...item,
        });
      });
      addInfobase(subData)
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
        infoSource: "",
        happenDate: "",
        place: "",
        aircraftType: "",
        title: "",
        eventOverview: "",
        risk: "",
        type: "8",
      };
      this.files = [];
      // this.$refs.incentive.value1 = "";
      this.data = [
        {
          riskLevel1: "",
          riskLevel2: "",
          sourceOfRisk: "",
          responsibleUnit: null,
          product: "",
          systemCode: "",
          causeAnalysis: "",
          incentive: "",
        },
      ];
    },
    dictChange(val, key, row) {
      row[key] = val;
    },
    deptChange(val, row) {
      row.responsibleUnit = val;
    },
    riskChange(val) {
      this.form.risk = val;
    },
    incentiveChange(val, row) {
      row.incentive = val.join(",");
    },
    uploadSuccess(response) {
      console.log(response);
      this.files.push(response.obj);
    },
    delFile(index) {
      this.files.splice(index, 1);
    },
    addRow() {
      this.data.push({
        riskLevel1: "",
        riskLevel2: "",
        sourceOfRisk: "",
        responsibleUnit: null,
        product: "",
        systemCode: "",
        causeAnalysis: "",
        incentive: "",
      });
    },
    delRows(index) {
      this.data.splice(index, 1);
    },
    riskLevel2Change(val, row) {
      row.riskLevel2 = val;
      row.sourceOfRisk = "";
    },
    checkPlace(e) {
      let value = e.target.value;
      if (value) {
        if (!re.chinese.test(value)) {
          this.$message.error("地点请输入中文！");
          this.form.place = "";
        }
      }
    }
  },
};
</script>


<style lang="scss" scoped>
</style>
