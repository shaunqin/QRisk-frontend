<template>
  <div class="dashboard-editor-container">
    <el-row class="r">
      <el-col :span="14" class="c-l">
        <div style="flex:1">
          <el-row :gutter="16">
            <el-col :span="6">
              <router-link to="/dataAnalysis" class="bottom">
                <div class="b">
                  <span class="b-t">数据分析</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-01.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/riskManagerment" class="bottom">
                <div class="b">
                  <span class="b-t">专项风险</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-03.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/safetyRiskPrompt" class="bottom">
                <div class="b">
                  <span class="b-t">风险提示</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-01.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/cruxRisk" class="bottom">
                <div class="b">
                  <span class="b-t">关键风险</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-01.png" />
                </div>
              </router-link>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <router-link to="/hazardsInvestigation" class="bottom">
                <div class="b">
                  <span class="b-t">隐患排查</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-04.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/standard" class="bottom">
                <div class="b">
                  <span class="b-t">规范标准</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-01.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/qualityEvaluation" class="bottom">
                <div class="b">
                  <span class="b-t">质量评价</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-05.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/standard" class="bottom">
                <div class="b">
                  <span class="b-t">Q-SMART</span>
                </div>
                <div class="img">
                  <img src="@/assets/images/home-01.png" />
                </div>
              </router-link>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10" class="c-r">
        <div class="notice">
          <span class="t">公告栏</span>
          <ul class="u">
            <li>
              <a :href="Manual.filePath" target="_blank">{{Manual.name}}</a>
            </li>
            <li>整合各事业部、分公司、运行支持部门在 Q-Risk 系统中所有用到的各类规范、标准。</li>
            <li>风险评价数据输出、安全风险提示和风险评价流程。</li>
            <li>安全隐患管控清单、安全隐患统计输出和重大安全隐患跟踪。</li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { queryOtherStand } from '@/api/standard';

export default {
  name: "DashboardEditor",
  data() {
    return {
      Manual: {}
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    queryOtherStand().then(res => {
      if (res.code == '200') {
        if (res.obj.length > 0) {
          let Manual = {};
          let item = res.obj[0];
          Manual.name = item.name;
          if (item.files.length > 0) {
            Manual.filePath = process.env.VUE_APP_BASE_API + item.files[0].filePath
          }
          this.Manual = Manual
        }
      }
    })
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: 100vh;
  padding: 20px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .r {
    height: 55vh;
    margin-top: 7vh;
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
      .bottom {
        text-align: center;
        padding: 10px;
        margin: 10px;
        display: block;
        background: rgba(36, 39, 142, 0.2);
        border-radius: 10px;
        .b {
          padding: 10px;
          font-size: 20px;
          font-weight: bold;
        }
        .img {
          padding: 10px;
          img {
            width: 80px;
          }
        }
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
@media screen and (max-width: 1400px) {
  .r2 {
    margin-left: -50px !important;
    margin-right: -50px !important;
    margin-top: 15px !important;
    .bottom {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
