<template lang="pug">
  section#game
    game-join(
      v-if="gameState === gameStates.NOT_JOINED"
      :initRoom="room"
    )
    game-waiting-to-start(v-if="gameState === gameStates.WAITING_TO_START")
    game-pre-start(v-if="gameState === gameStates.PRE_START")
    game-started(v-if="gameState === gameStates.STARTED")
    game-sent-image(v-if="gameState === gameStates.SENT_IMAGE")
    game-finished(v-if="gameState === gameStates.FINISHED")
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

export default {
  name: 'GameView',
  components: {
    GameJoin,
    GameWaitingToStart,
    GamePreStart,
    GameStarted,
    GameSentImage,
    GameFinished
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
      'gameState'
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
