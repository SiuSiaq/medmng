import { db, increment } from "@/main"
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
    async fetchSurveys({ commit, rootState }) {
        try {
            rootState.login.userData.wardRef.collection('surveys')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            commit('surveyAdded', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'modified') {
                            commit('surveyModified', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'removed') {
                            commit('surveyRemoved', change.doc.id)
                        }
                    });
                });
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
            rootState.login.userData.instituteRef.collection('patients').doc(rootState.login.user.uid).collection('surveys')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            commit('patientSurveyAdded', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'modified') {
                            commit('patientSurveyModified', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'removed') {
                            commit('patientSurveyRemoved', change.doc.id)
                        }
                    });
                });
        } catch (error) {
            console.error(error)
        }
    },
    async submitSurvey({ rootState, dispatch }, survey) {
        try {
            survey.completed = true
            survey.submitted = new Date()
            const batch = db.batch()

            const patientSurveyRef = rootState.login.userData.instituteRef.collection('patients').doc(rootState.login.user.uid).collection('surveys').doc(survey.id);
            const surveyRef = survey.surveyRef;

            let data = {}
            survey.fields.forEach(v => {
                data[v.columnName] = v.data
            })


            batch.update(patientSurveyRef, {
                completed: true,
                fields: survey.fields,
                submitted: new Date(),
            })

            if(survey.appointmentSurveyRef) {
                batch.update(survey.appointmentSurveyRef, {
                    completed: true,
                    fields: survey.fields,
                    submitted: new Date(),
                    data,
                })
            }

            batch.set(surveyRef.collection('submittedSurveys').doc(), {
                data,
                submitted: new Date(),
            })

            if(survey.appointmentRef) {
                batch.update(survey.appointmentRef, {
                    surveyCount: increment,
                })
            }

            await batch.commit();

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
    async createSurvey({ rootState, dispatch }, survey) {
        try {
            survey.date = new Date().toISOString().slice(0, 10)
            survey.author = rootState.login.userData.instituteRef.collection('patients').doc(rootState.login.user.uid)
            survey.completed = false
            const res = await rootState.login.userData.wardRef.collection('surveys').add(survey)
            survey.id = res.id
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
    async sendSurvey({ dispatch, rootState }, payload) {
        try {
            await rootState.login.userData.instituteRef.collection('patients').doc(payload.id).collection('surveys').add({
                ...payload.survey,
                surveyRef: rootState.login.userData.wardRef.collection('surveys').doc(payload.survey.id),
                sent: new Date(),
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
    async downloadSurvey({ dispatch, rootState }, id) {
        let data = []
        const res = await rootState.login.userData.wardRef.collection('surveys').doc(id).collection('submittedSurveys').get()
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
    patientSurveyAdded: (state, data) => state.patientSurveys.unshift(data),
    patientSurveyRemoved: (state, id) => state.patientSurveys = state.patientSurveys.filter(v => v.id !== id),
    patientSurveyModified: (state, data) => state.patientSurveys.map((obj) => obj.id === data.id ? data : obj),
    surveyAdded: (state, data) => state.surveys.unshift(data),
    surveyRemoved: (state, id) => state.surveys = state.surveys.filter(v => v.id !== id),
    surveyModified: (state, data) => state.surveys.map((obj) => obj.id === data.id ? data : obj),
    patientSurveysubmitted: (state, data) => state.patientSurveys.map((obj) => obj.id === data.id ? data : obj),
}

export default {
    state,
    getters,
    actions,
    mutations,
}