<template lang="pug">
  div
    .my-2
      label.label.is-large ⏲️ Time limit
      b-field
        b-radio-button(
          v-model="settings.timeLimit"
            @input="updateSettings"
          :native-value="60"
          size="is-medium"
        ) 1 minute
        b-radio-button(
          v-model="settings.timeLimit"
            @input="updateSettings"
          :native-value="180"
          size="is-medium"
        ) 3 minutes
        b-radio-button(
          v-model="settings.timeLimit"
            @input="updateSettings"
          :native-value="300"
          size="is-medium"
        ) 5 minutes
      p Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale.
    .my-2
      b-field(
        label="🎨 Color affects similarity rating"
        custom-class="is-large"
      )
        .level.is-mobile
          span.level-item.is-size-3 No
          b-switch.level-item(
            v-model="settings.colorSimilarity"
            @input="updateSettings"
            size="is-large"
          )
          span.level-item.is-size-3 Yes
      p Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.
    .my-2
      b-field(
        label="🖼️ Show individual player similarity"
        custom-class="is-large"
      )
        .level.is-mobile
          span.level-item.is-size-3 No
          b-switch.level-item(
            v-model="settings.individualSimilarity"
            @input="updateSettings"
            size="is-large"
          )
          span.level-item.is-size-3 Yes
      p Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.

</template>

<script>
export default {
  name: 'GameSettings',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateSettings () {
      this.$emit('update:settings', this.settings)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
