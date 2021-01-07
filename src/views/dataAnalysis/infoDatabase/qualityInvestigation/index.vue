<template>
  <div class="app-container">
    <div class="head-container">
      <search sourceType="info_source_qauit" type="2" />
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add"
      >{{$t('global.add')}}</el-button>
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
      <el-table-column prop="infoSourceText" :label="$t('analysis.infoSource')" width="100" />
      <el-table-column :label="$t('analysis.happenDate')" width="110">
        <template slot-scope="{row}">
          <span v-if="row.happenDate!=null">{{formatShortDate(row.happenDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="place" :label="$t('analysis.place')" />
      <el-table-column prop="aircraftTypeText" :label="$t('analysis.aircraftType')" />
      <el-table-column
        prop="title"
        :label="$t('analysis.title')"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="causeAnalysis"
        :label="$t('analysis.causeAnalysis')"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="departmentNameCn"
        :label="$t('analysis.department')"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="productText" :label="$t('analysis.product')" width="120" />
      <el-table-column prop="systemText" :label="$t('analysis.system')" width="110" />
      <el-table-column prop="riskLevelText1" :label="$t('analysis.riskLevel1')" width="110" />
      <el-table-column prop="riskLevelText2" :label="$t('analysis.riskLevel2')" width="110" />
      <el-table-column
        prop="sourceOfRiskText"
        :label="$t('analysis.sourceOfRisk')"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="riskText"
        :label="$t('analysis.risk')"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="incentiveText"
        :label="$t('analysis.incentive')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('global.operation')" width="150" fixed="right">
        <template slot-scope="{row}">
          <el-button-group v-if="row.status=='1'&&row.updData">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row.id)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-upload" @click="doSub(row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="subDel(row.id)"></el-button>
          </el-button-group>
          <el-button v-else type="primary" size="mini" icon="el-icon-upload" @click="doSub(row.id)"></el-button>
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
    <editform ref="editform" type="2" :is-add="isAdd" :isSubmit="isSubmit"></editform>
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import search from "../components/search2";
import eform from "./form";
import editform from "../components/editForm";
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
      isSubmit: false
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
      this.isSubmit = false;
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
      this.isSubmit = true;
      let _this = this.$refs.editform;
      detailInfobase(id).then((res) => {
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          const { obj } = res;
          _this.form = obj;
          _this.files = obj.filesList;
          _this.dialog = true;
        }
      });
    },
    subDel(id) {
      this.$confirm(this.$t('analysis.deleteConfirm'))
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