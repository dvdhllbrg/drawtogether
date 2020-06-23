<template lang="pug">
  section#game
    b-loading(:active="loading")
    game-join(
      v-if="gameState === gameStates.NOT_JOINED"
      :initRoom="room"
    )
    game-waiting-to-start(v-if="gameState === gameStates.WAITING_TO_START")
    game-pre-start(v-if="gameState === gameStates.PRE_START")
    game-started(v-if="gameState === gameStates.STARTED")
    game-sent-image(v-if="gameState === gameStates.SENT_IMAGE")
    game-finished(v-if="gameState === gameStates.FINISHED")
    game-restarting(v-if="gameState === gameStates.RESTARTING")
</template>

<script>
import { gameStates } from '../utils'
import { mapState } from 'vuex'
import GameJoin from '../components/GameJoin'
import GameWaitingToStart from '../components/GameWaitingToStart'
import GamePreStart from '../components/GamePreStart'
import GameStarted from '../components/GameStarted'
import GameSentImage from '../components/GameSentImage'
import GameFinished from '../components/GameFinished'
import GameRestarting from '../components/GameRestarting'

export default {
  name: 'GameView',
  components: {
    GameJoin,
    GameWaitingToStart,
    GamePreStart,
    GameStarted,
    GameSentImage,
    GameFinished,
    GameRestarting
  },
  props: {
    room: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    gameStates: () => gameStates,
    ...mapState([
      'gameState',
      'loading'
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
