<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="选择审核人"
  >
    <emplotee :value="sqlUserId" @change="empChange" />
    <span style="color:red">*不选则默认所有人</span>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import emplotee from '@/components/Emplotee'
export default {
  components: { emplotee },
  data() {
    return {
      loading: false,
      dialog: false,
      sqlUserId: ""
    };
  },
  props: {

  },
  created() { },
  methods: {

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
    empChange(val) {
      this.sqlUserId = val;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

