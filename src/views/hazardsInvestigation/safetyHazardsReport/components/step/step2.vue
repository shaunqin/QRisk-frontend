<template>
  <div>
    <el-card header="详情">
      <baseinfo :data="data" />
    </el-card>

    <fillinForm ref="fillinForm" :disabled="disabled" :data="data" />
    <el-card>
      <el-radio-group v-model="form.processFlag">
        <el-radio label="1">同意</el-radio>
        <el-radio label="2">驳回</el-radio>
      </el-radio-group>
      <el-input
        v-model="form.comment"
        type="textarea"
        rows="3"
        placeholder="请输入备注"
        style="margin-top:10px"
      ></el-input>
    </el-card>
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import fillinForm from '../fillinForm'
import dictSelect from '@/components/common/dictSelect'
import baseinfo from './baseinfo'
export default {
  components: { fillinForm, dictSelect, baseinfo },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      disabled: false,
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    form: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    data() {
      this.loadData();
    }
  },
  computed: {
    childTask() {
      if (this.data.childTask == null) {
        return []
      } else {
        return this.data.childTask
      }
    },
    _form() {
      return this.form
    }
  },
  mounted() { this.loadData(); },
  methods: {
    formatShortDate,
    format,
    loadData() {
      this.$refs.fillinForm.fillinData = this.data.deptControlList.hiddenDangerControlList;
      this.$refs.fillinForm.titleForm.reportName = this.data.deptControlList.fillerName;
      this.$refs.fillinForm.titleForm.reportDate = this.formatShortDate(this.data.deptControlList.fillDate);
      this.$refs.fillinForm.titleForm.title = this.data.controlListName;
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.file-ul {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
.el-card + .el-card {
  margin-top: 20px;
}

.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
/deep/ .is-disabled {
  color: #000;
}
</style>