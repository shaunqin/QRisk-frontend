<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="安全隐患管控清单"
    custom-class="big_dialog"
  >
    <el-card header="全部列表">
      <search style="matgin-bottom:8px" />
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%">
        <el-table-column prop="month" label="月份" width="60px" />
        <el-table-column label="填报人" width="120px">
          <template slot-scope="{row}">{{ `${row.fillerName}[${row.filler}]` }}</template>
        </el-table-column>
        <el-table-column prop="hiddenName" label="隐患名称" width="120px" show-overflow-tooltip />
        <el-table-column prop="no" label="编号" width="120px" />
        <el-table-column label="发现时间" width="100px">
          <template slot-scope="{row}">{{formatShortDate(row.findTime)}}</template>
        </el-table-column>
        <el-table-column prop="sourceName" label="来源" />
        <el-table-column prop="levelsName" label="等级" />
        <el-table-column prop="deptName" label="主体单位" width="120px" show-overflow-tooltip />
        <el-table-column prop="typeName" label="类型" />
        <el-table-column prop="businessName" label="涉及业务" width="100px" />
        <el-table-column prop="processName" label="涉及流程" width="100px" />
        <el-table-column prop="supervisoryUnit" label="监管单位" width="120px" show-overflow-tooltip />
        <el-table-column prop="reasonAnalysis" label="原因分析" width="120px" show-overflow-tooltip />
        <el-table-column
          prop="equivalentMeasures"
          label="等效措施"
          width="160px"
          show-overflow-tooltip
        />
        <el-table-column label="整改措施" width="150px">
          <template slot-scope="{ row }" show-overflow-tooltip>
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">
                <el-popover trigger="hover" v-if="true" placement="top">
                  <span>{{item.measures}}</span>
                  <div class="text" slot="reference">{{item.measures}}</div>
                </el-popover>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="责任人" width="150px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">{{ item.responsiblePerson }}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="整改时限" width="120px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li
                v-for="item in row.controlList"
                :key="item.id"
              >{{ formatShortDate(item.deadline) }}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="措施实施情况跟踪" width="160px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">
                <el-popover trigger="hover" v-if="true" placement="top">
                  <span>{{item.implementationOfMeasures}}</span>
                  <div class="text" slot="reference">{{item.implementationOfMeasures}}</div>
                </el-popover>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="治理结果情况跟踪" width="160px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">
                <el-popover trigger="hover" v-if="true" placement="top">
                  <span>{{item.governanceResults}}</span>
                  <div class="text" slot="reference">{{item.governanceResults}}</div>
                </el-popover>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          prop="verificationFollowUp"
          label="治理效果验证标准"
          width="140px"
          show-overflow-tooltip
        />
        <el-table-column
          prop="rectificationProgress"
          label="整改进展"
          width="120px"
          show-overflow-tooltip
        />
        <el-table-column prop="remarks" label="备注" width="120px" show-overflow-tooltip />
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
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>
    <eform ref="form" />
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'
import { copyHiddenDanger, exportHistoryList } from "@/api/hazards";
import eform from "./form";
import { formatShortDate } from '@/utils/datetime'
import search from './search2'

export default {
  components: { eform, search },
  mixins: [initData],
  data() {
    return {
      dialog: false,
      data: [],
    };
  },
  props: ["taskId", "type"],
  created() {
    // this.init()
  },
  watch: {
    taskId() {
      if (!!this.taskId) {
        this.init()
      }
    }
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/queryDeptYearControlList/${this.page}/${this.size}`;
      this.params = { ...this.params, taskId: this.taskId }
      return true
    },
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.$parent.taskId = "";
    },
    doExport(listType) {
      let params = {};
      if (listType == 1) {
        params = { taskId: this.taskId, type: this.type };
      } else {
        params = { ...this.params, taskId: this.taskId, type: this.type };
      }
      this.$loading();
      exportHistoryList(params).then(res => {
        this.$loading().close();
        if (res.code != '200') {
          this.$message.error(res.obj);
        } else {
          let url = `${process.env.VUE_APP_BASE_API}${res.obj}`;
          location.href = url;
        }
      })
    }
  },
};
</script>


<style lang="scss" scope>
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
  margin: 0;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.el-card + .el-card {
  margin-top: 20px;
}
.mb {
  margin-bottom: 8px;
}
</style>
