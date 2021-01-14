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
            appointment.patientRef = db.collection('users').doc(appointment.patientRef)
            appointment.doctorRef = db.collection('users').doc(appointment.doctorRef)
            appointment.treatmentRef = rootState.login.userData.wardRef.collection('treatments').doc(appointment.treatmentRef)
            appointment.surveys.forEach(survey => {
                let appointmentSurveyRef = appointmentRef.collection('surveys').doc()
                let fullSurvey = rootState.surveys.surveys.find(s => s.id === survey.ref.id)
                if (fullSurvey) {
                    let userRef;
                    if (survey.type === 'patient')
                        userRef = db.collection('users').doc(appointment.patientRef.id).collection('surveys').doc()
                    else
                        userRef = db.collection('users').doc(appointment.doctorRef.id).collection('surveys').doc()

                    if (survey.timeType === 'Natychmiast') {
                        batch.set(userRef, {
                            ...fullSurvey,
                            sent: true,
                            sentDate: new Date(),
                            appointmentRef,
                            appointmentSurveyRef,
                            surveyRef: survey.ref,
                        })
                        survey.sentDate = new Date()
                        survey.sent = true;
                        survey.status = "sent"
                        survey.surveyRef = survey.ref

                    } else {
                        batch.set(db.collection('appointment_surveys').doc(appointmentSurveyRef.id), {
                            ...fullSurvey,
                            sendDate: new Date(survey.sendDate.toDateString()),
                            sent: false,
                            appointmentRef,
                            appointmentSurveyRef,
                            surveyRef: survey.ref,
                            userRef,
                        })
                        survey.status = "pending"
                        survey.surveyRef = survey.ref
                    }

                    batch.set(appointmentSurveyRef, survey)
                }
            })
            delete appointment.surveys

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