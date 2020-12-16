<template>
  <div>
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
      <!--表格渲染-->
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
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="{row}">
            <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="subDelete(row.id)"></el-button> -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row)"></el-button>
          </template>
        </el-table-column>
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

    <eform ref="form" />
  </div>
</template>

<script>
import { formatShortDate, format } from '@/utils/datetime'
import department from '@/components/Department'
import { queryHazards2, deleteHiddenDanger } from "@/api/hazards";
import eform from '../hazardsList/form'
export default {
  components: { department, eform },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      disabled: false,
      tbLoading: false,
      tbList: [],
      queryForm: {
        runTaskId: this.data.runTaskId,
        sourcePath: null,
        hiddenName: "",
        hiddenNo: ""
      }
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
    data: {
      deep: true,
      handler(data) {
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
  created() {
    this.tbList = this.data.list;
  },
  methods: {
    formatShortDate,
    format,
    edit(row) {
      let _this = this.$refs.form;
      _this.form = row;
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除吗？").then(() => {
        deleteHiddenDanger(id).then(res => {
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.$message.success("删除成功！")
            this.reloadTable();
          }
        })
      }).catch(() => { })
    },
    reloadTable() {
      this.tbLoading = true;
      queryHazards2(this.queryForm).then((res) => {
        this.tbLoading = false;
        if (res.code != "200") {
          this.$message.error(res.msg);
        } else {
          this.tbList = res.obj.list;
        }
      });
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