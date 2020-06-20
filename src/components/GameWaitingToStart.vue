<template lang="pug">
  .container
    h1.title 👋 Hi {{ player.name }}!
    p.subtitle Welcome to room
      b {{ game.room }}
    #players
      .columns.is-multiline.is-mobile(v-show="game.players.length > 0")
        .column.is-one-third(v-for="gp in game.players")
          figure.image.is-128x128
            img.is-rounded(
              v-if="gp.avatar"
              alt="Player avatar"
              :src="getImageUrl(gp.avatar)"
            )
            span.avatar(v-else) 🙈
            b-tag(
              v-if="gp.vip"
            ) VIP!
          p.title.is-4 {{ gp.name }}
    p While you're waiting for XYZ to start the game, we figured we'd tell you a little bit about how it works, in case you're unfamiliar.
    h2.title 🤓 Here's how this works
    p Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.
    p Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.
    p Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GameWaitingToStart',
  data: () => ({
  }),
  computed: {
    ...mapState([
      'game',
      'player'
    ])
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 2rem;

  #players {
    .avatar {
      font-size: 48px;
      line-height: 48px;
    }

    .tag {
      margin-left: -2.5rem;
      transform: rotate(-15deg);
    }
  }
}
</style>
