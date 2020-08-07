<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="生成在控风险"
    custom-class="big_dialog"
  >
    <el-button size="mini" @click="selectTable">筛选条件</el-button>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="aa" label="安全风险" />
      <el-table-column prop="bb" label="风险等级" />
      <el-table-column prop="cc" label="责任单位" />
    </el-table>
    <el-card header="下发" style="margin-top:20px" v-if="type=='下发'">
      <el-form label-width="auto" size="small">
        <el-form-item label="选择部门">
          <el-select v-model="bumen" placeholder="选择部门">
            <el-option :label="'选择部门'" :value="'选择部门'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="反馈" style="margin-top:20px" v-if="type=='反馈'">
      <el-table :data="data2" size="mini" style="width: 100%;">
        <el-table-column label="责任单位" prop="aa" width="100px" />
        <el-table-column label="风险措施" prop="bb" align="left" />
        <el-table-column label="反馈">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cc" placeholder="请输入反馈内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="upload(scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card header="审批记录" style="margin-top:20px" v-if="type=='审批'">
      <el-table :data="ApprovalData" size="mini">
        <el-table-column type="index" />
        <el-table-column label="审批人" prop="aa" />
        <el-table-column label="审批结果" prop="bb" />
        <el-table-column label="审批时间" prop="cc" />
        <el-table-column label="备注" prop="dd" />
      </el-table>
    </el-card>

    <el-card header="审批操作" style="margin-top:20px" v-if="type=='审批'">
      <el-radio-group v-model="agree">
        <el-radio label="1">同意</el-radio>
        <el-radio label="0">不同意</el-radio>
      </el-radio-group>
      <el-form label-width="auto" v-if="agree=='0'" style="margin-top:20px">
        <el-form-item label="原因">
          <el-input v-model="resion" placeholder="不同意原因" type="textarea" rows="2"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
    <select-table ref="selectTable"></select-table>
  </el-dialog>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import selectTable from "./table";
import initData from "@/mixins/initData";

export default {
  mixins: [initData],
  components: { selectTable },
  data() {
    return {
      loading: false,
      dialog: false,
      ApprovalData: [],
      agree: "1"
    };
  },
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  created() {
    this.loading = false;
    this.data = [
      { aa: "飞机在运行过程中出现大翼引气渗漏等重复性故", bb: "3", cc: "杭州、上海、武汉" },
      { aa: "飞机在运行过程中出现大翼引气渗漏等重复性故", bb: "3", cc: "杭州、上海、武汉" },
      { aa: "飞机在运行过程中出现大翼引气渗漏等重复性故", bb: "3", cc: "杭州、上海、武汉" }
    ];
    this.data2 = [
      {
        aa: "杭州",
        bb: `认真做好重复性故障的管控工作。各单位要高度重视飞机出现的重复性故障，加强对排故力量的组织；对于飞机运行中出现的重复、疑难故障，工程技术人员要及时研究和制定排故方案，彻底排除故障，确保飞行安全。 `
      },
      {
        aa: "上海",
        bb: `严格飞机航后和飞机定检维修质量。维修人员要严格按工作单卡执行飞机航后检查工作，及时发现并处理飞机故障，严把飞机放行关；飞机执行定检工作中，应切实提高飞机定检质量，确保飞机投入运行后安全可靠。  `
      },
      {
        aa: "武汉",
        bb: `A320S 飞行机组操作手册（FCOM）的操作程序中提出，高温天气可能导致飞机机翼气源管道周围过热被探测，容易触发左/右机翼气源渗漏警告（AIR L/R WING LEAK） `
      }
    ];
    this.ApprovalData = [
      {
        aa: "admin",
        bb: "通过",
        cc: "2020-05-04",
        dd: "审批原因"
      },
      {
        aa: "custom",
        bb: "不通过",
        cc: "2020-05-04",
        dd: "审批原因"
      },
      {
        aa: "admin",
        bb: "通过",
        cc: "2020-05-04",
        dd: "审批原因"
      }
    ];
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.dialog = false;
    },
    resetForm() {
      this.dialog = false;
      this.form = {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: ""
      };
      this.roleSelect = [];
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0];
      }
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        let obj = {
          id: ""
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    },
    selectTable() {
      let _this = this.$refs.selectTable;
      _this.dialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  margin-bottom: 10px;
}
/deep/ .big_dialog {
  width: 1100px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
