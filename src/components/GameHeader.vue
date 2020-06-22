<template lang="pug">
  div
    b-navbar
      template(slot="brand")
        b-navbar-item(tag="div")
          b-button(@click="showHelp = true") 🤔 Help
        b-navbar-item(tag="div")
          b-button(
            v-if="showSendButton"
            @click="$emit('send')"
            type="is-primary"
          ) 🚀 Send
      template(slot="burger")
        span.is-hidden
    game-help-modal(
        :show.sync="showHelp"
        :gameState="gameState"
      )
</template>

<script>
import GameHelpModal from './GameHelpModal'
import { mapState } from 'vuex'

export default {
  name: 'GameHeader',
  components: {
    GameHelpModal
  },
  props: {
    showSendButton: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    showHelp: false
  }),
  computed: {
    ...mapState([
      'gameState'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .navbar-brand {
    justify-content: space-between;
  }
</style>
