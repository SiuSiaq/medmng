import { db } from '@/main'
const state = {
    treatments: [],
}

const getters = {
    getTreatments: state => state.treatments,
}

const actions = {
    async fetchTreatments({ commit }) {
        try {
            const res = await db.collection('treatments').get()
            let treatments = []
            res.forEach(doc => {
                let treatment = doc.data()
                treatment.id = doc.id
                treatments.push(treatment)
            });
            commit('setTreatments', treatments)
        } catch (error) {
            console.error(error)
        }
    },
    async createTreatment({ commit, rootState, dispatch }, treatment) {
        try {
            treatment.authorName = rootState.login.userData.fullname
            treatment.authorRef = db.collection('patients').doc(rootState.login.userData.uid)
            treatment.created = new Date()
            const res = await db.collection('treatments').add(treatment)
            treatment.id = res.id
            commit('treatmentCreated', treatment)
            dispatch('throwSurveyAlert', {
                text: 'Zabieg został utworzony',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Nie udało się stworzyć zabiegu',
                success: false,
            })
        }
    },
}

const mutations = {
    setTreatments: (state, data) => state.treatments = data,
    treatmentCreated: (state, data) => state.treatments.unshift(data),
}

export default {
    state,
    getters,
    actions,
    mutations,
}