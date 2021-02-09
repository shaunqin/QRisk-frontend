<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="审批延期"
  >
    <el-table :data="data" size="mini" v-loading="loading">
      <el-table-column label="申请人">
        <template slot-scope="{row}">{{`${row.applyUsername}[${row.applyUser}]`}}</template>
      </el-table-column>
      <el-table-column label="部门" prop="dept" />
      <el-table-column label="延期日期" prop="delayDeadline" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="doApprove(row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <br />

    <el-form :model="form" size="mini" label-width="80px" v-if="form.formId">
      <el-form-item label>
        <el-radio-group v-model="form.processFlag">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.comment" placeholder="驳回必填" type="textarea" rows="3"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="doSubmit" :loading="sub_loading">确定</el-button>
      </el-form-item>
    </el-form>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>-->
  </el-dialog>
</template>

<script>
import { delayApproveList, delayApprove } from "@/api/hazards";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      loading: false,
      sub_loading: false,
      dialog: false,
      id: "",
      data: [],
      form: {
        processFlag: '',
        comment: '',
        formId: ''
      }
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        this.loadTable();
      }
    }
  },
  methods: {
    format,
    loadTable() {
      if (this.id) {
        this.loading = true;
        delayApproveList(this.id).then(res => {
          this.loading = false;
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.data = res.obj;
          }
        })
      }
    },
    doApprove(row) {
      this.form = {
        formId: row.id,
        processFlag: '',
        comment: ''
      }
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      if (this.form.processFlag == '2' && !this.form.comment) {
        this.$message.error("请输入驳回备注！");
        return
      }
      this.sub_loading = true;
      delayApprove(this.form).then(res => {
        this.sub_loading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          if (this.data.length == 1) {
            this.resetForm();
            this.$parent.init();
          } else {
            this.loadTable();
          }
        }
      })
    },
    resetForm() {
      this.dialog = false;
      this.id = "";
      this.form = {
        processFlag: '',
        comment: '',
        formId: ''
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.file-table {
  margin-top: 10px;
}
</style>
