const state = {
    treatments: [],
}

const getters = {
    getTreatments: state => state.treatments,
}

const actions = {
    async fetchTreatments({ commit, rootState }) {
        rootState.login.userData.wardRef.collection('treatments')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('treatmentCreated', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        });
                    }
                    if (change.type === 'modified') {
                        console.log('Modified treatment: ', change.doc.data());
                    }
                    if (change.type === 'removed') {
                        commit('treatmentRemoved', change.doc.id)
                    }
                });
            });
    },
    async createTreatment({ rootState, dispatch }, treatment) {
        try {
            treatment.authorName = rootState.login.userData.fullname
            treatment.authorRef = rootState.login.userData.instituteRef.collection('patients').doc(rootState.login.userData.uid)
            treatment.created = new Date()
            await rootState.login.userData.wardRef.collection('treatments').add(treatment)
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
    async downloadTreatmentData({ dispatch, rootState }, id) {
        try {
            let data = []
            const res = await rootState.login.userData.wardRef.collection('treatments').doc(id).collection('surveysData').get()
            res.forEach(doc => {
                let obj;
                doc.data().data.forEach(field => {
                    obj = Object.assign({}, obj, field);
                });
                data.push(obj);
            })
            dispatch('throwMainAlert', {
                text: 'Pomyślnie przygotowano dane do pobrania',
                success: true,
            })
            return data
        } catch (error) {
            console.error(error);
            dispatch('throwMainAlert', {
                text: 'Nie udało się przygotować danych do pobrania',
                success: false,
            })
        }
    }
}

const mutations = {
    setTreatments: (state, data) => state.treatments = data,
    treatmentCreated: (state, data) => state.treatments.unshift(data),
    treatmentRemoved: (state, id) => state.treatments = state.treatments.filter(v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}