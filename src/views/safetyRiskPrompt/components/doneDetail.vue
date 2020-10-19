<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="已办详情"
    custom-class="big_dialog"
  >
    <el-form ref="form" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="编号">{{data.no}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟制人">{{data.issuerName}}[{{data.issuer}}]</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围">{{data.applyScope}}</el-form-item>
      <el-form-item label="主题">{{data.title}}</el-form-item>
      <el-form-item label="安全风险">
        <span style="white-space: pre-wrap;">{{data.existingRisk}}</span>
      </el-form-item>
      <el-form-item label="背景">
        <span style="white-space: pre-wrap;">{{data.background}}</span>
      </el-form-item>
      <el-form-item label="风险防范" v-if="data.measuresVos!=null">
        <ul class="measuresVos">
          <li v-for="(item,index) in data.measuresVos" :key="index">{{item.content}}</li>
        </ul>
      </el-form-item>
      <el-form-item label="风险防范" v-if="deptMeasure.length>0">
        <el-table :data="deptMeasure" size="mini">
          <el-table-column label="截止日期" prop="deadline" />
          <el-table-column label="措施内容" prop="content" />
          <el-table-column
            label="落实情况"
            prop="implementStatus"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column label="经办人" prop="implementStatus">
            <template slot-scope="{row}">{{row.fillerName}}[{{row.filler}}]</template>
          </el-table-column>

          <el-table-column label="预览附件" min-width="120">
            <template slot-scope="{row}">
              <el-link
                type="primary"
                v-if="row.accessory!=null"
                :href="getUrl(row.accessory.filePath)"
                target="_blank"
              >{{row.accessory.originFileName}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="处理记录" v-if="measureComment.length>0">
        <el-table :data="measureComment" size="mini">
          <el-table-column label="处理时间">
            <template slot-scope="{row}">{{format(row.createTime)}}</template>
          </el-table-column>
          <el-table-column label="经办人">
            <template slot-scope="{row}">{{row.name}}[{{row.sqlUserId}}]</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="处理结果">
            <template slot-scope="{row}">
              <span v-if="row.processFlag==1">同意</span>
              <span v-if="row.processFlag==2">驳回</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="处理记录" v-if="noticeComments.length>0">
        <el-table :data="noticeComments" size="mini">
          <el-table-column label="处理时间">
            <template slot-scope="{row}">{{format(row.createTime)}}</template>
          </el-table-column>
          <el-table-column label="经办人">
            <template slot-scope="{row}">{{row.name}}[{{row.sqlUserId}}]</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="处理结果">
            <template slot-scope="{row}">
              <span v-if="row.processFlag==1">同意</span>
              <span v-if="row.processFlag==2">驳回</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { format } from '@/utils/datetime'
export default {
  data() {
    return {
      dialog: false,
      data: {}
    };
  },
  computed: {
    deptMeasure() {
      if (this.data.deptMeasure) {
        return [this.data.deptMeasure]
      }
      return []
    },
    measureComment() {
      if (this.data.deptMeasure && this.data.deptMeasure.measureComment) {
        return this.data.deptMeasure.measureComment;
      }
      return []
    },
    noticeComments() {
      if (this.data.noticeComments) {
        return this.data.noticeComments;
      }
      return []
    }
  },
  mounted() { },
  methods: {
    format,
    success(res) {
      console.log(res);
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.resetForm();
    },
    resetForm() {
      this.dialog = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.measuresVos {
  margin: 0;
  list-style-type: decimal;
  padding-inline-start: 20px;
}
</style>