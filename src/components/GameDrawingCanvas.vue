<template lang="pug">
  .canvasWrapper
    canvas(
      ref="drawingCanvas"
      @touchstart.prevent="handleStart"
      @touchend.prevent="handleEnd"
      @touchcancel.prevent="handleCancel"
      @touchmove.prevent="handleMove"
    )
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { createImage } from '../utils'

export default {
  name: 'GameDrawingCanvas',
  props: {
    width: {
      required: true,
      type: Number
    },
    height: {
      required: true,
      type: Number
    },
    tool: {
      required: true,
      type: String
    },
    toolSize: {
      required: true,
      type: Number
    },
    color: {
      required: true,
      type: String
    }
  },
  data: () => ({
    ctx: null,
    ongoingTouches: [],
    history: [],
    offset: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1
    }
  }),
  computed: {
    canUndo () {
      return this.history.length > 0
    },
    ...mapState([
      'drawingCanvas'
    ])
  },
  watch: {
    tool (newTool, oldTool) {
      if (newTool === 'eraser') {
        this.setColor('#FFF')
      } else {
        this.setColor(this.color)
      }
    },
    toolSize () {
      this.setBrushSize()
    },
    color () {
      this.setColor(this.color)
    }
  },
  mounted () {
    const canvas = this.$refs.drawingCanvas
    this.setDrawingCanvas(canvas)

    canvas.width = Math.round(this.width)
    canvas.height = Math.round(this.height)

    this.ctx = canvas.getContext('2d', { alpha: false })
    this.ctx.fillStyle = '#FFF'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.strokeStyle = '#000'
    this.ctx.lineCap = 'round'

    const { top, left, width, height } = canvas.getBoundingClientRect()
    this.offset.x = left
    this.offset.y = top
    this.offset.scaleX = this.width / width
    this.offset.scaleY = this.height / height

    this.setBrushSize()
    this.setColor(this.color)
  },
  methods: {
    setColor (color) {
      this.ctx.strokeStyle = color
    },
    setBrushSize () {
      this.ctx.lineWidth = this.toolSize
    },
    addToHistory () {
      this.history.push(this.drawingCanvas.toDataURL())
      if (this.history.length > 32) {
        this.history.shift()
      }
    },
    async undo () {
      if (!this.canUndo) return

      const state = this.history.pop()
      const img = await createImage(state)

      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
    },
    handleStart (e) {
      if (this.tool === 'fill') {
        this.floodFill(this.getActualTouchPos(e.touches[0]))
        return
      }

      this.addToHistory()

      for (const touch of e.changedTouches) {
        this.ongoingTouches.push(this.copyTouch(touch))

        this.ctx.beginPath()
      }
    },
    handleMove (e) {
      if (this.tool === 'fill') return

      for (const touch of e.changedTouches) {
        const idx = this.ongoingTouchIndexById(touch.identifier)

        if (idx >= 0) {
          const { x: lastX, y: lastY } = this.getActualTouchPos(this.ongoingTouches[idx])
          const { x, y } = this.getActualTouchPos(touch)

          this.ctx.beginPath()
          this.ctx.moveTo(lastX, lastY)
          this.ctx.lineTo(x, y)

          this.ctx.stroke()

          this.ongoingTouches.splice(idx, 1, this.copyTouch(touch))
        } else {
          console.log('Can\'t figure out which touch to continue')
        }
      }
    },
    handleEnd (e) {
      if (this.tool === 'fill') return

      for (const touch of e.changedTouches) {
        const idx = this.ongoingTouchIndexById(touch.identifier)

        if (idx >= 0) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches.pageY)
          const { x, y } = this.getActualTouchPos(touch)
          this.ctx.lineTo(x, y)
          this.ongoingTouches.splice(idx, 1)
        } else {
          console.log('Can\'t figure out which touch to end')
        }
      }
    },
    handleCancel (e) {
      if (this.tool === 'fill') return

      for (const touch of e.changedTouches) {
        const idx = this.ongoingTouchIndexById(touch.identifier)
        this.ongoingTouches.splice(idx, 1)
      }
    },
    copyTouch (touch) {
      return {
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY
      }
    },
    ongoingTouchIndexById (id) {
      for (let i = 0; i < this.ongoingTouches.length; i++) {
        if (this.ongoingTouches[i].identifier === id) {
          return i
        }
      }

      return -1
    },
    getActualTouchPos (touch) {
      return {
        x: Math.round((touch.pageX - this.offset.x) * this.offset.scaleX),
        y: Math.round((touch.pageY - this.offset.y) * this.offset.scaleY)
      }
    },
    floodFill ({ x, y }) {
      // Thanks to https://ben.akrin.com/?p=7888 and http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/ !
      const color = this.hexToRgba(this.color)
      const pixelStack = [{ x, y }]
      const pixels = this.ctx.getImageData(0, 0, this.width, this.height)
      const pixelData = pixels.data
      let linearColor = Math.round((y * this.width + x) * 4)
      const originalColor = {
        r: pixelData[linearColor],
        g: pixelData[linearColor + 1],
        b: pixelData[linearColor + 2],
        a: pixelData[linearColor + 3]
      }

      if (color.r === originalColor.r && color.g === originalColor.g &&
        color.b === originalColor.b && color.a === originalColor.a) {
        return
      }

      this.addToHistory()

      while (pixelStack.length > 0) {
        let { x, y } = pixelStack.shift()
        let reachedLeft = false
        let reachedRight = false

        linearColor = (y * this.width + x) * 4
        while (y-- >= 0 &&
                  (pixelData[linearColor] === originalColor.r &&
                  pixelData[linearColor + 1] === originalColor.g &&
                  pixelData[linearColor + 2] === originalColor.b &&
                  pixelData[linearColor + 3] === originalColor.a)) {
          linearColor -= this.width * 4
        }

        linearColor += this.width * 4
        y++

        while (y++ < this.height &&
                  (pixelData[linearColor] === originalColor.r &&
                  pixelData[linearColor + 1] === originalColor.g &&
                  pixelData[linearColor + 2] === originalColor.b &&
                  pixelData[linearColor + 3] === originalColor.a)) {
          pixelData[linearColor] = color.r
          pixelData[linearColor + 1] = color.g
          pixelData[linearColor + 2] = color.b
          pixelData[linearColor + 3] = color.a

          if (x > 0) {
            if (pixelData[linearColor - 4] === originalColor.r &&
                    pixelData[linearColor - 4 + 1] === originalColor.g &&
                    pixelData[linearColor - 4 + 2] === originalColor.b &&
                    pixelData[linearColor - 4 + 3] === originalColor.a) {
              if (!reachedLeft) {
                pixelStack.push({ x: x - 1, y })
                reachedLeft = true
              }
            } else if (reachedLeft) {
              reachedLeft = false
            }
          }

          if (x < this.width - 1) {
            if (pixelData[linearColor + 4] === originalColor.r &&
                    pixelData[linearColor + 4 + 1] === originalColor.g &&
                    pixelData[linearColor + 4 + 2] === originalColor.b &&
                    pixelData[linearColor + 4 + 3] === originalColor.a) {
              if (!reachedRight) {
                pixelStack.push({ x: x + 1, y })
                reachedRight = true
              }
            } else if (reachedRight) {
              reachedRight = false
            }
          }

          linearColor += this.width * 4
        }
      }

      this.ctx.putImageData(pixels, 0, 0)
    },
    hexToRgba (color) {
      color = color.replace('#', '')
      const bigint = parseInt(color, 16)
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 255
      }
    },
    ...mapMutations([
      'setDrawingCanvas'
    ])
  }
}
</script>

<style lang="scss">

</style>
