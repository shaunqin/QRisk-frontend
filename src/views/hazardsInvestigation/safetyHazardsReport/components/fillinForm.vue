<template>
  <el-card header="填报">
    <p class="title">
      <b>{{titleForm.title}}</b>
    </p>
    <el-form ref="titleForm" size="mini" label-width="auto" inline>
      <el-form-item label="填表人">
        <span class="readonly">{{titleForm.reportName}}</span>
      </el-form-item>
      <el-form-item label="填表日期">
        <span class="readonly">{{titleForm.reportDate}}</span>
      </el-form-item>
    </el-form>
    <!-- 填报 -->
    <el-button type="info" size="mini" style="margin-bottom: 10px" @click="addRow">新增</el-button>
    <el-card style="margin-bottom: 20px" v-for="(item, index) in data" :key="index">
      <el-form size="mini" inline label-width="80px">
        <el-row class="fill-row">
          <el-col :span="24">
            <el-form-item label="隐患名称">
              <el-input v-model="item.aa" placeholder style="width: 930px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发现时间">
          <el-date-picker v-model="item.cc" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
        </el-form-item>
        <el-form-item label="来源">
          <dictSelect
            type="data_source"
            :value="item.dd"
            @change="dictChange($event,item,'dd')"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="类型">
          <dictSelect
            type="hazard_source"
            :value="item.ee"
            @change="dictChange($event,item,'ee')"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="等级">
          <dictSelect
            type="hidden_danger_level"
            :value="item.ff"
            @change="dictChange($event,item,'ff')"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="涉及业务">
          <dictSelect
            type="product"
            :value="item.gg"
            @change="dictChange($event,item,'gg')"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="涉及流程">
          <dictSelect
            type="system"
            :value="item.ii"
            @change="dictChange($event,item,'ii')"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="监管单位">
          <el-input v-model="item.hh" style="width: 140px"></el-input>
        </el-form-item>
        <el-row class="fill-row" :gutter="16">
          <el-col :span="12">
            <el-form-item label="原因分析">
              <el-input v-model="item.jj" placeholder type="textarea" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="item.rr" type="textarea" rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="治理效果验证标准">
              <el-input v-model="item.nn" type="textarea" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="整改进展">
              <el-input v-model="item.qq" type="textarea" rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="info" size="mini" style="margin-bottom: 10px" @click="addItemRow(item)">新增一行</el-button>
      <!--表格渲染-->
      <el-table :data="item.array" size="small" style="width: 100%" max-height="400px">
        <el-table-column type="index" width="50" />
        <el-table-column prop="jj" label="等效措施">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jj" size="mini" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="kk" label="责任人">
          <template slot-scope="scope">
            <el-select v-model="scope.row.kk" size="mini">
              <el-option :label="'111'" :value="'1111'"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ll" label="整改时限">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.ll"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:100%"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="nn" label="措施实施情况跟踪">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nn" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="oo" label="治理结果情况跟踪">
          <template slot-scope="scope">
            <el-input v-model="scope.row.oo" size="mini" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label width="80">
          <template slot-scope="{ $index }">
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="delItemRow(item, $index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="del">
        <el-button type="danger" size="small" icon="el-icon-delete" @click="delRow(index)">删除</el-button>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import { add, modify } from "@/api/emplotee.js";
import { mapGetters } from "vuex";
import { formatShortDate } from '@/utils/datetime'
import dictSelect from '@/components/common/dictSelect'
export default {
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      titleForm: {
        reportName: '',
        reportDate: formatShortDate(new Date()),
        title: ""
      },
      form: {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
      },
      roleSelect: [],
      formRules: {
        aa: [{ required: true, message: "请填写名称", trigger: "blur" }],
        bb: [{ required: true, message: "请填写名称", trigger: "blur" }],
      },
      data: [],
      form2: {},
    };
  },
  props: {},
  created() {
    this.titleForm.reportName = this.userInfo.realname;
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    formatShortDate,
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

          // this.dialog = false;
          // this.$message({
          //   message: "添加成功",
          //   type: "success",
          // });
          // this.resetForm();
          console.log(this.data);
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
      this.$refs["form"].resetFields();
      this.form = {
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
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
          id: "",
        };
        obj.id = e[i];
        arr.push(obj);
      }
      this.form.roleList = arr;
    },
    addRow(e) {
      this.data.push({
        aa: "",
        bb: "",
        cc: "",
        dd: "",
        ee: "",
        ff: "",
        gg: "",
        hh: "",
        ii: "",
        mm: "",
        pp: "",
        qq: "",
        array: [],
      });
    },
    delRow(index) {
      this.data.splice(index, 1);
    },
    addItemRow(item) {
      item.array.push({
        jj: "",
        kk: "",
        ll: "",
        nn: "",
        oo: "",
      });
    },
    delItemRow(item, index) {
      item.array.splice(index, 1);
    },
    dictChange(val, row, key) {
      row[key] = val;
    }
  },
};
</script>


<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 18px;
  margin-top: 0;
}
.readonly {
  width: 150px;
  display: inline-block;
}
.del {
  padding: 10px 0 0;
  text-align: center;
}
.fill-row {
  /deep/ .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
