<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'抄送'"
    custom-class="big_dialog"
  >
    <!-- 人员列表 -->
    <el-row :gutter="16">
      <el-col :span="8">
        <el-table
          v-loading="tbloading"
          :data="data.manager||[]"
          size="mini"
          @selection-change="selection1Change"
        >
          <el-table-column label="总经理">
            <el-table-column type="selection" />
            <el-table-column label="姓名" prop="realname" />
            <el-table-column label="工号" prop="sqlUserId" />
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table
          v-loading="tbloading"
          :data="data.qualityManger||[]"
          size="mini"
          @selection-change="selection2Change"
        >
          <el-table-column label="质量经理/安全质量副总/副总经理">
            <el-table-column type="selection" />
            <el-table-column label="姓名" prop="realname" />
            <el-table-column label="工号" prop="sqlUserId" />
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table
          v-loading="tbloading"
          :data="data.productManger||[]"
          size="mini"
          @selection-change="selection3Change"
        >
          <el-table-column label="生产经理">
            <el-table-column type="selection" />
            <el-table-column label="姓名" prop="realname" />
            <el-table-column label="工号" prop="sqlUserId" />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-form size="mini" class="mt" label-width="auto">
      <el-form-item label="自定义消息">
        <el-input v-model="message" type="textarea" rows="3" style="width:100%"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryFillCC } from "@/api/risk";
export default {
  data() {
    return {
      loading: false,
      tbloading: false,
      dialog: false,
      data: {},
      message: '',
      selection1: [],
      selection2: [],
      selection3: [],
    };
  },
  props: ["deptPath"],
  watch: {
    dialog(val) {
      if (val) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      this.tbloading = true;
      queryFillCC(this.deptPath).then(res => {
        this.tbloading = false;
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.data = res.obj;
        }
      })
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      let params = {
        sqlUserId: [...this.selection1, ...this.selection2, ...this.selection3].join(','),
        msg: this.message
      }
      this.$emit('subCC', params);
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    selection1Change(selection) {
      this.selection1 = selection.map(r => r.sqlUserId);
    },
    selection2Change(selection) {
      this.selection2 = selection.map(r => r.sqlUserId);
    },
    selection3Change(selection) {
      this.selection3 = selection.map(r => r.sqlUserId);
    }
  },
};
</script>

<style lang="scss" scoped>
.mt {
  margin-top: 10px;
}
</style>

