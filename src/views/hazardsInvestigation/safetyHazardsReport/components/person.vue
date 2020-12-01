<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="责任人"
  >
    <el-form :model="queryForm" size="mini" inline>
      <el-form-item label="姓名">
        <el-input v-model="queryForm.realname" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="职编">
        <el-input v-model="queryForm.sqlUserId" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      @current-change="rowChange"
    >
      <el-table-column width="50">
        <template slot-scope="{row}">
          <el-radio v-model="user" :label="row">
            <i></i>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="姓名" width="100" />
      <el-table-column prop="sqlUserId" label="职编" width="150" />
      <el-table-column prop="dept" label="部门" align="left" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initData from "@/mixins/initData";
import { add, modify } from "@/api/emplotee.js";
import { formatShortDate } from '@/utils/datetime'
import dictSelect from '@/components/common/dictSelect'
export default {
  mixins: [initData],
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      queryForm: {
        realname: "",
        sqlUserId: ""
      },
      item: "",
      user: ""
    };
  },
  props: ["deptName"],
  created() {
    this.init();
  },
  methods: {
    formatShortDate,
    toQuery() {
      this.init()
    },
    beforeInit() {
      this.url = `/sys_mgr/staff_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { ...this.queryForm, deptName: this.deptName };
      return true;
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$emit("subPerson", this.user, this.item);
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.queryForm = {
        realname: "",
        sqlUserId: "",
        dept: "",
      };
      this.user = "";
    },
    rowChange(row) {
      this.user = row
    }
  },
};
</script>


<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 18px;
  margin-top: 0;
}
.readonly {
  width: 150px;
  display: inline-block;
}
.del {
  padding: 10px 0 0;
  text-align: center;
}
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
