<template lang="pug">
  div
    header-navbar
    .container
      b-field(label="👀 What do you want to look like?" custom-class="is-large")
        .control.columns.is-mobile.is-multiline
          .column.is-one-quarter(v-for="a in avatars")
            a.addAvatar(
              href="#/"
              @click="setAvatar(a)"
            )
              figure.image.is-48x48(:class="{notSelected: player.avatar !== a}")
                img.is-rounded(:src="getImageUrl(a)")
      b-field(
        label="💬 What should we call you?"
        custom-class="is-large")
        b-input(
          v-model.trim="player.name"
          maxlength="16"
          :has-counter="false"
        )
      b-field(
        v-if="mode === 'join'"
        label="🏠 What room do you want to join?"
        custom-class="is-large"
      )
        b-input(
          maxlength="4"
          :value="room.toUpperCase()"
          @input.native="room = $event.target.value.toUpperCase()"
        )
      b-field(v-if="mode === 'join'")
        b-button.is-fullwidth(
          type="is-primary"
          size="is-large"
          :disabled="!player.name || !room"
          @click="joinGame"
        ) 😎 Join game
      b-field(v-else-if="mode === 'create'")
        b-button.is-fullwidth(
          type="is-primary"
          size="is-large"
          :disabled="!player.name"
          @click="createGame(player.name)"
        ) 🏠 Create game room

      p(v-if="mode === 'join'") Or, do you want to&nbsp;
        a(
          href="#/"
          @click="mode = 'create'"
        ) create a game room
        |?
      p(v-else-if="mode === 'create'") Or, do you want to&nbsp;
        a(
          href="#/"
          @click="mode = 'join'"
        ) join an existing game room
        |?
</template>

<script>
import { mapState, mapActions } from 'vuex'
import HeaderNavbar from './HeaderNavbar'

export default {
  name: 'GameJoin',
  components: {
    HeaderNavbar
  },
  props: {
    initRoom: {
      type: String,
      required: false,
      default: ''
    }
  },
  data: () => ({
    mode: 'create',
    room: '',
    player: {
      name: '',
      avatar: ''
    },
    avatars: [
      'avatar',
      'avatar2',
      'avatar3',
      'avatar4'
    ]
  }),
  computed: {
    ...mapState([
      'game'
    ])
  },
  created () {
    if (this.initRoom) {
      this.mode = 'join'
      this.room = this.initRoom
    }
  },
  methods: {
    setAvatar (avatar) {
      this.player.avatar = avatar
    },
    joinGame () {
      this.joinFbGame({
        room: this.room.toUpperCase(),
        player: this.player
      })
    },
    ...mapActions([
      'createGame',
      'joinFbGame'
    ])
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 2rem;

  figure.notSelected {
    opacity: 0.5;
  }
}
</style>
