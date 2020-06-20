import fb from '../firebaseConfig'
import { getImage, gameStates } from '../utils'

export default {
  async createGame ({ commit }, name) {
    const room = Math.random().toString(36).substring(2, 6).toUpperCase()
    const player = {
      id: Math.random().toString(36).substring(2, 6).toLowerCase(),
      name,
      vip: true
    }

    try {
      commit('setPlayer', player)

      fb.gamesCollection.doc(room).onSnapshot(game => commit('setCurrentGame', game.data()))

      const game = {
        room,
        image: await getImage(),
        players: [player]
      }

      await fb.gamesCollection.doc(room).set(game)

      commit('setGameState', gameStates.WAITING_TO_START)
    } catch (err) {
      console.error(err)
    }
  },
  async joinFbGame ({ commit }, { room, player }) {
    player = {
      ...player,
      id: Math.random().toString(36).substring(2, 6).toLowerCase(),
      vip: false
    }
    try {
      commit('setPlayer', player)

      fb.gamesCollection.doc(room).onSnapshot(game => commit('setCurrentGame', game.data()))

      await fb.gamesCollection.doc(room).update({
        players: fb.fieldValue.arrayUnion(player)
      })

      commit('setGameState', gameStates.WAITING_TO_START)
    } catch (err) {
      console.error(err)
    }
  }
}
