<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
          style="color:#fff"
        >
          <!-- 风险提示 -->
          <el-badge
            class="safetyRiskPrompt"
            v-if="item.meta&&item.meta.title=='safetyRiskPrompt'"
            :value="riskNoticeCount"
            :hidden="riskNoticeCount==0"
          >
            <item
              :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
              :title="generateTitle(onlyOneChild.meta.title)"
            />
          </el-badge>
          <!-- 隐患排查 -->
          <el-badge
            class="hazardsInvestigation"
            v-else-if="item.meta&&item.meta.title=='hazardsInvestigation'"
            :value="hiddenDanger"
            :hidden="hiddenDanger==0"
          >
            <item
              :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
              :title="generateTitle(onlyOneChild.meta.title)"
            />
          </el-badge>
          <!-- 关键风险 -->
          <el-badge
            class="cruxRisk"
            v-else-if="item.meta&&item.meta.title=='cruxRisk'"
            :value="cruxRisk"
            :hidden="cruxRisk==0"
          >
            <item
              :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
              :title="generateTitle(onlyOneChild.meta.title)"
            />
          </el-badge>
          <!-- 专项风险 -->
          <el-badge
            class="riskManagerment"
            v-else-if="item.meta&&item.meta.title=='riskManagerment'"
            :value="riskManagerment"
            :hidden="riskManagerment==0"
          >
            <item
              :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
              :title="generateTitle(onlyOneChild.meta.title)"
            />
          </el-badge>
          <item
            v-else
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="generateTitle(onlyOneChild.meta.title)"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="generateTitle(item.meta.title)"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    riskNoticeCount: {
      type: Number,
      default: 0
    },
    hiddenDanger: {
      type: Number,
      default: 0
    },
    cruxRisk: {
      type: Number,
      default: 0
    },
    riskManagerment: {
      type: Number,
      default: 0
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
    }
  },
  mounted() {
    document.querySelector(".safetyRiskPrompt .el-badge__content").onclick = this.jumpRiskNotice
    document.querySelector(".hazardsInvestigation .el-badge__content").onclick = this.jumpHiddenDanger
    document.querySelector(".cruxRisk .el-badge__content").onclick = this.jumpCruxRisk
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },

    generateTitle,
    jumpRiskNotice(e) {
      this.$store.dispatch("riskSettings/setRiskNoticeTabIndex", "4");
    },
    jumpHiddenDanger(e) {
      this.$store.dispatch("riskSettings/setHiddenDangerTabIndex", "2");
    },
    jumpCruxRisk() {
      this.$store.dispatch("riskSettings/setCruxRiskTabIndex", "4");
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-badge__content.is-fixed {
  top: 15px;
  right: 24px;
}
</style>
