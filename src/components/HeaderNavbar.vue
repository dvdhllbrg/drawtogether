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
    help-modal(
        :show.sync="showHelp"
        :gameState="gameState"
      )
</template>

<script>
import HelpModal from './HelpModal'
import { mapState } from 'vuex'

export default {
  name: 'GameStarted',
  components: {
    HelpModal
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
