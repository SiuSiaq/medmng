import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import privateConfig from '../privateConfig.js'

Vue.config.productionTip = false

const firebaseInitConfig = privateConfig.config.firebase

firebase.initializeApp({
  apiKey: firebaseInitConfig.apiKey,
  authDomain: firebaseInitConfig.authDomain,
  databaseURL: firebaseInitConfig.databaseURL,
  projectId: firebaseInitConfig.projectId,
  storageBucket: firebaseInitConfig.storageBucket,
  messagingSenderId: firebaseInitConfig.messagingSenderId,
  appId: firebaseInitConfig.appId,
  measurementId: firebaseInitConfig.measurementId
})

export const db = firebase.firestore();
export const auth = firebase.auth();
export const increment = firebase.firestore.FieldValue.increment(1);
export const decrement = firebase.firestore.FieldValue.increment(-1);
export const fieldValue = firebase.firestore.FieldValue;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
