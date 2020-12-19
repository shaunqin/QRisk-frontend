<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'提醒'"
  >
    <!-- 人员列表 -->
    <el-row :gutter="16">
      <el-col :span="24">
        <el-table
          v-loading="tbloading"
          :data="data"
          size="mini"
          @selection-change="selectionChange"
          row-key="sqlUserId"
          ref="table"
        >
          <el-table-column type="selection" />
          <el-table-column label="姓名" prop="realname" />
          <el-table-column label="工号" prop="sqlUserId" />
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
      <el-button :loading="loading" type="primary" @click="doSubmit" :disabled="!btnEnable">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDeptRiskManager } from "@/api/emplotee";
export default {
  data() {
    return {
      loading: false,
      tbloading: false,
      dialog: false,
      data: [],
      message: '',
      selection: [],
    };
  },
  props: {
    deptPath: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.init();
      }
    }
  },
  computed: {
    btnEnable() {
      if (this.multiple) {
        return this.selection.length > 0
      } else {
        return this.selection.length == 1
      }
    }
  },
  methods: {
    init() {
      this.tbloading = true;
      queryDeptRiskManager(this.deptPath).then(res => {
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
        sqlUserId: [...this.selection].join(','),
        msg: this.message
      }
      this.$emit('on-submit', params);
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.selection = [];
      this.message = "";
    },
    selectionChange(selection) {
      this.selection = selection.map(r => r.sqlUserId);
    },
  },
};
</script>

<style lang="scss" scoped>
.mt {
  margin-top: 10px;
}
</style>

