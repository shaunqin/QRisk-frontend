import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: 'dashboard',
      icon: 'dashboard',
      affix: true
    }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/standard',
  component: Layout,
  meta: {
    title: 'standard',
    icon: 'standard'
  },
  redirect: '/standard/infoCategory',
  children: [{
    path: 'infoCategory',
    component: () => import('@/views/standard/infoCategory/index'),
    meta: {
      title: 'infoCategory',
      icon: 'skill'
    },
    redirect: '/standard/infoCategory/productSystem',
    hidden: true,
    children: [
      // {
      //   path: 'dataSources',
      //   component: () => import('@/views/standard/infoCategory/dataSources/index'),
      //   name: 'dataSources',
      //   meta: { title: 'dataSources' }
      // },
      // {
      //   path: 'responsibleUnit',
      //   component: () => import('@/views/standard/infoCategory/responsibleUnit/index'),
      //   name: 'responsibleUnit',
      //   meta: { title: 'responsibleUnit' }
      // },
      {
        path: 'productSystem',
        component: () => import('@/views/standard/infoCategory/productSystem/index'),
        name: 'productSystem',
        meta: {
          title: 'productSystem'
        }
      },
      {
        path: 'hazardClassification',
        component: () => import('@/views/standard/infoCategory/hazardClassification/index'),
        name: 'hazardClassification',
        meta: {
          title: 'hazardClassification'
        }
      },
      {
        path: 'riskList',
        component: () => import('@/views/standard/infoCategory/riskList/index'),
        name: 'riskList',
        meta: {
          title: 'riskList'
        }
      },
      {
        path: 'incentiveList',
        component: () => import('@/views/standard/infoCategory/incentiveList/index'),
        name: 'incentiveList',
        meta: {
          title: 'incentiveList'
        }
      }
    ]
  },
  {
    path: 'riskEvaluateStandard',
    component: () => import('@/views/standard/riskEvaluateStandard/index'),
    meta: {
      title: 'riskEvaluateStandard',
      icon: 'clipboard'
    },
    redirect: '/standard/riskEvaluateStandard/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/standard/riskEvaluateStandard/components/index'),
      name: 'index',
      meta: {
        title: 'index'
      }
    }]
  },
  {
    path: 'otherStandard',
    component: () => import('@/views/standard/otherStandard/index'),
    meta: {
      title: 'otherStandard',
      icon: 'clipboard'
    },
    redirect: '/standard/otherStandard/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/standard/otherStandard/components/index'),
      name: 'otherStandardIndex',
      meta: {
        title: 'otherStandardIndex'
      }
    }]
  }
  ]
},
{
  path: '/dataAnalysis',
  component: Layout,
  meta: {
    title: 'dataAnalysis',
    icon: 'tree'
  },
  redirect: '/dataAnalysis/infoDatabase',
  children: [
    {
      path: 'infoDatabase',
      component: () => import('@/views/dataAnalysis/infoDatabase/index'),
      meta: {
        title: 'infoDatabase',
        icon: 'infoDatabase'
      },
      redirect: '/dataAnalysis/infoDatabase/supervision',
      hidden: true,
      children: [
        {
          path: 'supervision',
          component: () => import('@/views/dataAnalysis/infoDatabase/supervision/index'),
          name: 'supervision',
          hidden: true,
          meta: {
            title: 'supervision'
          }
        },
        {
          path: 'safeSelfExamination',
          component: () => import('@/views/dataAnalysis/infoDatabase/safeSelfExamination/index'),
          name: 'safeSelfExamination',
          hidden: true,
          meta: {
            title: 'safeSelfExamination'
          }
        },
        {
          path: 'qualityAudit',
          component: () => import('@/views/dataAnalysis/infoDatabase/qualityAudit/index'),
          name: 'qualityAudit',
          hidden: true,
          meta: {
            title: 'qualityAudit'
          }
        },
        {
          path: 'externalInspection',
          component: () => import('@/views/dataAnalysis/infoDatabase/externalInspection/index'),
          name: 'externalInspection',
          hidden: true,
          meta: {
            title: 'externalInspection'
          }
        },
        {
          path: 'safeInvestigation',
          component: () => import('@/views/dataAnalysis/infoDatabase/safeInvestigation/index'),
          name: 'safeInvestigation',
          hidden: true,
          meta: {
            title: 'safeInvestigation'
          }
        },
        {
          path: 'qualityInvestigation',
          component: () => import('@/views/dataAnalysis/infoDatabase/qualityInvestigation/index'),
          name: 'qualityInvestigation',
          hidden: true,
          meta: {
            title: 'qualityInvestigation'
          }
        },
        {
          path: 'customerComplaints',
          component: () => import('@/views/dataAnalysis/infoDatabase/customerComplaints/index'),
          name: 'customerComplaints',
          hidden: true,
          meta: {
            title: 'customerComplaints'
          }
        },
      ]
    },
    {
      path: 'riskEvaluateMonthly',
      component: () => import('@/views/dataAnalysis/riskEvaluateMonthly/pageindex'),
      meta: {
        title: 'riskEvaluateMonthly',
        icon: 'riskEvaluateMonthly'
      },
      redirect: '/dataAnalysis/riskEvaluateMonthly/index',
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/dataAnalysis/riskEvaluateMonthly/index'),
          name: 'index',
          meta: {
            title: 'index'
          }
        }
      ]
    },
    {
      path: 'riskManageControl',
      component: () => import('@/views/dataAnalysis/riskManageControl/pageindex'),
      meta: {
        title: 'riskManageControl',
        icon: 'riskManageControl'
      },
      redirect: '/dataAnalysis/riskManageControl/index',
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/dataAnalysis/riskManageControl/index'),
          name: 'index',
          meta: {
            title: 'index'
          }
        }
      ]
    }
  ]
},
{
  path: '/riskManagerment',
  component: Layout,
  meta: {
    title: 'riskManagerment',
    icon: 'riskManagerment'
  },
  redirect: '/riskManagerment/page',
  children: [{
    path: 'page',
    component: () => import('@/views/riskManagerment/index'),
    meta: {
      title: 'riskManagerment',
      icon: 'dangerManagerment'
    },
    hidden: true,
    redirect: '/riskManagerment/page/riskAssessment',
    children: [
      {
        path: 'riskAssessment',
        component: () => import('@/views/riskManagerment/riskAssessment/index'),
        name: 'riskAssessment',
        hidden: true,
        meta: {
          title: 'riskAssessment'
        }
      },
      {
        path: 'riskControl',
        component: () => import('@/views/riskManagerment/riskControl/index'),
        name: 'riskControl',
        hidden: true,
        meta: {
          title: 'riskControl'
        }
      }
    ]
  }]
},
{
  path: '/safetyRiskPrompt',
  component: Layout,
  meta: {
    title: 'safetyRiskPrompt',
    icon: 'bug'
  },
  redirect: '/safetyRiskPrompt/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/safetyRiskPrompt/index'),
      meta: {
        title: 'index',
        icon: 'index'
      },
      hidden: true,
    }
  ]
},
{
  path: '/hiddenDangerInvestigation',
  component: Layout,
  meta: {
    title: 'hiddenDangerInvestigation',
    icon: 'bug'
  },
  redirect: '/hiddenDangerInvestigation/index',
  children: [{
    path: 'index',
    component: () => import('@/views/hiddenDangerInvestigation/index'),
    meta: {
      title: 'hiddenDangerInvestigation',
      icon: 'hiddenDangerInvestigation'
    },
    hidden: true,
    redirect: '/hiddenDangerInvestigation/index/safetyHazardsReport',
    children: [
      // {
      //   path: 'safetyHazardControlList',
      //   component: () => import('@/views/hiddenDangerInvestigation/safetyHazardControlList/index'),
      //   name: 'safetyHazardControlList',
      //   hidden: true,
      //   meta: {
      //     title: 'safetyHazardControlList'
      //   }
      // },
      {
        path: 'safetyHazardsReport',
        component: () => import('@/views/hiddenDangerInvestigation/safetyHazardsReport/index'),
        name: 'safetyHazardsReport',
        hidden: true,
        meta: {
          title: 'safetyHazardsReport'
        }
      },
      {
        path: 'safetyHazardsControl',
        component: () => import('@/views/hiddenDangerInvestigation/safetyHazardsControl/index'),
        name: 'safetyHazardsControl',
        meta: {
          title: 'safetyHazardsControl'
        }
      }
    ]
  }]
},
{
  path: '/qualityEvaluation',
  component: Layout,
  meta: {
    title: 'qualityEvaluation',
    icon: 'star'
  },
  redirect: '/qualityEvaluation/q',
  children: [{
    path: 'q',
    component: () => import('@/views/qualityEvaluation/index'),
    meta: {
      title: 'qualityEvaluation',
      icon: 'qualityEvaluation'
    },
    hidden: true,
    redirect: '/qualityEvaluation/q/qualityEvaluate',
    children: [{
      path: 'qualityEvaluate',
      component: () => import('@/views/qualityEvaluation/qualityEvaluate/index'),
      name: 'qualityEvaluate',
      hidden: true,
      meta: {
        title: 'qualityEvaluate'
      }
    },
    {
      path: 'taskHairdown',
      component: () => import('@/views/qualityEvaluation/taskHairdown/index'),
      name: 'taskHairdown',
      hidden: true,
      meta: {
        title: 'taskHairdown'
      }
    }, {
      path: 'qualityReport',
      component: () => import('@/views/qualityEvaluation/qualityReport/index'),
      name: 'qualityReport',
      hidden: true,
      meta: {
        title: 'qualityReport'
      }
    }]
  }]
},
/* {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  name: 'SystemManage',
  meta: {
    title: 'systemManage',
    icon: 'component'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/Employee/index.vue'),
      name: 'UserManage',
      meta: { title: 'userManage' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index.vue'),
      name: 'RolesManage',
      meta: { title: 'rolesManage' }
    },
    {
      path: 'auth',
      component: () => import('@/views/system/auth/index.vue'),
      name: 'AuthorityManage',
      meta: { title: 'authorityManage' }
    },
    {
      path: 'dict',
      component: () => import('@/views/system/dict/index.vue'),
      name: 'DataDictionary',
      meta: { title: 'dataDictionary' }
    }
  ]
}, */

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
