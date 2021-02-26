
const state = {
    doctors: [],
    doctorsUnsubscriber: null,
}

const getters = {
    getDoctors: state => state.doctors,
}

const actions = {
    async fetchDoctors({ commit, rootState, state }) {
        state.doctors = []
        let doctorsUnsubscriber = rootState.login.userData.instituteRef.collection('doctors')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('doctorAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        });
                    }
                    if (change.type === 'modified') {
                        console.log('Modified doctor: ', change.doc.data());
                    }
                    if (change.type === 'removed') {
                        commit('doctorRemoved', change.doc.id)
                    }
                });
            });
            commit('setDoctorsUnsubscriber', doctorsUnsubscriber)
    },
    async fetchDoctorDataSurveys({ dispatch, rootState }, id) {
        try {
            let completed = [], incompleted = [];
            const resCompleted = await rootState.login.userData.instituteRef.collection('doctors').doc(id).collection('surveys').where('completed', '==', true).get();
            resCompleted.forEach(doc => {
                completed.push({
                    ...doc.data(),
                    id: doc.id,
                })
            })

            const resIncompleted = await rootState.login.userData.instituteRef.collection('doctors').doc(id).collection('surveys').where('completed', '==', false).get();
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
    },
    async unsubscribeDoctors({ state }) {
        if (state.doctorsUnsubscriber) {
            try {
                await state.doctorsUnsubscriber();
                state.doctorsUnsubscriber = null;
            } catch (error) {
                console.error(error)
            }
        }
    }
}

const mutations = {
    setDoctors: (state, data) => state.doctors = data,
    setDoctorsUnsubscriber: (state, data) => state.doctorsUnsubscriber = data,
    doctorAdded: (state, data) => state.doctors.push(data),
    doctorRemoved: (state, id) => state.doctors = state.doctors.filter(v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}