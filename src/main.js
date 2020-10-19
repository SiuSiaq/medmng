import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyAINieDLMEqDv9cm4Tbj9xyB4innfdwSK8",
  authDomain: "medmng-ecc2d.firebaseapp.com",
  databaseURL: "https://medmng-ecc2d.firebaseio.com",
  projectId: "medmng-ecc2d",
  storageBucket: "medmng-ecc2d.appspot.com",
  messagingSenderId: "541660406802",
  appId: "1:541660406802:web:fd2aa1d39e8c0babbe24cb"

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
