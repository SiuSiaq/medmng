const state = {
    mainAlert: {
        show: false,
        text: '',
        success: true,
    },
    surveyAlert: {
        show: false,
        text: '',
        success: true,
    }
}

const getters = {
    getMainAlert: state => state.mainAlert,
    getSurveyAlert: state => state.surveyAlert,
}

const actions = {
    async throwMainAlert({ commit }, alert) {
        alert.show = true
        commit('setMainAlert', alert)
        setTimeout(() => {
            commit('setMainAlert', {
                show: false,
                text: '',
                success: true,
            })
        }, 2000)
    },
    async throwSurveyAlert({ commit }, alert) {
        alert.show = true
        commit('setSurveyAlert', alert)
        setTimeout(() => {
            commit('setSurveyAlert', {
                show: false,
                text: '',
                success: true,
            })
        }, 2000)
    },
}

const mutations = {
    setMainAlert: (state, data) => state.mainAlert = data,
    setSurveyAlert: (state, data) => state.surveyAlert = data,
}

export default {
    state,
    getters,
    actions,
    mutations,
}