<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="'办理/审批记录'"
    custom-class="big_dialog"
  >
    <el-card header="状态&下一办理人">
      <el-table :data="statusAndreviewerInfo" size="mini" :span-method="objectSpanMethod" border>
        <el-table-column label="状态" width="80">
          <template slot-scope="{row}">
            <span v-if="row.status == 2">待填报</span>
            <span v-if="row.status == 3">已下发,待填报</span>
            <span v-if="row.status == 4">待审核</span>
            <span v-if="row.status == 5">通过</span>
            <span v-if="row.status == 6">驳回</span>
            <span v-if="row.status == 7">取消</span>
          </template>
        </el-table-column>
        <el-table-column label="任务名称" prop="taskName">
          <template slot-scope="{ row }">
            <span>{{ row.taskName||"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="{ row }">
            <span>{{ row.groupName||"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="办理人">
          <template slot-scope="{row}">
            <span>{{row.name||row.users||"-"}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card header="操作记录">
      <el-table :data="data" size="mini" v-loading="tbLoading">
        <el-table-column label="操作部门" prop="operateDept" width="200" align="left">
          <template slot-scope="{row}">
            <span>{{row.operateDept}}</span>
            <span v-if="!!row.related" class="el-icon-location-information" style="color:red"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作角色" prop="operateRole" />
        <el-table-column label="操作人">
          <template slot-scope="{row}">{{`${row.name}[${row.sqlUserId}]`}}</template>
        </el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="{row}">{{format(row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" prop="processFlag">
          <template slot-scope="{row}">
            <span v-if="row.processFlag==1">同意</span>
            <span v-else-if="row.processFlag==2">驳回</span>
            <span v-else-if="row.processFlag==3">下发</span>
            <span v-else-if="row.processFlag==4">上报</span>
            <span v-else-if="row.processFlag==5">审批</span>
            <span v-else-if="row.processFlag==6">修改</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作说明" prop="remark2" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column fixed="right" width="90" label="历史版本">
          <template slot-scope="{row}">
            <el-button v-if="!!row.history" type="text" size="mini" @click="commentsDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
      <!-- <el-button type="primary" @click="doSubmit">确认</el-button> -->
    </div>
    <commentDetail ref="commentDetail" :type="formName" />
  </el-dialog>
</template>

<script>
import { format } from '@/utils/datetime'
import commentDetail from './commentDetail'
import { getOriginFormByCommentId } from '@/api/hazards'
export default {
  components: { commentDetail },
  data() {
    return {
      tbLoading: false,
      dialog: false,
      data: [],
      spanArr: [],
      formName: ""
    }
  },
  props: {
    statusAndreviewerInfo: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    statusAndreviewerInfo: {
      immediate: true,
      handler(val) {
        this.spanArr = [];
        for (let i = 0; i < val.length; i++) {
          if (i == 0) {
            this.spanArr.push(val.length);
          } else {
            this.spanArr.push(0)
          }
        }
      }
    }
  },
  methods: {
    format,
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    commentsDetail(row) {
      let _this = this.$refs.commentDetail;
      let params = {
        formId: row.id,
        formName: row.formName
      }
      this.formName = row.formName;
      getOriginFormByCommentId(params).then(res => {
        if (res.code != '200') {
          this.$message.error(res.msg);
        } else {
          if (res.obj != null) {
            _this.form = res.obj;
            _this.dialog = true;
          } else {
            this.$message("无历史版本!")
          }
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.el-card + .el-card {
  margin-top: 20px;
}
</style>