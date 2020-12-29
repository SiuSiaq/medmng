import { db } from '@/main'

const state = {
    appointments: [],
}

const getters = {
    getAppointments: state => state.appointments,
}

const actions = {
    async fetchAppointments({commit}) {
        try {
            db.collection('appointments')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        commit('appointmentAdded', {
                            ...change.doc.data(),
                            id: change.doc.id,
                        });
                    }
                    if (change.type === 'modified') {
                        console.log('Modified appointment: ', change.doc.data());
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
    async addAppointment({ dispatch }, appointment) {
        try {
            appointment.created = new Date()
            appointment.date = new Date(appointment.date)
            appointment.patientRef = db.collection('patients').doc(appointment.patientRef)
            appointment.treatmentRef = db.collection('treatments').doc(appointment.treatmentRef)
            const res = await db.collection('appointments').add(appointment)
            appointment.id = res.id
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
    }
}

const mutations = {
    setAppointments: (state, data) => state.appointments = data,
    appointmentAdded: (state, data) => state.appointments.unshift(data),
    appointmentRemoved: (state, id) => state.appointments = state.appointments.filter( v => v.id !== id),
}

export default {
    state,
    getters,
    actions,
    mutations,
}