import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import surveys from './modules/surveys'
import patients from './modules/patients'
import doctors from './modules/doctors'
import alert from './modules/alert'
import treatments from './modules/treatments'
import appointments from './modules/appointments'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    login,
    surveys,
    patients,
    doctors,
    alert,
    treatments,
    appointments,
  }
})
