<template>
  <div>
    <el-table :data="data">
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
      <!-- <el-table-column width="80">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="commentsDetail(row)">详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <commentDetail ref="commentDetail" :type="type" />
  </div>
</template>

<script>
import commentDetail from './commentDetail';
import { getOriginFormByCommentId } from "@/api/risk";
import { format } from '@/utils/datetime'
export default {
  components: { commentDetail },
  props: ["data", "type"],// type:safety_risk_notice,safety_measures
  methods: {
    format,
    commentsDetail(row) {
      let _this = this.$refs.commentDetail;
      let params = {
        formId: row.id,
        formName: row.formName
      }
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
  }
}
</script>

<style lang="scss" scoped>
</style>