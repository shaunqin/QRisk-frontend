<template>
  <div class="orher-standard">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="standardNo" :label="$t('standard.no')" />
      <el-table-column :label="$t('standard.name')">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">>{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('standard.remark')" />
      <el-table-column :label="$t('standard.createTime')">
        <template slot-scope="{row}">{{format(row.createTime)}}</template>
      </el-table-column>
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
    <eform ref="form" />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { format } from "@/utils/datetime";
import eform from './form'
import { detailOtherStand, } from "@/api/standard";
export default {
  mixins: [initData],
  components: { eform, },
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
      department: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    format,
    beforeInit() {
      this.url = `/info_mgr/other_standard_mgr/query/pageList/${this.page}/${this.size}`;
      return true;
    },
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
    },
    detail(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      detailOtherStand(row.id).then(res => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          let { id, standardNo, name, remark, enable, files } = res.obj;
          _this.form = {
            id,
            standardNo,
            name,
            remark,
            enable
          };
          _this.files = files;
          _this.dialog = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  margin-bottom: 20px;
}
</style>