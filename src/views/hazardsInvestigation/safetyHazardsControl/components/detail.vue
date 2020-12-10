<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
    custom-class="big_dialog"
  >
    <el-form ref="form" size="mini" inline label-width="80px">
      <el-row class="fill-row">
        <el-col :span="24">
          <el-form-item label="隐患名称">
            <el-input
              v-model="data.hiddenName"
              placeholder
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="编号">
        <el-input v-model="data.no" style="width: 140px" disabled></el-input>
      </el-form-item>
      <el-form-item label="发现时间">
        <el-date-picker
          v-model="data.findTime"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          :disabled="disabled"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="来源">
        <dictSelect
          type="data_source"
          :value="data.source"
          @change="dictChange($event,item,'source')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="类型">
        <dictSelect
          type="hazard_source"
          :value="data.type"
          @change="dictChange($event,item,'type')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="等级">
        <dictSelect
          type="hidden_danger_level"
          :value="data.levels"
          @change="dictChange($event,item,'levels')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="涉及业务">
        <dictSelect
          type="product"
          :value="data.involveBusiness"
          @change="dictChange($event,item,'involveBusiness')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="涉及流程">
        <dictSelect
          type="system"
          :value="data.involveProcess"
          @change="dictChange($event,item,'involveProcess')"
          style="width: 140px"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="监管单位">
        <el-input
          placeholder="请输入内容"
          v-model="data.supervisoryUnit"
          class="input-with-select"
          :disabled="disabled"
        >
          <template slot="append">
            <dictSelect
              type="supervisory_unit"
              :value="data.supervisoryUnit"
              @change="dictChange($event,item,'supervisoryUnit')"
              style="width: 38px"
              :clearable="false"
              :disabled="disabled"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="整改进展">
        <el-select
          v-model="data.rectificationProgress"
          placeholder
          style="width: 140px"
          :disabled="disabled"
        >
          <el-option label="正在整改" value="正在整改"></el-option>
          <el-option label="关闭" value="关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-row class="fill-row" :gutter="16">
        <el-col :span="12">
          <el-form-item label="原因分析">
            <el-input
              v-model="data.reasonAnalysis"
              placeholder
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="治理效果验证标准">
            <el-input
              v-model="data.verificationFollowUp"
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="等效措施">
            <el-input
              v-model="data.equivalentMeasures"
              placeholder
              type="textarea"
              rows="3"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="data.remarks" type="textarea" rows="3" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--表格渲染-->
    <el-table :data="data.controlList" size="small" style="width: 100%" max-height="400px">
      <el-table-column type="index" width="50" />
      <el-table-column label="整改措施" prop="measures"></el-table-column>
      <el-table-column label="责任人" prop="responsiblePerson"></el-table-column>
      <el-table-column label="整改时限" prop="deadline"></el-table-column>
      <el-table-column label="措施实施情况跟踪" prop="implementationOfMeasures"></el-table-column>
      <el-table-column label="治理结果情况跟踪" prop="governanceResults"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dictSelect from '@/components/common/dictSelect'
export default {
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      disabled: true,
      data: {},
    };
  },
  props: {},
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    dictChange(val, row, key) {
      row[key] = val;
    },
  }
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
/deep/ .is-disabled .el-input__inner,
/deep/ .is-disabled .el-textarea__inner {
  color: #000;
}
</style>
