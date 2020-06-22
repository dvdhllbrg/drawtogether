<template lang="pug">
  b-modal(
      :active="show"
      full-screen
      has-modal-card
      trap-focus
      :can-cancel="false"
    )
      .modal-card
        header.modal-card-head
          b-button(@click="close") ⬅️ Go back
        section.modal-card-body
          h2.title 🤔 Need help?
          div(v-html="helpText")
</template>

<script>
import { gameStates } from '../utils'

export default {
  name: 'GameHelpModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    gameState: {
      type: String,
      required: true
    }
  },
  computed: {
    helpText () {
      switch (this.gameState) {
        case gameStates.NOT_JOINED:
          return `
            <p>Here is how you do what you want to do</p>
            <p>And so on and so forth</p>
          `
        default:
          return 'No help text defined for this game state!'
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  p.modal-card-title {
    margin-left: 0.5rem;
  }
</style>
