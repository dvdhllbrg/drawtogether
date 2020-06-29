import fb from '../firebaseConfig'
import { getImage, createImage, divideImage, gameStates } from '../utils'
import compareImages from 'resemblejs/compareImages'

export default {
  async createGame ({ state, dispatch, commit }, player) {
    commit('setLoading', true)
    const room = Math.random().toString(36).substring(2, 6).toUpperCase()
    player.id = Math.random().toString(36).substring(2, 6).toLowerCase()
    player.vip = true

    try {
      commit('setPlayer', player)

      fb.gamesCollection.doc(room).onSnapshot(game => updateLocalGame(commit, dispatch, state, game.data()))

      const game = {
        room,
        image: await getImage(),
        players: {
          [player.id]: player
        },
        vipName: name,
        active: false
      }

      await fb.gamesCollection.doc(room).set(game)
      commit('setGameState', gameStates.WAITING_TO_START)
    } catch (err) {
      console.error(err)
    }
  },
  async joinFbGame ({ state, dispatch, commit }, { room, player }) {
    commit('setLoading', true)
    const id = Math.random().toString(36).substring(2, 6).toLowerCase()
    player = {
      ...player,
      id,
      vip: false
    }
    try {
      commit('setPlayer', player)

      fb.gamesCollection.doc(room).onSnapshot(game => updateLocalGame(commit, dispatch, state, game.data()))

      await fb.gamesCollection.doc(room).update({
        [`players.${id}`]: player
      })
      commit('setGameState', gameStates.WAITING_TO_START)
    } catch (err) {
      console.error(err)
    }
  },
  async startGame ({ state, commit }, settings) {
    commit('setLoading', true)
    const players = state.game.players

    const image = await createImage(state.game.image.href)
    const { cols, rows, splits } = await divideImage(image, Object.keys(players).length)
    const updatedPlayers = {}

    const imagesContainerStyles = {
      'grid-template-columns': 'auto '.repeat(cols).trim(),
      'grid-template-rows': 'auto '.repeat(rows).trim()
    }

    for (const id in players) {
      const split = splits.pop()
      const canvas = document.createElement('canvas')
      canvas.width = split.width
      canvas.height = split.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, split.x, split.y, split.width, split.height, 0, 0, split.width, split.height)

      const player = {
        ...players[id],
        pos: split.pos,
        split: {
          ...split,
          img: fb.Blob.fromBase64String(btoa(canvas.toDataURL()))
        }
      }
      updatedPlayers[player.id] = player
    }

    try {
      await fb.gamesCollection.doc(state.game.room).update({
        active: true,
        players: updatedPlayers,
        imagesContainerStyles,
        settings
      })
    } catch (err) {
      console.error(err)
    }
  },
  async restartGame ({ state, dispatch }) {
    try {
      await fb.gamesCollection.doc(state.game.room).update({
        image: await getImage(),
        active: false,
        players: Object.values(state.game.players).map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar || null,
          vip: p.vip
        }))
      })
    } catch (err) {
      console.error(err)
    }

    dispatch('startGame', state.game.settings)
  },
  async sendImage ({ state, commit }) {
    commit('setLoading', true)
    const canvasDataUrl = state.drawingCanvas.toDataURL()
    commit('setPlayer', {
      ...state.player,
      image: await createImage(canvasDataUrl)
    })
    commit('setGameState', gameStates.SENT_IMAGE)
    const id = state.player.id
    const player = { ...state.game.players[id] }
    player.submission = fb.Blob.fromBase64String(btoa(canvasDataUrl))

    const imgCanvas = document.createElement('canvas')
    const imgCtx = imgCanvas.getContext('2d')
    const image = state.split.img
    imgCanvas.width = image.width
    imgCanvas.height = image.height

    imgCtx.drawImage(image, 0, 0)
    const diff = await compareImages(
      imgCanvas.toDataURL(),
      canvasDataUrl,
      { ignoreColors: !state.game.settings.colorSimilarity }
    )

    player.similarity = Math.round((100 - diff.rawMisMatchPercentage) * 100) / 100

    try {
      await fb.gamesCollection.doc(state.game.room).update({
        [`players.${id}`]: player
      })
    } catch (err) {
      console.error(err)
    }
  }
}

let countdownTimer

async function updateLocalGame (commit, dispatch, state, game) {
  if (!game) {
    return
  }
  const allSubmitted = Object.values(game.players).every(p => p.submission)

  if (game.active && [gameStates.WAITING_TO_START, gameStates.RESTARTING].includes(state.gameState)) {
    const me = game.players[state.player.id]
    commit('setSplit', {
      ...me.split,
      img: await createImage(me.split.img.ac.it)
    })
    commit('setGameState', gameStates.PRE_START)
    setTimeout(() => {
      commit('setGameState', gameStates.STARTED)
      commit('setTimer', game.settings.timeLimit)
      countdownTimer = countdown(state, commit, dispatch)
    }, 15 * 1000)
  } else if (allSubmitted && [gameStates.STARTED, gameStates.SENT_IMAGE].includes(state.gameState)) {
    clearTimeout(countdownTimer)
    commit('setGameState', gameStates.FINISHED)
  } else if (game.image && state.game.image && game.image.id !== state.game.image.id) {
    commit('setGameState', gameStates.RESTARTING)
  }

  commit('setCurrentGame', game)
  commit('setLoading', false)
}

async function countdown (state, commit, dispatch) {
  if (state.timer > 0) {
    commit('decTimer')
    countdownTimer = setTimeout(() => countdown(state, commit, dispatch), 1000)
  } else {
    if (!state.game.players[state.player.id].submission) {
      dispatch('sendImage')
    }
    await fb.gamesCollection.doc(state.game.room).update({
      active: false
    })
  }
}
