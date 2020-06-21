<template lang="pug">
  #gamePreStart
    header-navbar
    .container
      b-progress(
        :max="15"
        :value="timer"
        size="is-large"
        show-value
      ) {{ remainingTime }}
      .px-5
        h1.title 🤩 Soon you'll be painting!
        p This is the picture you're supposed to recreate. If you need to watch it again while painting, just click the "Reference" button in the toolbar!
      .my-4
        game-image-canvas(
          v-if="split.img"
          :img="split.img"
        )
</template>

<script>
import { mapState } from 'vuex'
import GameImageCanvas from './GameImageCanvas'
import HeaderNavbar from './HeaderNavbar'

export default {
  name: 'GamePreStart',
  components: {
    HeaderNavbar,
    GameImageCanvas
  },
  data: () => ({
    timer: 15
  }),
  computed: {
    remainingTime () {
      const secondOrSeconds = this.timer > 1 ? 'seconds' : 'second'
      return `Game starts in ${this.timer} ${secondOrSeconds}!`
    },
    ...mapState([
      'split'
    ])
  },
  created () {
    this.countdown()
  },
  methods: {
    countdown () {
      if (this.timer > 0) {
        this.timer--
        setTimeout(() => this.countdown(), 1000)
      }
    }
  }
}
</script>

<style lang="scss">
#gamePreStart {
  progress.progress {
    border-radius: 0 !important;
  }
  .canvasWrapper {
    canvas {
      width: 100vw;
      border: 1px dashed #dbdbdb;
    }
  }
}
</style>
