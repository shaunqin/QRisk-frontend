// const jwt = require('jsonwebtoken')
import { login, logout, tokenLogin, qrLogin } from '@/api/login'
import { findCurrentUser } from '@/api/emplotee'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  userInfo: {
    id: '',
    userName: '',
    userDesc: '',
    avatarPath: '',
    phone: '',
    address: '',
    email: '',
    enabled: ''
  }, // 当前登录用户的个人信息
  roles: [], // 当前登录用户的权限集合
  token: getToken('Token'),
  checkToken: false,
  jwtObj: { // 当前登录用户的用户令牌包含的信息
    sub: '', // 用户名
    iat: '', // 开始时间
    exp: '' // 超时时间
  },
  resetChart: '', // 监听是否需要重新加载图表
  monthReportEnable: false, // 角色是否有权限生成月报
}

const mutations = {
  SET_TOKEN: (state, token) => {
    setToken('Token', token)
    state.token = token
  },
  SET_JWTOBJ: (state, jwtObj) => {
    state.jwtObj = jwtObj
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
    if (userInfo.roleList.includes('SUPER_ADMIN') || userInfo.roleList.includes('ADMIN') || userInfo.roles.some(r => r.deptPath == '000003' && r.code == 'RISK_MANAGER')) {
      state.monthReportEnable = true;
    } else {
      state.monthReportEnable = false;
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CHECKTOKEN: (state, checkToken) => {
    state.checkToken = checkToken
  },
  SET_RESETCHART(state, resetChart) {
    state.resetChart = resetChart;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        userName: userName.trim(),
        password: password
      }).then(response => {
        if (!response || response.ok === false) {
          resolve(false)
        }
        // console.log(response)
        commit('SET_TOKEN', response.obj)
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  },
  qrLogin({ commit }, token) {
    return new Promise((resolve, reject) => {
      qrLogin({ token: token }).then(response => {
        if (!response || response.ok === false) {
          resolve(response)
        }
        // console.log(response)
        commit('SET_TOKEN', response.obj)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      findCurrentUser().then(response => {
        if (response.code === '200') {
          let roles = ['admin', ...response.obj.roleList];
          const data = {
            roles: roles
          }
          commit('SET_ROLES', roles)
          commit('SET_USERINFO', response.obj)
          resolve(data)
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken('Token')
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Token')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  changeToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      resolve()
    })
  },
  tokenLogin({ commit }, data) {
    return new Promise((resolve, reject) => {
      tokenLogin(data).then(response => {
        if (!response || response.ok === false || response.code != '200') {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken('Token')
          resetRouter()
          resolve(false)
        }
        // 本地token验证通过
        if (response.obj) {
          commit('SET_TOKEN', response.obj)
        }
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
