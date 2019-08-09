import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from 'firebase/app'
import 'firebase/auth'

import { createSnackbar } from '@egoist/snackbar'
import '@egoist/snackbar/dist/snackbar.css'

const axios = require('axios')

const firebaseConfig = {
  apiKey: 'AIzaSyCz3laxK1vMpEpjJFXSx8UyzlH7mE4KBT0',
  authDomain: 'kuru-anime-network.firebaseapp.com',
  databaseURL: 'https://kuru-anime-network.firebaseio.com',
  projectId: 'kuru-anime-network',
  storageBucket: 'kuru-anime-network.appspot.com',
  messagingSenderId: '195377790597',
  appId: '1:195377790597:web:a9007d1707775d3f'
}

const facebookProvider = new firebase.auth.FacebookAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()

firebase.initializeApp(firebaseConfig)

Vue.use(Vuex)

export default new Vuex.Store({
  // STATE
  state: {
    title: 'Kuru Anime',
    userIsOnline: false,
    modalStatus: false,
    modalState: 'Default',
    animeData: {},
    mangaData: {},
    searchData: [],
    searchType: 'Anime'
  },
  // MUTATIONS
  mutations: {
    UPDATE_USER_IS_ONLINE: (state, bool) => {
      state.userIsOnline = bool
    },
    UPDATE_MODAL_STATUS: (state, bool) => {
      state.modalStatus = bool
    },
    UPDATE_MODAL_STATE: (state, value) => {
      state.modalState = value
    },
    UPDATE_ANIME_DATA: (state, value) => {
      state.animeData = value
    },
    UPDATE_MANGA_DATA: (state, value) => {
      state.mangaData = value
    },
    UPDATE_SEARCH_DATA: (state, value) => {
      state.searchData = value
    },
    UPDATE_SEARCH_TYPE: (state, value) => {
      state.searchType = value
    }
  },
  // ACTIONS
  actions: {
    // Register
    userRegister: (context, data) => {
      firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
      }).catch(function (error) {
        console.log(`Register Error: ${error.message} (${error.code})`)
        createSnackbar(`Register Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Login
    userLogin: (context, data) => {
      firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
      }).catch(function (error) {
        console.log(`Login Error: ${error.message} (${error.code})`)
        createSnackbar(`Login Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Login with Facebook
    userFacebookLogin: (context) => {
      firebase.auth().signInWithPopup(facebookProvider).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
      }).catch(function (error) {
        console.log(`Login Error: ${error.message} (${error.code})`)
        createSnackbar(`Login Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Login with Twitter
    userTwitterLogin: (context) => {
      firebase.auth().signInWithPopup(twitterProvider).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
      }).catch(function (error) {
        console.log(`Login Error: ${error.message} (${error.code})`)
        createSnackbar(`Login Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Login with Google
    userGoogleLogin: (context) => {
      firebase.auth().signInWithPopup(googleProvider).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
      }).catch(function (error) {
        console.log(`Login Error: ${error.message} (${error.code})`)
        createSnackbar(`Login Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Forgot Password
    userForgotPassword: (context, data) => {
      firebase.auth().sendPasswordResetEmail(data).then(function () {
        context.commit('UPDATE_MODAL_STATUS', false)
        createSnackbar(`Email has been sent!`, {
          position: 'right',
          timeout: 5000
        })
      }).catch(function (error) {
        console.log(`Login Error: ${error.message} (${error.code})`)
        createSnackbar(`Login Error: ${error.message}`, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Log Out
    userLogOut: (context) => {
      firebase.auth().signOut().then(function () {
        createSnackbar('Sign Out success!', {
          position: 'right',
          timeout: 5000
        })
      }).catch(function () {
        createSnackbar('Error in Sign Out', {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Search Anime and Manga Data
    searchEncyclopediaData: ({ state, commit }, query) => {
      let apiLink = `https://kitsu.io/api/edge/${state.searchType.toLowerCase()}?filter[text]=${encodeURIComponent(query)}&page[limit]=12`
      console.log('Kitsu Search Link:', apiLink)
      axios.get(apiLink).then(function (response) {
        commit('UPDATE_SEARCH_DATA', response.data.data)
      }).catch(function (error) {
        createSnackbar(error, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Fetch Anime and Manga Data
    fetchEncyclopediaData: ({ commit }, { type, id }) => {
      let apiLink = `https://kitsu.io/api/edge/${type}/${id}`
      console.log('Kitsu Fetch Link:', apiLink)
      axios.get(apiLink).then(function (response) {
        if (type === 'anime') {
          commit('UPDATE_ANIME_DATA', response.data.data)
        } else if (type === 'manga') {
          commit('UPDATE_MANGA_DATA', response.data.data)
        }
      }).catch(function (error) {
        createSnackbar(error, {
          position: 'right',
          timeout: 5000
        })
      })
    },
    // Snack Bar
    snackBar: (context, data) => {
      createSnackbar(data.title, {
        position: data.position,
        timeout: data.timeout
      })
    },
    // Change Modal Status
    changeModalStatus: (context, bool) => {
      context.commit('UPDATE_MODAL_STATUS', bool)
    }
  }
})
