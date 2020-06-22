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
        players: [player],
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
    player = {
      ...player,
      id: Math.random().toString(36).substring(2, 6).toLowerCase(),
      vip: false
    }
    try {
      commit('setPlayer', player)

      fb.gamesCollection.doc(room).onSnapshot(game => updateLocalGame(commit, dispatch, state, game.data()))

      await fb.gamesCollection.doc(room).update({
        players: fb.FieldValue.arrayUnion(player)
      })
      commit('setGameState', gameStates.WAITING_TO_START)
    } catch (err) {
      console.error(err)
    }
  },
  async startGame ({ state, commit }) {
    commit('setLoading', true)
    const players = state.game.players

    const image = await createImage(state.game.image.href)
    const { cols, rows, splits } = await divideImage(image, players.length)
    const updatedPlayers = []

    const imagesContainerStyles = {
      'grid-template-columns': 'auto '.repeat(cols).trim(),
      'grid-template-rows': 'auto '.repeat(rows).trim()
    }

    for (let i = 0; i < players.length; i++) {
      const split = splits[i]
      const canvas = document.createElement('canvas')
      canvas.width = split.width
      canvas.height = split.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, split.x, split.y, split.width, split.height, 0, 0, split.width, split.height)

      const player = {
        ...players[i],
        pos: split.pos,
        split: {
          ...split,
          img: fb.Blob.fromBase64String(btoa(canvas.toDataURL()))
        }
      }
      updatedPlayers.push(player)
    }

    try {
      await fb.gamesCollection.doc(state.game.room).update({
        active: true,
        players: updatedPlayers,
        imagesContainerStyles
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
        players: state.game.players.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar || null,
          vip: p.vip
        }))
      })
    } catch (err) {
      console.error(err)
    }

    dispatch('startGame')
  },
  async sendImage ({ state, commit }) {
    commit('setLoading', true)
    const canvasDataUrl = state.drawingCanvas.toDataURL()
    commit('setPlayer', {
      ...state.player,
      image: await createImage(canvasDataUrl)
    })
    commit('setGameState', gameStates.SENT_IMAGE)
    const players = [...state.game.players]
    const meIndex = players.findIndex(p => p.id === state.player.id)
    players[meIndex].submission = fb.Blob.fromBase64String(btoa(canvasDataUrl))

    const imgCanvas = document.createElement('canvas')
    const imgCtx = imgCanvas.getContext('2d')
    const image = state.split.img
    imgCanvas.width = image.width
    imgCanvas.height = image.height

    imgCtx.drawImage(image, 0, 0)
    const diff = await compareImages(
      imgCanvas.toDataURL(),
      canvasDataUrl,
      { ignoreColors: true }
    )

    players[meIndex].similarity = Math.round((100 - diff.rawMisMatchPercentage) * 100) / 100

    try {
      await fb.gamesCollection.doc(state.game.room).update({
        players
      })
    } catch (err) {

    }
  }
}

let countdownTimer

async function updateLocalGame (commit, dispatch, state, game) {
  if (!game) {
    return
  }
  commit('setCurrentGame', game)
  const me = game.players.find(p => p.id === state.player.id)
  const allSubmitted = game.players.every(p => p.submission)

  if (game.active && [gameStates.WAITING_TO_START, gameStates.FINISHED].includes(state.gameState)) {
    commit('setSplit', {
      ...me.split,
      img: await createImage(me.split.img.ac.it)
    })
    commit('setGameState', gameStates.PRE_START)
    setTimeout(() => {
      commit('setGameState', gameStates.STARTED)
      countdownTimer = countdown(state, commit, dispatch)
    }, 15 * 1000)
  } else if (allSubmitted && [gameStates.STARTED, gameStates.SENT_IMAGE].includes(state.gameState)) {
    clearTimeout(countdownTimer)
    commit('setGameState', gameStates.FINISHED)
  }

  commit('setLoading', false)
}

async function countdown (state, commit, dispatch) {
  if (state.timer > 0) {
    commit('decTimer')
    countdownTimer = setTimeout(() => countdown(state, commit, dispatch), 1000)
  } else {
    const me = state.game.players.find(p => p.id === state.player.id)
    if (!me.submission) {
      dispatch('sendImage')
    }
    await fb.gamesCollection.doc(state.game.room).update({
      active: false
    })
  }
}
