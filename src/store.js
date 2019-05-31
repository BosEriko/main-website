import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from 'firebase/app'
import 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCz3laxK1vMpEpjJFXSx8UyzlH7mE4KBT0',
  authDomain: 'kuru-anime-network.firebaseapp.com',
  databaseURL: 'https://kuru-anime-network.firebaseio.com',
  projectId: 'kuru-anime-network',
  storageBucket: 'kuru-anime-network.appspot.com',
  messagingSenderId: '195377790597',
  appId: '1:195377790597:web:a9007d1707775d3f'
}

firebase.initializeApp(firebaseConfig)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'Kuru Anime',
    links: ['http://discord.kuru-anime.com/', 'https://web.kuru-anime.com/', 'https://bot.kuru-anime.com/'],
    onlineStatus: 'offline'
  },
  getters: {
    countLinks: state => state.links.length
  },
  mutations: {
    ADD_LINK: (state, link) => {
      state.links.push(link)
    },
    REMOVE_LINK: (state, link) => {
      state.links.splice(link, 1)
    },
    REMOVE_ALL: (state) => {
      state.links = []
    },
    UPDATE_ONLINE_STATUS: (state) => {
      if (firebase.auth().currentUser) {
        state.onlineStatus = 'online'
      } else {
        state.onlineStatus = 'offline'
      }
    }
  },
  actions: {
    removeLink: (context, link) => {
      context.commit('REMOVE_LINK', link)
    },
    userRegister: (context, data) => {
      firebase.auth().createUserWithEmailAndPassword(data.email, data.password).catch(function (error) {
        console.log('Error Code:', error.code)
        console.log('Error Message:', error.message)
      })
      context.commit('UPDATE_ONLINE_STATUS')
    },
    userLogin: (context, data) => {
      firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function (error) {
        console.log('Error Code:', error.code)
        console.log('Error Message:', error.message)
      })
      context.commit('UPDATE_ONLINE_STATUS')
    },
    removeAll ({commit}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('REMOVE_ALL')
          resolve()
        }, 1500)
      })
    }
  }
})
