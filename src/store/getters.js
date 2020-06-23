export default {
  sortedPlayers: state => Object.values(state.game.players).sort((a, b) => {
    if (!a.pos || !b.pos) {
      return 0
    }
    if (a.pos.i === b.pos.i) {
      return a.pos.j - b.pos.j
    } else {
      return a.pos.i - b.pos.i
    }
  }),
  unfinishedPlayers: state => Object.values(state.game.players).filter(p => !p.submission)
}
