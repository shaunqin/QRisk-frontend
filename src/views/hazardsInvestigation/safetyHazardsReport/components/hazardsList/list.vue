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
      <!--表格渲染-->
      <el-table :data="data" size="small" style="width: 100%" max-height="400px">
        <el-table-column prop="deptName" label="主体单位" width="120px" show-overflow-tooltip />
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
        <el-table-column prop="typeName" label="类型" />
        <el-table-column prop="businessName" label="涉及业务" width="100px" />
        <el-table-column prop="processName" label="涉及流程" width="100px" />
        <el-table-column prop="supervisoryUnit" label="监管单位" width="120px" show-overflow-tooltip />
        <el-table-column prop="reasonAnalysis" label="原因分析" width="120px" show-overflow-tooltip />
        <el-table-column label="等效措施" width="150px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">{{ item.measures }}</li>
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
              <li v-for="item in row.controlList" :key="item.id">{{ item.implementationOfMeasures }}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="治理结果情况跟踪" width="160px">
          <template slot-scope="{ row }">
            <ul class="tab-ul">
              <li v-for="item in row.controlList" :key="item.id">{{ item.governanceResults }}</li>
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
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-button type="success" icon="el-icon-document-copy" size="mini" @click="edit(row)"></el-button>
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
    </el-card>
    <el-card header="我填报的">
      <mine :taskId="taskId" :type="type" />
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
    <eform ref="form" />
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'
import { add, modify } from "@/api/emplotee.js";
import eform from "./form";
import { formatShortDate } from '@/utils/datetime'
import mine from './mine'

export default {
  components: { eform, mine },
  mixins: [initData],
  data() {
    return {
      loading: false,
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
      this.url = `/riskmgr_mgr/hidden_danger/query/subControlList/${this.page}/${this.size}/${this.taskId}/${this.type}`;
      return true
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // this.loading = true;
          // if (this.isAdd) {
          //   this.doAdd()
          // } else this.doModify()

          this.dialog = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.resetForm();
        }
      });
    },
    doAdd() {
      // this.delwithRoleList()
      const data = this.roleSelect;
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: "",
        };
        obj.id = data[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
      add(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      modify(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
          this.resetForm();
          this.loading = false;
          this.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$parent.taskId = "";
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0];
      }
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        let obj = {
          id: "",
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    },
    edit(row) {
      let _this = this.$refs.form;
      _this.dialog = true;
    },
  },
};
</script>


<style lang="scss" scope>
.tab-ul {
  list-style: decimal;
  text-align: left;
  padding-inline-start: 20px;
}
.el-card + .el-card {
  margin-top: 20px;
}
</style>
