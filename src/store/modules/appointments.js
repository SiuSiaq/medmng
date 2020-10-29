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
            let appointments = []
            let res = await db.collection('appointments').get()
            res.forEach(doc => {
                let appointment = doc.data()
                appointment.id = doc.id
                appointments.push(appointment)
            })
            commit('setAppointments', appointments)
        } catch (error) {
            console.error(error)
        }
    },
    async addAppointment({commit, dispatch}, appointment) {
        try {
            appointment.created = new Date()
            appointment.date = new Date(appointment.date)
            appointment.patientRef = db.collection('patients').doc(appointment.patientRef)
            appointment.treatmentRef = db.collection('treatments').doc(appointment.treatmentRef)
            const res = await db.collection('appointments').add(appointment)
            appointment.id = res.id
            commit('appointmentCreated', appointment)
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
    appointmentCreated: (state, data) => state.appointments.unshift(data),
}

export default {
    state,
    getters,
    actions,
    mutations,
}