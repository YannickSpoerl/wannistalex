import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import AdminPanel from '../components/AdminComponents/AdminPanel.vue'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      let currentUser = firebase.auth().currentUser
      if(!currentUser){
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function() {
          currentUser = firebase.auth().currentUser
          if (currentUser && currentUser.email === 'spoerlyannick@gmail.com') {
            next()
          } else {
            next('/')
          }
        })
      } 
      if(currentUser && currentUser.email === 'spoerlyannick@gmail.com'){
        next()
      } else {
        next('/')
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
