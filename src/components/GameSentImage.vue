<template lang="pug">
  div
    header-navbar
    b-progress(
      :max="6000"
      :value="timer"
      size="is-large"
      show-value
    ) {{ remainingTime }}
    .container
      h1.title 👏 Well done {{ player.name }}!
      p.subtitle Picasso who?
      p As soon as everyone else finishes up, you'll see how similar both your collaborative piece and your individual contributions are compared to the original. In the meantime, take a moment to bask in the glow of your creative endeavour!
      h2.title.is-6 Here is the image you were recreating:
      game-image-canvas(
        v-if="split.img"
        :img="split.img"
      )
      h2.title.is-6 And here is what you created:
      game-image-canvas(
        v-if="player.image"
        :img="player.image"
      )
      p Incredible, isn't it? You created a masterpiece!
      h2.title.is-5 Still waiting for these people:
      #players.my-5
        .columns.is-multiline.is-mobile(v-show="unfinishedPlayers.length > 0")
          .column.is-one-third(v-for="p in unfinishedPlayers")
            figure.image.is-48x48
              img.is-rounded(
                v-if="p.avatar"
                alt="Player avatar"
                :src="getImageUrl(p.avatar)"
              )
              span.avatar(v-else) 🙈
            p.title.is-4 {{ p.name }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HeaderNavbar from './HeaderNavbar'
import GameImageCanvas from './GameImageCanvas'

export default {
  name: 'GameSentImage',
  components: {
    HeaderNavbar,
    GameImageCanvas
  },
  computed: {
    remainingTime () {
      const minutes = Math.floor(this.timer / 60)
      const seconds = Math.floor(this.timer % 60)
      const minuteOrMinutes = minutes > 1 ? 'minutes' : 'minute'
      const secondOrSeconds = seconds > 1 ? 'seconds' : 'second'
      return `${minutes} ${minuteOrMinutes} ${seconds} ${secondOrSeconds} left!`
    },
    ...mapState([
      'timer',
      'player',
      'split'
    ]),
    ...mapGetters([
      'unfinishedPlayers'
    ])
  }
}
</script>

<style lang="scss" scoped>
progress.progress {
  border-radius: 0 !important;
}

.progress-value {
  width: 100%;
  text-align: center;
}

.container {
  padding: 2rem;
}

.canvasWrapper {
  canvas {
    width: 100vw;
    margin-left: -2rem;
    margin-right: -2rem;
  }
}

p {
  margin-bottom: 1rem;
}

h2.title.is-6 {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
#players {
  .column {
    position: relative;
  }

  .avatar {
    font-size: 36px;
    line-height: 36px;
  }

}
</style>
