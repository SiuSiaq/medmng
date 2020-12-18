import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '@/main'
import Home from '@/views/Home'
import Surveys from '@/views/Surveys'
import CreateSurvey from '@/views/CreateSurvey'
import Person from '@/views/Person'
import Treatments from '@/views/Treatments'
import Appointments from '@/views/Appointments'
import Patients from '@/views/Patients'
import Login from '@/views/Login'
import Register from '@/views/Register'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/surveys',
    name: 'Surveys',
    component: Surveys,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/createsurvey',
    name: 'CreateSurvey',
    component: CreateSurvey,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/personaldata',
    name: 'PersonalData',
    component: Person,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/treatments',
    name: 'Treatments',
    component: Treatments,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: Appointments,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/patients',
    name: 'Patients',
    component: Patients,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresGuest: true,
    },
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!auth.currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (auth.currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router
