import Vue from 'vue'
import Vuex from 'vuex'

const fb = require('../firebaseConfig')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    game: '',
    player: null
  },
  mutations: {
    setCurrentGame (state, game) {
      state.game = game
    },
    setPlayer (state, player) {
      state.player = { ...player }
    }
  },
  actions: {
    async createGame ({ commit }, name) {
      const game = Math.random().toString(36).substring(2, 6).toUpperCase()
      const player = {
        id: Math.random().toString(36).substring(2, 6).toLowerCase(),
        name,
        vip: true
      }
      try {
        await fb.gamesCollection.doc(game).set({
          players: [
            player
          ]
        })
        commit('setCurrentGame', game)
        commit('setPlayer', player)
      } catch (err) {
        console.error(err)
      }
    },
    async joinFbGame ({ commit }, { game, name }) {
      const player = {
        id: Math.random().toString(36).substring(2, 6).toLowerCase(),
        name,
        vip: false
      }
      try {
        await fb.gamesCollection.doc(game).update({
          players: fb.fieldValue.arrayUnion(player)
        })
        commit('setCurrentGame', game)
        commit('setPlayer', player)
      } catch (err) {
        console.error(err)
      }
    }
  },
  modules: {
  }
})
