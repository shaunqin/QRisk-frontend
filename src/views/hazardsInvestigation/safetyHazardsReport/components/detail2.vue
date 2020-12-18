<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="任务详情"
    custom-class="big_dialog"
  >
    <el-card>
      <div slot="header">
        <el-link
          icon="el-icon-download"
          v-for="(item) in data.excel"
          :key="item.id"
          type="primary"
          :href="baseApi+item.filePath"
          target="_blank"
        >{{item.originFileName}}</el-link>
      </div>

      <!-- <el-form class="search" size="mini" inline>
        <el-form-item label="主体单位">
          <department
            class="mini"
            :value="queryForm.sourcePath"
            @change="deptChange"
            style="width:200px"
          />
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="queryForm.hiddenNo" placeholder></el-input>
        </el-form-item>
        <el-form-item label="隐患名称">
          <el-input v-model="queryForm.hiddenName" placeholder></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form> -->

      <el-table v-loading="tbLoading" :data="tbList" size="small" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="no" label="编号" width="120px" />
        <el-table-column prop="hiddenName" label="隐患名称" width="120px" show-overflow-tooltip />
        <el-table-column label="发现时间" width="100px">
          <template slot-scope="{row}">{{formatShortDate(row.findTime)}}</template>
        </el-table-column>
        <el-table-column prop="sourceName" label="来源" />
        <el-table-column prop="typeName" label="类型" />
        <el-table-column prop="levelsName" label="等级" />
        <el-table-column prop="deptName" label="主体单位/部门" width="120px" show-overflow-tooltip />
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
        <el-table-column
          prop="verificationFollowUp"
          label="治理效果情况跟踪"
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
    </el-card>

    <el-card header="审批记录" v-if="comments.length>0">
      <el-table :data="comments" size="mini">
        <el-table-column label="批复人">
          <template slot-scope="{row}">{{row.name}}[{{row.sqlUserId}}]</template>
        </el-table-column>
        <el-table-column label="批复时间">
          <template slot-scope="{row}">{{format(row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="批复结果">
          <template slot-scope="{row}">
            <span v-if="row.processFlag=='1'">同意</span>
            <span v-else>驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
      </el-table>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import department from '@/components/Department'
import { queryHasDoneDetail2 } from "@/api/hazards";
export default {
  components: { department },
  data() {
    return {
      dialog: false,
      baseApi: process.env.VUE_APP_BASE_API,
      disabled: false,
      tbLoading: false,
      tbList: [],
      queryForm: {
        runTaskId: "",
        sourcePath: null,
        hiddenName: "",
        hiddenNo: ""
      },
      data: {}
    }
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        if (data.list)
          this.tbList = data.list;
      }
    }
  },
  computed: {
    comments() {
      if (this.data.comments && this.data.comments.length > 0) {
        return this.data.comments;
      }
      return [];
    }
  },
  methods: {
    formatShortDate,
    format,
    deptChange(val) {
      this.queryForm.sourcePath = val;
    },
    toQuery() {
      this.tbLoading = true;
      queryHasDoneDetail2(this.queryForm.runTaskId).then((res) => {
        this.tbLoading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.tbList = res.obj.list;
        }
      });
    },
    reset() {
      this.queryForm = {
        runTaskId: "",
        sourcePath: null,
        hiddenName: "",
        hiddenNo: ""
      }
      this.toQuery();
    },
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
      this.data = {};
    },
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
</style>