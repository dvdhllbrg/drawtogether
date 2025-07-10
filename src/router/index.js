import { createMemoryHistory, createRouter } from 'vue-router'
import GameView from '../views/GameView.vue'

const routes = [
  {
    path: '/:room?',
    name: 'Game',
    component: GameView,
    props: true
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
