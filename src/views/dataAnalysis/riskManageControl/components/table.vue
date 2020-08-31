<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="筛选表格"
    custom-class="big_dialog"
  >
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="安全风险" />
      <el-table-column prop="bb" label="风险等级" />
      <el-table-column prop="cc" label="责任单位" />
      <el-table-column prop="dd" label="详情" />
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      loading: false,
      dialog: false
    };
  },
  props: {},
  created() {
    this.loading = false;
    this.data = [
      {
        aa: "飞机在运行过程中出现大翼引气渗漏等重复性故",
        bb: "3",
        cc: "杭州、上海、武汉",
        dd: "详情"
      },
      {
        aa: "飞机在运行过程中出现大翼引气渗漏等重复性故",
        bb: "3",
        cc: "杭州、上海、武汉",
        dd: "详情"
      },
      {
        aa: "飞机在运行过程中出现大翼引气渗漏等重复性故",
        bb: "3",
        cc: "杭州、上海、武汉",
        dd: "详情"
      }
    ];
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.dialog = false;
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: ""
      };
      this.roleSelect = [];
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0];
      }
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        let obj = {
          id: ""
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    }
  }
};
</script>

<style scoped>
</style>

<style lang="scss">
.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
