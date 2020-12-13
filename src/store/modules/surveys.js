import { db } from "@/main"
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
                temp.push({
                    ...doc.data(),
                    id: doc.id,
                })
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
            let surveys = []
            let res = await db.collection('patients').doc(rootState.login.user.uid).collection('surveys').get()
            res.forEach(doc => {
                surveys.push({
                    ...doc.data(),
                    id: doc.id,
                })
            })
            commit('setPatientSurveys', surveys)
        } catch (error) {
            console.error(error)
        }
    },
    async submitSurvey({ commit, rootState, dispatch }, survey) {
        try {
            survey.completed = true
            const batch = db.batch();

            const patientSurveyRef = db.collection('patients').doc(rootState.login.user.uid).collection('surveys').doc(survey.id);
            const surveyRef = db.collection('surveys').doc(survey.surveyId).collection('completedSurveys').doc();


            batch.update(patientSurveyRef, {
                completed: true,
                fields: survey.fields,
            })

            let data = {}
            survey.fields.forEach(v => {
                data[v.columnName] = v.data
            })

            batch.set(surveyRef, {
                data,
                submited: new Date(),
            })

            await batch.commit();

            commit('surveySubmited', survey)
            commit('patientSurveySubmited', survey)

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
            dispatch('throwSurveyAlert', {
                text: 'Ankieta utworzona',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Nie udało się utworzyć ankiety',
                success: false,
            })
        }
    },
    async sendSurvey({ dispatch }, payload) {
        try {
            await db.collection('patients').doc(payload.id).collection('surveys').add({
                ...payload.survey,
                surveyId: payload.survey.id,
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
    async downloadSurvey({ dispatch }, id) {
        let data = []
        const res = await db.collection('surveys').doc(id).collection('completedSurveys').get()
        res.forEach(doc => {
            data.push(
                doc.data().data
            )
        })
        dispatch('throwMainAlert', {
            text: 'Pomyślnie przygotowano dane do pobrania',
            success: true,
        })
        return data
    }
}

const mutations = {
    setSurveys: (state, data) => state.surveys = data,
    setPatientSurveys: (state, data) => state.patientSurveys = data,
    addPatientSurvey: (state, data) => state.patientSurveys.unshift(data),
    surveyCreated: (state, data) => state.surveys.unshift(data),
    surveySubmited: (state, data) => state.surveys.map((obj) => obj.id === data.id ? data : obj),
    patientSurveySubmited: (state, data) => state.patientSurveys.map((obj) => obj.id === data.id ? data : obj),
}

export default {
    state,
    getters,
    actions,
    mutations,
}