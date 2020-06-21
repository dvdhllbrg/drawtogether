export default {
  setCurrentGame (state, game) {
    state.game = { ...game }
  },
  setPlayer (state, player) {
    state.player = { ...player }
  },
  setGameState (state, gameState) {
    state.gameState = gameState
  },
  setSplit (state, split) {
    state.split = split
  },
  setDrawingCanvas (state, canvas) {
    state.drawingCanvas = canvas
  },
  decTimer (state) {
    state.timer--
  }
}
