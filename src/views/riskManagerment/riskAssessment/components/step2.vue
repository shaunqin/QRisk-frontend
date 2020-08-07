<template>
  <div>
    <el-card>
      <div slot="header">
        <el-page-header @back="goBack" title content="危险源清单"></el-page-header>
      </div>
      <el-button type="primary" size="mini" @click="addTable" style="margin-bottom:10px">新增一行</el-button>
      <!-- <el-button type="warning" size="mini" style="margin-bottom:10px">上传附件</el-button> -->
      <!--表格渲染-->
      <el-table :data="form.table2" size="small" style="width: 100%;">
        <el-table-column type="index" width="50" />
        <el-table-column label="编号" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ww" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.xx" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="系统" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.yy" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="发生日期" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.zz" placeholder></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="aa" label="危险源" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.aa" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="bb" label="问题描述" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bb" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="cc" label="ID" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cc" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="dd" label="可能性" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dd" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ee" label="严重性" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ee" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ff" label="可能导致的风险" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ff" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="gg" label="风险等级" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.gg" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="hh" label="根原因分析" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.hh" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ii" label="控制措施" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ii" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="jj" label="责任单位" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jj" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="kk" label="控制状态" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.kk" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="ll" label="完成期限" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ll" placeholder></el-input>
          </template>
        </el-table-column>
      </el-table>
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
  },
  methods: {
    addTable() {
      this.form.table2.push({
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
    goBack(){
        this.$parent.$parent.step--;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>