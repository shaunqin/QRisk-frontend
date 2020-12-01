<template>
  <div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%" max-height="400px">
      <el-table-column prop="hiddenName" label="隐患名称" width="120px" show-overflow-tooltip />
      <el-table-column prop="no" label="编号" width="150px" show-overflow-tooltip />
      <el-table-column label="发现时间" width="100px">
        <template slot-scope="{row}">{{formatShortDate(row.findTime)}}</template>
      </el-table-column>
      <el-table-column prop="sourceName" label="来源" />
      <el-table-column prop="levelsName" label="等级" />
      <el-table-column prop="deptName" label="主题单位/部门" width="130px" />
      <el-table-column prop="typeName" label="类型" />
      <el-table-column prop="businessName" label="涉及业务" width="100px" />
      <el-table-column prop="processName" label="涉及流程" width="100px" />
      <el-table-column prop="supervisoryUnit" label="监管单位" width="120px" show-overflow-tooltip />
      <el-table-column prop="reasonAnalysis" label="原因分析" width="120px" show-overflow-tooltip />
      <el-table-column prop="equivalentMeasures" label="等效措施" width="160px" show-overflow-tooltip />
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
            <li
              v-for="item in row.controlList"
              :key="item.id"
            >{{ `${item.realname}[${item.responsiblePerson}]` }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="整改时限" width="120px">
        <template slot-scope="{ row }">
          <ul class="tab-ul">
            <li v-for="item in row.controlList" :key="item.id">{{ formatShortDate(item.deadline) }}</li>
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
      <el-table-column label="操作" fixed="right" width="130">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="subDelete(row.id)"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { formatShortDate } from '@/utils/datetime'
import { deleteHiddenDanger } from "@/api/hazards";

export default {
  mixins: [initData],
  props: ["taskId", "type"],
  watch: {
    taskId() {
      if (!!this.taskId) {
        this.init()
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    formatShortDate,
    beforeInit() {
      this.url = `/riskmgr_mgr/hidden_danger/query/myControllList/${this.taskId}/${this.type}`;
      return true
    },
    subDelete(id) {
      this.$confirm("确定删除吗？").then(() => {
        deleteHiddenDanger(id).then(res => {
          if (res.code != '200') {
            this.$message.error(res.msg);
          } else {
            this.$message.success("删除成功！")
            this.init();
          }
        })
      }).catch(() => { })
    },
    edit(row) {
      this.$emit("edit", row);
    }
  },
}
</script>

<style lang="scss" scoped>
</style>