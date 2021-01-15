

const state = {
    riskNoticeTabIndex: "1",
    hiddenDangerTabIndex: "1"
}

const mutations = {
    setRiskNoticeTabIndex: (state, riskNoticeTabIndex) => {
        state.riskNoticeTabIndex = riskNoticeTabIndex
    },
    setHiddenDangerTabIndex: (state, hiddenDangerTabIndex) => {
        state.hiddenDangerTabIndex = hiddenDangerTabIndex
    },
}

const actions = {
    setRiskNoticeTabIndex({ commit }, riskNoticeTabIndex) {
        commit('setRiskNoticeTabIndex', riskNoticeTabIndex)
    },
    setHiddenDangerTabIndex({ commit }, hiddenDangerTabIndex) {
        commit('setHiddenDangerTabIndex', hiddenDangerTabIndex)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
