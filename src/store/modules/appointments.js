import { db } from '@/main'

const state = {
    appointments: [],
}

const getters = {
    getAppointments: state => state.appointments,
}

const actions = {
    async fetchAppointments({ commit, rootState }) {
        try {
            rootState.login.userData.wardRef.collection('appointments')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            commit('appointmentAdded', {
                                ...change.doc.data(),
                                id: change.doc.id,
                            });
                        }
                        if (change.type === 'modified') {
                            //console.log('Modified appointment: ', change.doc.data());
                        }
                        if (change.type === 'removed') {
                            commit('appointmentRemoved', change.doc.id)
                        }
                    });
                });
        } catch (error) {
            console.error(error)
        }
    },
    async addAppointment({ rootState, dispatch }, appointment) {
        try {
            const batch = db.batch()
            let appointmentRef = rootState.login.userData.wardRef.collection('appointments').doc()
            appointment.created = new Date()
            appointment.date = new Date(appointment.date)
            appointment.patientRef = rootState.login.userData.instituteRef.collection('patients').doc(appointment.patientRef)
            appointment.doctorRef = rootState.login.userData.instituteRef.collection('doctors').doc(appointment.doctorRef)
            appointment.treatmentRef = rootState.login.userData.wardRef.collection('treatments').doc(appointment.treatmentRef)
            appointment.surveys.forEach(survey => {
                let appointmentSurveyRef = appointmentRef.collection('surveys').doc()
                batch.set(appointmentSurveyRef, survey)
                if (survey.timeType === 'Natychmiast') {
                    if (survey.type === 'patient') {
                        let ref = rootState.login.userData.instituteRef.collection('patients').doc(appointment.patientRef.id).collection('surveys').doc()
                        let fullSurvey = rootState.surveys.surveys.find(s => s.id === survey.ref.id)
                        if (fullSurvey) batch.set(ref, {
                            ...fullSurvey,
                            sent: new Date(),
                            appointmentRef,
                            appointmentSurveyRef,
                            surveyRef: survey.ref,
                        })
                        survey.sent = new Date()
                        survey.surveyRef = survey.ref
                    }
                    if (survey.type === 'doctor') {
                        let ref = rootState.login.userData.instituteRef.collection('doctors').doc(appointment.doctorRef.id).collection('surveys').doc()
                        let fullSurvey = rootState.surveys.surveys.find(s => s.id === survey.ref.id)
                        if (fullSurvey) batch.set(ref, {
                            ...fullSurvey,
                            sent: new Date(),
                            appointmentRef,
                            appointmentSurveyRef,
                            surveyRef: survey.ref,
                        })
                        survey.sent = new Date()
                        survey.surveyRef = survey.ref
                    }
                }
            })
            batch.set(appointmentRef, appointment)
            await batch.commit()
            dispatch('throwSurveyAlert', {
                text: 'Umówiono zabieg',
                success: true,
            })
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Nie udało się umówić zabiegu',
                success: false,
            })
        }
    },
    async fetchAppointmentSurveys({ dispatch, rootState }, id) {
        try {
            const res = await rootState.login.userData.wardRef.collection('appointments').doc(id).collection('surveys').get()
            let surveys = []
            res.forEach(doc => {
                surveys.push({
                    ...doc.data(),
                    id: doc.id,
                })
            })
            return surveys
        } catch (error) {
            console.error(error)
            dispatch('throwMainAlert', {
                text: 'Nie udało się pobrać ankiet zabiegu',
                success: false,
            })
        }
    }
}

const mutations = {
    setAppointments: (state, data) => state.appointments = data,
    appointmentAdded: (state, data) => state.appointments.unshift(data),
    appointmentRemoved: (state, id) => state.appointments = state.appointments.filter(v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}