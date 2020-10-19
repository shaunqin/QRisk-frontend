<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="formRules" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="编号" prop="no">
            <el-input
              v-model="detailForm.no"
              style="width: 100%;"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主题" prop="title">
            <el-input
              v-model="detailForm.title"
              style="width: 100%;"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
          <el-form-item label="背景" prop="background">
            <el-input
              v-model="detailForm.background"
              style="width: 100%;"
              type="textarea"
              rows="3"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
          <el-form-item label="存在的安全风险" prop="existingRisk">
            <el-input
              v-model="detailForm.existingRisk"
              style="width: 100%;"
              type="textarea"
              rows="3"
              @keyup.native="formChangeStatus"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="风险防范措施" class="measures">
        <el-row
          v-for="(item,index) in detailForm.measures"
          :key="index"
          style="margin-bottom: 10px;display:flex"
          :gutter="8"
        >
          <el-col :span="6">
            <department
              :value="!item.deptPath?[]:item.deptPath.split(',')"
              @change="deptChange($event,item)"
              :multiple="true"
              :limit="1"
              :flat="true"
              style="line-height:20px"
            />
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="item.deadline"
              value-format="yyyy-MM-dd"
              placeholder="为空则是长期选项"
              style="width:100%"
              @change="formChangeStatus"
            ></el-date-picker>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="item.content"
              style="width: 100%;"
              placeholder="措施内容"
              @keyup.native="formChangeStatus"
            />
          </el-col>
          <el-col :span="2">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="delRisk(index)"></el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              style="width: 100%;border-style: dashed;"
              @click="addRisk"
            >添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="审批记录">
        <el-table :data="data.noticeComments" size="mini">
          <el-table-column label="内容" prop="remark" />
          <el-table-column label="处理人">
            <template slot-scope="{row}">{{row.name}}[{{row.sqlUserId}}]</template>
          </el-table-column>
          <el-table-column label="处理日期">
            <template slot-scope="{row}">{{format(row.createTime)}}</template>
          </el-table-column>
          <el-table-column label="处理结果">
            <template slot-scope="{row}">
              <span v-if="row.processFlag=='1'">同意</span>
              <span v-else>驳回</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { riskNoticeAdd, riskNoticeModify, riskNoticeSubmit } from "@/api/risk";
import department from "@/components/Department/deptByRole";
import { format } from "@/utils/datetime";
export default {
  components: { department },
  data() {
    return {
      loading: false,
      save_loading: false,
      dialog: false,
      detailForm: {
        id: this.data.id,
        no: this.data.no,
        title: this.data.title,
        background: this.data.background,
        existingRisk: this.data.existingRisk,
        measures: this.data.measuresVos,
      },
      formRules: {
        no: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        title: [{ required: true, message: "主题不能为空", trigger: "blur" }],
        background: [
          { required: true, message: "背景不能为空", trigger: "blur" },
        ],
        existingRisk: [
          {
            required: true,
            message: "存在的安全风险不能为空",
            trigger: "blur",
          },
        ],
      },
      formChange: false,
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    form: {
      type: Object,
      default: () => { },
    },
  },
  created() { },
  computed: {
    _form: {
      get() {
        return this.form;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.detailForm = {
          id: data.id,
          no: data.no,
          title: data.title,
          background: data.background,
          existingRisk: data.existingRisk,
          measures: data.measuresVos,
        };
        this.formChange = false;
      },
    },
  },
  methods: {
    format,
    addRisk() {
      this.detailForm.measures.push({
        content: "",
        deadline: "",
        deptPath: null,
      });
    },
    delRisk(index) {
      this.detailForm.measures.splice(index, 1);
    },
    deptChange(val, item) {
      item.deptPath = val.join(",");
    },
    formChangeStatus() {
      this.formChange = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.measures{
  /deep/ .el-form-item__content{
    padding: 0 4px;
  }
}
</style>

