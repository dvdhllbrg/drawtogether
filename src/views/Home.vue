<template lang="pug">
  section#home
    .container
        b-field(label="Game ID")
          b-input(v-model="gameId")
        b-field(label="Your name")
          b-input(v-model="playerName")
        b-button(
          type="is-primary"
          @click="joinGame"
        ) Join game
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  data: () => ({
    gameId: '',
    playerName: ''
  }),
  methods: {
    joinGame () {
      this.joinFbGame({
        game: this.gameId.toUpperCase(),
        name: this.playerName
      })
    },
    ...mapActions([
      'createGame',
      'joinFbGame'
    ])
  }
}
</script>

<style lang="scss">

</style>
