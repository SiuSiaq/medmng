import { db, fieldValue } from "@/main"
const state = {
    surveys: [],
    patientSurveys: [],
}

const getters = {
    getSurveys: state => state.surveys,
    getPatientSurveys: state => state.patientSurveys,
    getCompletedPatientSurveys: state => state.patientSurveys.filter(v => v.completed),
    getIncompletedPatientSurveys: state => state.patientSurveys.filter(v => !v.completed),
}

const actions = {
    async fetchSurveys({ commit }) {
        try {
            let temp = []
            let res = await db.collection('surveys').get()
            res.forEach(doc => {
                let survey = doc.data()
                survey.id = doc.id
                temp.push(survey)
            });
            commit('setSurveys', temp)
        } catch (error) {
            console.error(error)
        }
    },
    async fetchPatientSurveys({ commit, rootState }) {
        try {
            if (!rootState.login.user) {
                console.log('No user')
                return
            }
            let res = await db.collection('patients').doc(rootState.login.user.uid).get()
            let doc = res.data()
            commit('setPatientSurveys', doc.surveys)
        } catch (error) {
            console.error(error)
        }
    },
    async submitSurvey({ commit, rootState, dispatch }, survey) {
        try {
            survey.completed = true
            const res = await db.collection('patients').doc(rootState.login.user.uid).get()
            let surveys = res.data().surveys
            surveys.forEach((s) => {
                if(s.id === survey.id) {
                    s.completed = true
                    s.completedDate = new Date().toISOString().slice(0,10)
                }
            })
            await db.collection('patients').doc(rootState.login.user.uid).update({
                surveys: surveys,
            })
            commit('surveySubmited', survey)

            dispatch('throwSurveyAlert', {
                text: 'Ankieta wysłana pomyślnie',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Wysyłanie ankiety nie powiodło się',
                success: false,
            })
        }
    },
    async createSurvey({ commit, rootState, dispatch }, survey) {
        try {
            survey.date = new Date().toISOString().slice(0, 10)
            survey.author = db.collection('patients').doc(rootState.login.user.uid)
            survey.completed = false
            const res = await db.collection('surveys').add(survey)
            survey.id = res.id
            commit('surveyCreated', survey)
            dispatch('throwMainAlert', {
                text: 'Ankieta utworzona',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwMainAlert', {
                text: 'Nie udało się utworzyć ankiety',
                success: false,
            })
        }
    },
    async sendSurvey({ dispatch }, payload) {
        try {
            await db.collection('patients').doc(payload.id).update({
                surveys: fieldValue.arrayUnion(payload.survey)
            })
            dispatch('throwSurveyAlert', {
                text: 'Ankieta pomyślnie wysłana do pacjent',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Wysyłanie ankiety nie powiodło się',
                success: false,
            })
        }
    },
}

const mutations = {
    setSurveys: (state, data) => state.surveys = data,
    setPatientSurveys: (state, data) => state.patientSurveys = data,
    addPatientSurvey: (state, data) => state.patientSurveys.unshift(data),
    surveyCreated: (state, data) => state.surveys.unshift(data),
    surveySubmited: (state, data) => state.surveys.map((obj) => obj.id === data.id ? data : obj),
}

export default {
    state,
    getters,
    actions,
    mutations,
}