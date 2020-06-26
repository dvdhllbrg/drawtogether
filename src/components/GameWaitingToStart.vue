<template lang="pug">
  div
    game-header
    .container
      h1.title 👋 Hi {{ player.name }}!
      p.subtitle Welcome to room&nbsp;
        b {{ game.room }}
        |. What a gang you've got here!
      #players.my-5
        .columns.is-multiline.is-mobile(v-show="game.players")
          .column.is-one-third(v-for="gp in game.players")
            figure.image.is-96x96
              img.is-rounded(
                v-if="gp.avatar"
                alt="Player avatar"
                :src="getImageUrl(gp.avatar)"
              )
              span.avatar(v-else) 🙈
            b-tag(
              v-if="gp.vip"
              size="is-medium"
              type="is-primary"
            ) VIP!
            p.title.is-4 {{ gp.name }}
      .my-5
        p Tell the other players to go to:
        pre.joinUrl
          a(:href="joinUrl") {{ joinUrl }}
        div(v-if="player.vip")
          p Once everyone has joined, click the button below to start the game.
          b-field.mt-2
            b-button.is-fullwidth(
              type="is-primary"
              size="is-large"
              @click="startGame(settings)"
            ) 🏁 Start game
        p(v-else) After everyone has joined,&nbsp;
          b {{ game.vipName }}&nbsp;
          |can start the game on their phone.
      .my-2(v-if="player.vip")
        h2.title ⚙️ Want to tweak the settings?
        .my-2
          label.label.is-large ⏲️ Time limit
          b-field
            b-radio-button(
              v-model="settings.timeLimit"
              :native-value="60"
              size="is-medium"
            ) 1 minute
            b-radio-button(
              v-model="settings.timeLimit"
              :native-value="180"
              size="is-medium"
            ) 3 minutes
            b-radio-button(
              v-model="settings.timeLimit"
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
                size="is-large"
              )
              span.level-item.is-size-3 Yes
          p Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.

      .my-2
        h2.title 🤓 So here's how this is going to work
        p Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.
        p Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.
        p Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GameHeader from './GameHeader'

export default {
  name: 'GameWaitingToStart',
  components: {
    GameHeader
  },
  data: () => ({
    settings: {
      timeLimit: 180,
      colorSimilarity: false,
      individualSimilarity: true
    }
  }),
  computed: {
    joinUrl () {
      return `${window.location.host}/${this.game.room}`
    },
    ...mapState([
      'game',
      'player'
    ])
  },
  methods: {
    ...mapActions([
      'startGame'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.container {
  padding: 2rem;

  .joinUrl {
    text-align: center;

    a {
      color: $text;
      font-weight: $weight-bold;
      font-size: $size-5;
    }
  }

  #players {
    .column {
      position: relative;
    }

    .avatar {
      font-size: 72px;
      line-height: 72px;
    }

    .tag {
      position: absolute;
      bottom: 48px;
      right: 18px;
      transform: rotate(-20deg);
    }
  }
}
</style>
