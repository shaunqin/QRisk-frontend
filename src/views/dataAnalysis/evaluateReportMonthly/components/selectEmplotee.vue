<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="选择审核人"
  >
    <el-select v-model="sqlUserId" clearable>
      <el-option
        v-for="item in data"
        :key="item.memberId"
        :label="`${item.realname}[${item.sqlUserId}]`"
        :value="item.sqlUserId"
      ></el-option>
    </el-select>
    <span style="color:red">*不选则默认所有人</span>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { riskControlQueryNextOperator } from '@/api/emplotee'
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      sqlUserId: "",
      data: []
    };
  },
  props: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      riskControlQueryNextOperator().then(res => {
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
      this.$emit('on-submit', this.sqlUserId);
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.sqlUserId = "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

