import { db } from '@/main'

const state = {
    patients: [],
}

const getters = {
    getPatients: state => state.patients,
}

const actions = {
    async fetchPatients({ commit, rootState }) {
        rootState.login.userData.instituteRef.collection('patients')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('patientAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        });
                    }
                    if (change.type === 'modified') {
                        console.log('Modified patient: ', change.doc.data());
                    }
                    if (change.type === 'removed') {
                        commit('patientRemoved', change.doc.id)
                    }
                });
            });
    },
    async fetchPatientDataSurveys({ dispatch }, id) {
        try {
            let completed = [], incompleted = [];
            const resCompleted = await db.collection('users').doc(id).collection('surveys').where('completed', '==', true).get();
            resCompleted.forEach(doc => {
                completed.push({
                    ...doc.data(),
                    id: doc.id,
                })
            })

            const resIncompleted = await db.collection('users').doc(id).collection('surveys').where('completed', '==', false).get();
            resIncompleted.forEach(doc => {
                incompleted.push({
                    ...doc.data(),
                    id: doc.id,
                })
            })

            return { completed, incompleted }
        } catch (error) {
            console.error(error)
            dispatch('throwMainAlert', {
                text: 'Nie udało się pobrać ankiet pacjenta',
                success: false,
            })
        }
    }
}

const mutations = {
    setPatients: (state, data) => state.patients = data,
    patientAdded: (state, data) => state.patients.push(data),
    patientRemoved: (state, id) => state.patients = state.patients.filter(v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}