export default {
  setCurrentGame (state, game) {
    state.game = { ...game }
  },
  setPlayer (state, player) {
    state.player = { ...player }
  },
  setGameState (state, gameState) {
    state.gameState = gameState
  }
}
