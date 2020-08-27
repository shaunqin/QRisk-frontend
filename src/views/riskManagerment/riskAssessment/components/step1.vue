<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="auto">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="评估类别">
            <el-select v-model="form.aa" placeholder="请选择评估类别">
              <el-option
                v-for="item in ['流程/标准','变革管理','维修能力','航站审定','其他评估']"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-card header="系统和工作分析记录表" v-if="form.aa=='流程/标准'||form.aa=='变革管理'">
      <el-form ref="form2" :model="form" size="small" label-width="auto">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="form.bb" placeholder></el-input>
            </el-form-item>
            <el-form-item label="分析人">
              <el-input v-model="form.ee" placeholder></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="form.cc" placeholder></el-input>
            </el-form-item>
            <el-form-item label="批转">
              <el-input v-model="form.ff" placeholder></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析单位">
              <el-input v-model="form.dd" placeholder></el-input>
            </el-form-item>
            <el-form-item label="日期">
              <el-input v-model="form.gg" placeholder></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              class="mb-10"
              type="info"
              size="mini"
              icon="el-icon-plus"
              @click="addCol"
            >新增一行</el-button>
          </el-col>
        </el-row>
        <el-table :data="form.table">
          <el-table-column label="系统">
            <template slot-scope="{row}">
              <el-input v-model="row.t1" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="子系统" width="130">
            <template slot-scope="{row}">
              <el-select v-model="row.t2" placeholder>
                <el-option
                  v-for="item in ['维修实例','生产控制','工程技术','安全质量','航材管理','培训教育','计量检测','生产保障']"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="管理流程">
            <template slot-scope="{row}">
              <el-input v-model="row.t1" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="责任单位">
            <template slot-scope="{row}">
              <el-input v-model="row.t1" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="岗位">
            <template slot-scope="{row}">
              <el-input v-model="row.t1" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="流程要素">
            <el-table-column label="人">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="机">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="法">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="环">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="流程分析">
            <el-table-column label="输入">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="输出">
              <template slot-scope="{row}">
                <el-input v-model="row.t1" placeholder></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
    formRules: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addCol() {
      this.form.table.push({
        t1: "",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mb-10 {
  margin-bottom: 10px;
}
</style>