<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="详情"
  >
    <el-form ref="form" :model="form" size="small" label-width="60px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="编号">{{form.standardNo}}</el-form-item>
          <el-form-item label="名称">{{form.name}}</el-form-item>
          <el-form-item label="备注">{{form.remark}}</el-form-item>
          <el-form-item label="附件">
            <el-table :data="files" size="mini">
              <el-table-column label="文件名" prop="originFileName" />
              <el-table-column label="文件大小">
                <template slot-scope="{row}">{{(row.fileSize/1024).toFixed(2)}}Kb</template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="{row}">
                  <el-tooltip content="预览" placement="left">
                    <el-link
                      type="primary"
                      :underline="false"
                      :href="baseApi+row.filePath"
                      target="_blank"
                    >
                      <svg-icon icon-class="eye-open"></svg-icon>
                    </el-link>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOtherStand, modifyOtherStand } from "@/api/standard";
import eupload from "@/components/Upload/index";
export default {
  components: {
    eupload,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        standardNo: "",
        name: "",
        remark: "",
        enable: "",
        filesId: [],
      },
      files: [],
      baseApi: process.env.VUE_APP_BASE_API
    };
  },
  props: {
  },
  created() { },
  watch: {
    files(val) {
      if (val && val.length > 0) this.form.filesId = val.map((r) => r.id);
      else this.form.filesId = [];
    },
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.form = {
        standardNo: "",
        name: "",
        remark: "",
        enable: "",
        filesId: [],
      };
      this.files = [];
    },
  },
};
</script>


<style lang="scss" scoped>
.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
