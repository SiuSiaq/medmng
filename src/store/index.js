import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import surveys from './modules/surveys'
import patients from './modules/patients'

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
  }
})
