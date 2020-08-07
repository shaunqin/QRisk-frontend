<template>
  <div>
    <el-card>
      <div slot="header">
        <el-page-header @back="goBack" title content="风险评估报告"></el-page-header>
      </div>
      <el-card header="详细信息">
        <el-form ref="form" :model="form.report" size="small" label-width="auto">
          <el-row :gutter="16">
            <el-col :span="24">
              <el-form-item label="标题" prop="aa">
                <el-input v-model="form.report.aa" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编号">
                <el-input v-model="form.report.bb" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准">
                <el-input v-model="form.report.cc" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评价单位">
                <el-input v-model="form.report.dd" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日期">
                <el-input v-model="form.report.ee" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主送单位">
                <el-input v-model="form.report.ff" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抄送单位">
                <el-input v-model="form.report.gg" style="width: 100%;"  />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="背景描述">
                <el-input v-model="form.report.hh" style="width: 100%;" type="textarea" rows="3"  />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card header="危险源清单" style="margin-top:20px">
      <!--表格渲染-->
      <el-table
        :data="data2"
        size="small"
        style="width: 100%;"
        max-height="400px"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="编号" prop="ww" />
        <el-table-column label="产品" prop="xx" />
        <el-table-column label="系统" prop="yy" />
        <el-table-column label="发生日期" prop="zz" />
        <el-table-column label="危险源" prop="aa" />
        <el-table-column label="ID" prop="bb" />
        <el-table-column label="可能性" prop="cc" />
        <el-table-column label="严重性" prop="dd" />
        <el-table-column label="可能导致的风险" prop="ee" width="200" />
        <el-table-column label="风险等级" prop="ff" />
        <el-table-column label="根原因分析" prop="gg" width="120" />
        <el-table-column label="控制措施" prop="hh" />
        <el-table-column label="责任单位" prop="ii" />
        <el-table-column label="控制状态" prop="jj" />
        <el-table-column label="完成期限" prop="kk" />
      </el-table>
    </el-card>
    <el-card header="风险措施" style="margin-top:20px">
      <el-button type="info" size="mini" style="margin-bottom:10px" @click="addTable">添加列</el-button>
      <el-table :data="data" size="mini" max-height="400px">
        <el-table-column type="index" />
        <el-table-column label="控制措施" prop="aa" />
        <el-table-column label="责任单位" prop="bb" />
        <el-table-column label="完成情况">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dd" placeholder="请输入完成情况"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="完成期限" prop="cc" />
        <el-table-column label width="80px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            data: [],
            data2: [],
        }
    },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addTable() {
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
        jj: "",
        kk: "",
        ll: "",
        ww: "",
        xx: "",
        yy: "",
        zz: "",
      });
    },
    goBack() {
      this.$parent.$parent.step--;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>