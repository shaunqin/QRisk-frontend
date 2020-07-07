<template>
  <div class="dataSource">
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      @selection-change="selectionChange"
      :span-method="tableSpan"
      border
    >
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column prop="cc" label="危险源层级一" />
      <el-table-column prop="ff" label="编号" />
      <el-table-column prop="gg" label="危险源层级二" />
      <el-table-column prop="hh" label="编号" />
      <el-table-column label="危险源">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.bb" placement="left">
            <span v-text="scope.row.aa"></span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;text-align: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import eform from "./form";
import { hazardClassification } from "@/dataSource";
export default {
  components: { eform },
  mixins: [initData],
  data() {
    return {
      isSuperAdmin: false,
      userInfo: {},
      selections: []
    };
  },
  mounted() {
    this.loading = false;
    this.data=hazardClassification;
    // this.data = [
    //   {
    //     id: "1",
    //     aa: "手册编写存在缺陷",
    //     bb: "职责、内容缺失等",
    //     cc: "管理文件",
    //     dd: "A1",
    //     ee: "一",
    //     children: [
    //       {
    //         id: "11",
    //         aa: "手册编写存在缺陷",
    //         bb: "职责、内容缺失等",
    //         cc: "管理手册",
    //         dd: "A1-01",
    //         ee: "二"
    //       }
    //     ]
    //   },
    //   {
    //     id: "2",
    //     aa: "方案制定存在缺陷",
    //     bb: "步骤缺失、依据错误、拼写错误、逻辑性差、方案错误、分类判定不准",
    //     cc: "技术文件",
    //     dd: "B1",
    //     ee: "一",
    //     children: [
    //       {
    //         id: "21",
    //         aa: "方案制定存在缺陷",
    //         bb:
    //           "步骤缺失、依据错误、拼写错误、逻辑性差、方案错误、分类判定不准",
    //         cc: "修理/排故方案",
    //         dd: "B1-01",
    //         ee: "二"
    //       }
    //     ]
    //   },
    //   {
    //     id: "3",
    //     aa: "未按规定分发文件",
    //     bb: "未覆盖所有涉及的单位，包括客户文件",
    //     cc: "文件控制",
    //     dd: "C1",
    //     ee: "一",
    //     children: [
    //       {
    //         id: "31",
    //         aa: "未按规定分发文件",
    //         bb: "未覆盖所有涉及的单位，包括客户文件",
    //         cc: "分发",
    //         dd: "C1-01",
    //         ee: "二"
    //       }
    //     ]
    //   }
    // ];
  },
  methods: {
    toQuery(name) {
      this.$message("功能正在创建中");
      // if (!name) {
      //   this.page = 1;
      //   this.init();
      //   return;
      // }
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    edit(row) {
      this.isAdd = false;
      let _this = this.$refs.form;
      _this.form = Object.assign({}, row);
      _this.dialog = true;
    },
    subDelete(id) {
      this.$confirm("确定删除嘛？")
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: "11",
            aa: "手册编写存在缺陷",
            bb: "职责、内容缺失等",
            cc: "管理手册",
            dd: "A1-01"
          }
        ]);
      }, 1000);
    },
    tableSpan({row, column, rowIndex, columnIndex}){
      if(columnIndex==0){
        if(row.span){
          return [row.span,1]
        }else{
          return [0,0]
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
.head-container {
  margin-bottom: 20px;
}
</style>
