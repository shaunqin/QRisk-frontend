<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="选择审核人"
  >
    <el-select v-model="sqlUserId" placeholder>
      <el-option
        v-for="item in data"
        :key="item.memberId"
        :label="`${item.realname}[${item.sqlUserId}]`"
        :value="item.sqlUserId"
      ></el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import emplotee from '@/components/Emplotee'
import { queryLeader } from '@/api/hazards'
export default {
  components: { emplotee },
  data() {
    return {
      loading: false,
      dialog: false,
      id: null,
      data: [],
      sqlUserId: ""
    };
  },
  props: {

  },
  watch: {
    dialog(val) {
      if (val) this.init()
    }
  },
  methods: {
    init() {
      queryLeader(this.id).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          this.data = res.obj;
          if (res.obj.length > 0) {
            this.sqlUserId = res.obj[0].sqlUserId
          }
        }
      })
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.loading = true;
      this.$emit('on-submit', this.sqlUserId);
      // this.resetForm();
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

