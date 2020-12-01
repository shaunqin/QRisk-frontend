<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="编辑单条管控清单"
    custom-class="big_dialog"
  >
    <el-form :model="form" ref="form" size="mini" inline label-width="80px">
      <el-row class="fill-row">
        <el-col :span="24">
          <el-form-item label="隐患名称">
            <el-input
              v-model="form.hiddenName"
              placeholder
              style="width: 930px"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="编号">
        <el-input v-model="form.no" style="width: 140px" disabled></el-input>
      </el-form-item>
      <el-form-item label="发现时间">
        <el-date-picker
          v-model="form.findTime"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          :disabled="disabled"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="来源">
        <dictSelect
          type="data_source"
          :value="form.source"
          @change="dictChange($event,form,'source')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="类型">
        <dictSelect
          type="hazard_source"
          :value="form.type"
          @change="dictChange($event,form,'type')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="等级">
        <dictSelect
          type="hidden_danger_level"
          :value="form.levels"
          @change="dictChange($event,form,'levels')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="涉及业务">
        <dictSelect
          type="product"
          :value="form.involveBusiness"
          @change="dictChange($event,form,'involveBusiness')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="涉及流程">
        <dictSelect
          type="system"
          :value="form.involveProcess"
          @change="dictChange($event,form,'involveProcess')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="监管单位">
        <el-input v-model="form.supervisoryUnit" style="width: 140px" :disabled="disabled"></el-input>
      </el-form-item>
      <el-row class="fill-row" :gutter="16">
        <el-col :span="12">
          <el-form-item label="原因分析">
            <el-input
              v-model="form.reasonAnalysis"
              placeholder
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remarks" type="textarea" rows="3" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="治理效果验证标准">
            <el-input
              v-model="form.verificationFollowUp"
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="整改进展">
            <el-input
              v-model="form.rectificationProgress"
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
      @click="addItemRow(form)"
      v-if="!disabled"
    >新增一行</el-button>
    <!--表格渲染-->
    <el-table :data="form.controlList" size="small" style="width: 100%" max-height="400px">
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
            :picker-options="{disabledDate:(date)=>new Date().getTime()>date.getTime()}"
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
            @click="delItemRow(form, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <emplotee ref="emplotee" :deptName="form.deptName" @subPerson="subPerson" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dictSelect from '@/components/common/dictSelect'
import emplotee from '../person'
import { modifyHiddenDanger } from '@/api/hazards'

export default {
  components: { dictSelect, emplotee },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {},
      formRules: {},
      disabled: false,
    };
  },
  props: {},
  created() { },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form)
          modifyHiddenDanger(this.form).then((res)=>{
            if(res.code!='200'){
              this.$message.error(res.msg);
            }else{
              this.$message.success("修改成功！");
              this.$parent.$parent.$refs.mine.init();
              this.resetForm();
            }
          })
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {};
      this.roleSelect = [];
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
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
