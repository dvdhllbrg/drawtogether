import Buefy from 'buefy'
import Vue, { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/app.scss'
import router from './router'
import store from './store'

Vue.use(Buefy)

Vue.mixin({
  methods: {
    getImageUrl (slug) {
      return require(`@/assets/${slug}.png`)
    }
  }
})

Vue.config.productionTip = false

createApp(App).use(router).use(store).mount('#app')
