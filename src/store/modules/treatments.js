import { db } from '@/main'
const state = {
    treatments: [],
}

const getters = {
    getTreatments: state => state.treatments,
}

const actions = {
    async fetchTreatments({ commit }) {
        db.collection('treatments')
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
            treatment.authorRef = db.collection('patients').doc(rootState.login.userData.uid)
            treatment.created = new Date()
            await db.collection('treatments').add(treatment)
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
    treatmentRemoved: (state, id) => state.treatments = state.treatments.filter(v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}