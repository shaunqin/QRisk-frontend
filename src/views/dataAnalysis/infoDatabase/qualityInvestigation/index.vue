<template>
  <div class="app-container">
    <div class="head-container">
      <search sourceType="info_source_qauit" type="2" />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" :index="getIndex" />
      <el-table-column prop="infoSourceText" label="信息来源" width="100" />
      <el-table-column label="发生日期" width="100">
        <template slot-scope="{row}">
          <span>{{formatShortDate(row.happenDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aircraftTypeText" label="机型" />
      <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="causeAnalysis" label="原因分析" min-width="150" show-overflow-tooltip />
      <el-table-column prop="departmentNameCn" label="责任单位" width="120" show-overflow-tooltip />
      <el-table-column prop="productText" label="产品" width="120" />
      <el-table-column prop="systemText" label="系统" width="110" />
      <el-table-column prop="riskLevelText1" label="危险源层级一" width="110" />
      <el-table-column prop="riskLevelText2" label="危险源层级二" width="110" />
      <el-table-column prop="sourceOfRiskText" label="危险源" width="120" show-overflow-tooltip />
      <el-table-column prop="risk" label="风险" width="120" />
      <el-table-column prop="incentive" label="诱因" width="120" />
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="{row}">
          <el-button-group v-if="row.status=='1'">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row.id)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-upload" @click="doSub(row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="subDel(row.id)"></el-button>
          </el-button-group>
        </template>
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
    <eform ref="form" :is-add="isAdd"></eform>
    <editform ref="editform" :is-add="isAdd"></editform>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import search from "../components/search2";
import eform from "./form";
import editform from "./editForm";
import { formatShortDate } from "@/utils/datetime";
import { detailInfobase, delInfobase, modifyInfobase } from "@/api/infodb";
export default {
  components: { search, eform, editform },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/infoDatabase_mgr/infoDatabase_mgr/query/pageList/${this.page}/${this.size}`;
      this.params = { type: 2, ...this.params };
      return true;
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(id) {
      this.isAdd = false;
      let _this = this.$refs.editform;
      detailInfobase(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = {
            id: obj.id,
            infoSource: obj.infoSource,
            happenDate: obj.happenDate,
            place: obj.place,
            riskLevel1: obj.riskLevel1,
            riskLevel2: obj.riskLevel2,
            sourceOfRisk: obj.sourceOfRisk,
            aircraftType: obj.aircraftType,
            responsibleUnit: obj.responsibleUnit,
            product: obj.product,
            systemCode: obj.systemCode,
            eventOverview: obj.eventOverview,
            causeAnalysis: obj.causeAnalysis,
            risk: obj.risk,
            incentive: obj.incentive,
            type: obj.type,
          };
          _this.files = obj.filesList;
          _this.dialog = true;
        }
      });
    },
    doSub(id) {
      let form = {
        id,
        status: "0",
      };
      this.$confirm("确定提交嘛？提交后将不能编辑。")
        .then(() => {
          modifyInfobase(form).then((res) => {
            if (res.code != "200") {
              this.$message.error(res.msg);
            } else {
              this.$message.success("提交成功");
              this.init();
            }
          });
        })
        .catch(() => { });
    },
    subDel(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          delInfobase(id).then((res) => {
            if (res.code != "200") {
              this.$message.error(res.msg);
            } else {
              this.$message.success("删除成功");
              this.init();
            }
          });
        })
        .catch(() => { });
    }
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
</style>