<template lang="pug">
  #gameStarted
    header-navbar(
      :showSendButton="true"
      @send="sendImage"
    )
    b-progress(
      :max="6000"
      :value="timer"
      size="is-large"
      show-value
      :type="timer < 30 ? 'is-danger' : ''"
    ) {{ remainingTime }}
    game-drawing-canvas(
      ref="drawing"
      :width="split.width"
      :height="split.height"
      :tool="tool"
      :toolSize="toolSize"
      :color="color"
    )
    b-navbar(
      fixed-bottom
      wrapper-class="toolbar"
      shadow
      is-active
      :close-on-click="false"
    )
      template(slot="end")
        b-navbar-item(
          tag="div"
          class="columns is-mobile"
        )
          .column
            b-button(
              @click="$refs.drawing.undo()"
              :disabled="!$refs.drawing || !$refs.drawing.canUndo"
            )
              span.icon.undo ↪️
              span.text Undo
          .column
            b-button(
              @click="tool = 'brush'"
              :type="{'is-light': tool === 'brush'}"
            )
              span.icon 🖌️
              span.text Brush
          .column
            b-button(
              @click="tool = 'eraser'"
              :type="{'is-light': tool === 'eraser'}"
            )
              span.icon ❌
              span.text Eraser
          .column
            b-button(
              @click="tool = 'fill'"
              :type="{'is-light': tool === 'fill'}"
            )
              span.icon 💦
              span.text Fill
          .column
            b-button(@click="showReference = true")
              span.icon 🖼️
              span.text Reference
      template(slot="burger")
        span.is-hidden
      template(slot="start")
        b-navbar-item(
          tag="div"
          class="columns is-mobile"
        )
          .column(v-if="tool !== 'fill'")
            b-button(
              @click="toolSize = 5"
              :type="{'is-light': toolSize === 5}"
            )
              span.icon.size-small ⚫
              span.text Small
          .column(v-if="tool !== 'fill'")
            b-button(
              @click="toolSize = 10"
              :type="{'is-light': toolSize === 10}"
            )
              span.icon.size-medium ⚫
              span.text Medium
          .column(v-if="tool !== 'fill'")
            b-button(
              @click="toolSize = 25"
              :type="{'is-light': toolSize === 25}"
            )
              span.icon.size-large ⚫
              span.text Large
          .column(v-if="tool !== 'eraser'")
            b-button(@click="$refs.colorInput.click()")
              span.icon 🎨
              span.text Color
            input.is-hidden(
              type="color"
              ref="colorInput"
              @input="color = $event.target.value"
            )
    b-modal(
      :active.sync="showReference"
      full-screen
      trap-focus
      :can-cancel="false"
    )
      #referenceImage.has-text-centered
        game-image-canvas(
          v-if="split.img"
          :img="split.img"
        )
        b-button(
          @click="showReference = false"
          size="is-large is-fullwidth"
        ) ⬅️ Back to painting!
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GameImageCanvas from './GameImageCanvas'
import GameDrawingCanvas from './GameDrawingCanvas'
import HeaderNavbar from './HeaderNavbar'

export default {
  name: 'GameStarted',
  components: {
    GameImageCanvas,
    GameDrawingCanvas,
    HeaderNavbar
  },
  data: () => ({
    showReference: false,
    tool: 'brush',
    toolSize: 5,
    color: '#000'
  }),
  computed: {
    remainingTime () {
      const minutes = Math.floor(this.timer / 60)
      const seconds = Math.floor(this.timer % 60)
      const minuteOrMinutes = minutes > 1 ? 'minutes' : 'minute'
      const secondOrSeconds = seconds > 1 ? 'seconds' : 'second'
      return `${minutes} ${minuteOrMinutes} ${seconds} ${secondOrSeconds} left!`
    },
    ...mapState([
      'game',
      'split',
      'timer'
    ])
  },
  methods: {
    ...mapActions([
      'sendImage'
    ])
  }
}
</script>

<style lang="scss">
body.has-navbar-fixed-bottom {
  padding-bottom: 0 !important;
}
#gameStarted {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .navbar-brand {
    justify-content: space-between;
  }

  progress.progress {
    border-radius: 0 !important;
  }

  .progress-value {
    width: 100%;
    text-align: center;
  }

  .toolbar {
    .navbar-menu {
      padding: 0;
    }

    .navbar-brand {
      display: none;
    }

    .navbar-item {
      padding: 0;
      margin: 0;
      width: 100%;

      .column {
        padding: 0;
      }

      .button {
        height: 100%;
        border-radius: 0;
        width: 100%;
        border: 0;
        padding: 0.5rem;

        & > span {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon {
          margin: 0 !important;
          font-size: 24px;

          &.undo {
            transform: rotate(180deg);
          }
        }
      }
    }

    .navbar-start {
      .navbar-item {
        .button {
          padding: 0;

          .icon {
            margin: 0 !important;
            font-size: 18px;

            &.size-small {
              font-size: 5px;
            }

            &.size-medium {
              font-size: 10px;
            }

            &.size-large {
              font-size: 18px;
            }
          }
        }
      }
    }
  }

  #referenceImage {
    height: 100%;
    position: relative;

    .button {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .canvasWrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    canvas {
      width: 100vw;
      border: 1px dashed #dbdbdb;
    }
  }
}
</style>
