<template lang="pug">
  .canvasWrapper(ref="canvasWrapper")
    canvas(
      v-if="img"
      ref="imgCanvas"
    )
    p(v-else) loading ...
</template>

<script>
export default {
  name: 'GameImageCanvas',
  props: {
    img: {
      type: Image,
      required: true
    }
  },
  data: () => ({
    maxWidth: 1,
    maxHeight: 1
  }),
  watch: {
    img () {
      this.drawImage()
    }
  },
  mounted () {
    const r = this.$refs.canvasWrapper.getBoundingClientRect()
    this.maxWidth = r.width
    this.maxHeight = r.height

    if (this.img) {
      this.drawImage()
    }
  },
  methods: {
    drawImage () {
      const canvas = this.$refs.imgCanvas
      const ctx = canvas.getContext('2d')
      canvas.width = this.imgSize.width
      canvas.height = this.imgSize.height
      ctx.drawImage(this.img, 0, 0, this.imgSize.width, this.imgSize.height)

      this.$refs.canvasWrapper.style.height = `${this.imgSize.height}px`
      this.$refs.canvasWrapper.style.width = `${this.imgSize.width}px`
    }
  },
  computed: {
    imgSize () {
      const ratio = Math.min(this.maxWidth / this.img.width, this.maxHeight / this.img.height)

      return {
        width: Math.floor(this.img.width * ratio),
        height: Math.floor(this.img.height * ratio)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
