<template lang="pug">
  section#game
    b-navbar
      template(slot="brand")
        b-navbar-item(tag="div")
          b-button(@click="showHelp = true") 🤔 Help
      template(slot="burger")
        span
    game-join(v-if="gameState === gameStates.NOT_JOINED")
    game-waiting-to-start(v-if="gameState === gameStates.WAITING_TO_START")
    help-modal(
      :show.sync="showHelp"
      :gameState="gameState"
    )
</template>

<script>
import { gameStates } from '../utils'
import { mapState } from 'vuex'
import HelpModal from '../components/HelpModal'
import GameJoin from '../components/GameJoin'
import GameWaitingToStart from '../components/GameWaitingToStart'

export default {
  name: 'GameView',
  components: {
    GameJoin,
    GameWaitingToStart,
    HelpModal
  },
  data: () => ({
    showHelp: false
  }),
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
