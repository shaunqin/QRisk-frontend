<template>
  <div class="dashboard-editor-container">
    <el-row class="r">
      <el-col :span="14" class="c-l">
        <div>
          <h1 class="t">Q-Risk风险管理系统</h1>
          <h4
            class="text"
          >该系统可以显著的提高各中心、分公司、运行支持部门安全质量管理的工作效率和准确度。为了更好的实现公司系统网络化有序管理，统一工作标准，加强数据的综合评估，从而实现全电子化管理，提高工作效率。</h4>
        </div>
      </el-col>
      <el-col :span="10" class="c-r">
        <div class="notice">
          <span class="t">公告栏</span>
          <ul class="u">
            <li>书连西高第光么万认斗本比圆定合历土心 到近听里信细难</li>
            <li>此院能认器温求按形气看更多系况团压眼向规住论给象始划议世部织他区此所法候者用火多切众造率老都。</li>
            <li>么领着种育及话业题样百电取口天表打等织日事进府使备治。</li>
            <li>最查北争力没力九油也度委周分者次被。</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row class="r2" :gutter="24">
      <el-col :span="6">
        <router-link to="/standard" class="bottom">
          <div class="img">
            <img src="@/assets/images/home-01.png" />
          </div>
          <div class="b">
            <span class="b-t">规范标准</span>
            <span class="b-desc">整合各事业部、分公司、运行支持部门在 Q-Risk 系统中所有用到的各类规范、标准。</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="6">
        <router-link to="/infoDatabase" class="bottom">
          <div class="img">
            <img src="@/assets/images/home-02.png" />
          </div>
          <div class="b">
            <span class="b-t">信息数据库</span>
            <span class="b-desc">整合各事业部、分公司、运行支持部门在 Q-Risk 系统中所有用到的各类规范、标准。</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="6">
        <router-link to="/dangerManagerment" class="bottom">
          <div class="img">
            <img src="@/assets/images/home-03.png" />
          </div>
          <div class="b">
            <span class="b-t">风险管理</span>
            <span class="b-desc">风险评价数据输出、安全风险提示和风险评价流程。</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="6">
        <router-link to="/hiddenDangerInvestigation" class="bottom">
          <div class="img">
            <img src="@/assets/images/home-04.png" />
          </div>
          <div class="b">
            <span class="b-t">隐患排查</span>
            <span class="b-desc">安全隐患管控清单、安全隐患统计输出和重大安全隐患跟踪。</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="6">
        <router-link to="/qualityEvaluation" class="bottom">
          <div class="img">
            <img src="@/assets/images/home-05.png" />
          </div>
          <div class="b">
            <span class="b-t">质量评价</span>
            <span class="b-desc">安全隐患管控清单、安全隐患统计输出和重大安全隐患跟踪。</span>
          </div>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DashboardEditor",
  data() {
    return {
      emptyGif:
        "https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: calc(100vh - 56px);
  padding: 20px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .r {
    height: 55vh;
    .c-l {
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      .t {
        letter-spacing: 3px;
      }
      .text {
        line-height: 2;
        letter-spacing: 3px;
        font-weight: normal;
      }
    }
    .c-r {
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
      .notice {
        display: block;
        width: 70%;
        margin: 0 auto;
        background: rgba(36, 39, 142, 0.4);
        padding: 0 10px 10px;
        border-radius: 8px;
        .t {
          display: block;
          font-size: 20px;
          color: #fff;
          text-align: center;
          padding: 30px 0 20px;
          font-weight: bold;
        }
        .u {
          margin-top: 0;
          padding-left: 20px;
          color: #fff;
          li {
            margin-bottom: 10px;
            line-height: 1.5;
          }
        }
      }
    }
  }
  .r2 {
    margin-top: 20px;
    display: flex;
    .bottom {
      display: flex;
      color: #fff;
      padding: 20px 10px;
      &:hover {
        background: rgba(0, 123, 255, 0.1);
        border-radius: 4px;
      }
      .img {
        width: 100px;
        img {
          width: 100%;
        }
      }
      .b {
        flex: 1;
        padding-left: 10px;
        .b-t {
          display: block;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .b-desc {
          line-height: 1.5;
          display: block;
        }
      }
    }
  }
}
</style>
