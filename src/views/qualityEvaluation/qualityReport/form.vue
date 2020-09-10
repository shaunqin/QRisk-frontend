<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="产品" label-width="40px">
            <el-select v-model="product" placeholder="请选择产品" style="width:100%" clearable>
              <el-option
                v-for="item in prodList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期" label-width="40px">
            <el-date-picker v-model="form.cc" placeholder style="width:100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label>
        <el-table :data="productIndex">
          <el-table-column label prop="name" />
          <el-table-column label="value1">
            <template slot-scope="{row}">
              <el-input-number v-model="row.value1" placeholder></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="value2">
            <template slot-scope="{row}">
              <el-input-number v-model="row.value2" placeholder></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { taskAdd, taskModify } from "@/api/quality";
import { queryDictByName } from "@/api/dict";
import dictSelect from "@/components/common/dictSelect";

export default {
  components: { dictSelect },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        taskName: "",
        year: "",
        defaultDay: "",
        productValue: "",
        monthTasks: [],
        type: 2,
      },
      formRules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
      },
      prodList: [],
      product: "",
    };
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    productIndex() {
      let arr = [];
      if (!!this.product) {
        let data = this.prodList.find((r) => r.value == this.product).children;
        data.map((item) => {
          arr.push({
            name: item.name,
            value1: "",
            value2: "",
          });
        });
      }
      return arr;
    },
  },
  created() {
    queryDictByName("quality_product_index").then((res) => {
      if (res.code != "200") {
        this.$message.error(res.msg);
      } else {
        this.prodList = res.obj[0].children;
      }
    });
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else this.doModify();
        }
      });
    },
    doAdd() {
      taskAdd(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.loading = false;
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    doModify() {
      taskModify(this.form)
        .then((res) => {
          if (res.code === "200") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.resetForm();
            this.loading = false;
            this.$parent.init();
          } else {
            this.$message.error(res.msg);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        taskName: "",
        year: "",
        defaultDay: "",
        productValue: "",
        monthTasks: [],
        type: 2,
      };
      this.form2 = {};
    },
    dictChange(val) {
      this.form.productValue = val;
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
