

const state = {
    riskNoticeTabIndex: "1",
    hiddenDangerTabIndex: "1",
    cruxRiskTabIndex: "1",
}

const mutations = {
    setRiskNoticeTabIndex: (state, riskNoticeTabIndex) => {
        state.riskNoticeTabIndex = riskNoticeTabIndex
    },
    setHiddenDangerTabIndex: (state, hiddenDangerTabIndex) => {
        state.hiddenDangerTabIndex = hiddenDangerTabIndex
    },
    setCruxRiskTabIndex: (state, cruxRiskTabIndex) => {
        state.cruxRiskTabIndex = cruxRiskTabIndex
    },
}

const actions = {
    setRiskNoticeTabIndex({ commit }, riskNoticeTabIndex) {
        commit('setRiskNoticeTabIndex', riskNoticeTabIndex)
    },
    setHiddenDangerTabIndex({ commit }, hiddenDangerTabIndex) {
        commit('setHiddenDangerTabIndex', hiddenDangerTabIndex)
    },
    setCruxRiskTabIndex({ commit }, cruxRiskTabIndex) {
        commit('setCruxRiskTabIndex', cruxRiskTabIndex)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
