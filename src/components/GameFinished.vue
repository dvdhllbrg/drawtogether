<template lang="pug">
  #gameFinished
    game-header
    .container
      p.px-2.my-2.is-size-4.has-text-centered {{ getSimilarityEmoji(similarity) }} Your collaborative picture is {{ similarity }}% similar to the original! {{ getSimilarityEmoji(similarity)  }}
      h2.px-1.title.is-5 The original
      figure.image.my-2
        img(:src="game.image.href")
        b-message
          p
            b {{ artists }}&nbsp;
          p
            b
              i {{ game.image.title }}
            |, {{ game.image.dated }}
          p {{ game.image.medium }}
          a(:href="game.image.url") Read more at Harvard Art Museums
      .level.is-mobile.px-1
        .level-left
          h2.title.is-5.level-item Your creation
        .level-right
          b-button.level-item(
            @click="showPlayerInfo = !showPlayerInfo"
          ) 👁️ Toggle player info
      #playerSubmissions.my-5(
        v-if="playerImages"
        :style="game.imagesContainerStyles"
      )
        .playerSubmission(
          v-for="player in sortedPlayers"
          :key="player.id"
          :class="playerPosClass(player.pos)"
        )
          game-image-canvas(:img="playerImages[player.id].img")
          .playerInfo(v-show="showPlayerInfo")
            .is-clearfix
              figure.image.is-24x24.is-pulled-left
                img.is-rounded(
                  v-if="player.avatar"
                  alt="Player avatar"
                  :src="getImageUrl(player.avatar)"
                )
                span.avatar(v-else) 🙈
              p.title.is-5.is-pulled-left.is-marginless {{ player.name }}
            p {{ playerImages[player.id].emoji  }} {{ playerImages[player.id].similarity }}% similar
      b-button.mb-2(
        tag="a"
        :href="imageDataUrl"
        :download="imageFileName"
        size="is-large"
        expanded
      ) 📥 Download your painting
      b-button(
        v-if="player.vip"
        @click="restartGame"
        size="is-large"
        type="is-primary"
        expanded
      ) 🏁 Paint together again
</template>

<script>
import { createImage } from '../utils'
import { mapState, mapGetters, mapActions } from 'vuex'
import compareImages from 'resemblejs/compareImages'
import GameHeader from './GameHeader'
import GameImageCanvas from './GameImageCanvas'

export default {
  name: 'GameFinished',
  components: {
    GameHeader,
    GameImageCanvas
  },
  data: () => ({
    playerImages: null,
    showPlayerInfo: true,
    showPaintingInfo: true,
    similarity: 0,
    imageDataUrl: ''
  }),
  computed: {
    imageFileName () {
      return `${Object.values(this.game.players).map(p => p.name).join('_')}.png`
    },
    artists () {
      return this.game.image.artists.join(', ')
    },
    ...mapState([
      'game',
      'player'
    ]),
    ...mapGetters([
      'sortedPlayers'
    ])
  },
  async created () {
    const imgCanvas = document.createElement('canvas')
    const imgCtx = imgCanvas.getContext('2d')
    const image = await createImage(this.game.image.href)
    imgCanvas.width = image.width
    imgCanvas.height = image.height

    imgCtx.drawImage(image, 0, 0)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = image.width
    canvas.height = image.height

    const playerImages = {}
    for (const p of this.sortedPlayers) {
      const img = await createImage(p.submission.ac.it)
      playerImages[p.id] = {
        img,
        similarity: p.similarity,
        emoji: this.getSimilarityEmoji(0)
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, p.split.x, p.split.y, p.split.width, p.split.height)
    }
    this.playerImages = playerImages
    this.imageDataUrl = canvas.toDataURL()

    const diff = await compareImages(
      imgCanvas.toDataURL(),
      this.imageDataUrl,
      { ignoreColors: true }
    )

    this.similarity = Math.round((100 - diff.rawMisMatchPercentage) * 100) / 100
  },
  methods: {
    playerPosClass (pos) {
      if (this.game.players.length > 2 && this.game.players.length % 2 === 0) {
        return pos.j % 2 === 0 ? 'right' : 'left'
      } else {
        return 'center'
      }
    },
    getSimilarityEmoji (similarity) {
      if (this.similarity < 10) {
        return '😬'
      } else if (this.similarity < 20) {
        return '👏'
      }
      return '🤯'
    },
    ...mapActions([
      'restartGame'
    ])
  }
}
</script>

<style lang="scss">
html {
  height: 100vh;

  body {
    height: 100vh;

    #app, #app > div, #gameFinished {
      height: 100%;
    }
  }
}

#gameFinished {
  #playerSubmissions {
    display: grid;
    justify-items: center;

    .playerSubmission {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      &.right {
        justify-self: right;
      }

      &.left {
        justify-self: left;
      }

      .playerInfo {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(245, 245, 245, 0.75);
        padding: 0.2rem;

        .avatar {
          font-weight: 18px;
          line-height: 18px;
        }
      }
    }
  }

  .message-body {
    border: 0;
  }
}
</style>
