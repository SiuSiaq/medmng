import { db } from '@/main'

const state = {
    patients: [],
}

const getters = {
    getPatients: state => state.patients,
}

const actions = {
    async fetchPatients({commit}) {
        try {
            let patients = []
            let res = await db.collection('patients').get()
            res.forEach(doc => {
                let patient = doc.data()
                patient.id = doc.id
                patients.push(patient)
            })
            commit('setPatients', patients)
        } catch (error) {
            console.error(error)
        }
    },
}

const mutations = {
    setPatients: (state, data) => state.patients = data,
}

export default {
    state,
    getters,
    actions,
    mutations,
}