import Vue from 'vue'
import Meta from 'vue-meta'
import entry from '@alias/entry'
import { sync } from 'vuex-router-sync'
import { warn } from './utils'

const meta = Object.assign({
  keyName: 'head',
  attribute: 'data-ream-head',
  ssrAttribute: 'data-ream-head-ssr',
  tagIDKeyName: 'vmid'
}, entry.meta)

Vue.use(Meta, meta)

Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { preFetch } = this.$options
    if (preFetch) {
      preFetch({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

export default context => {
  const root = entry.root || 'app'

  if (process.env.NODE_ENV !== 'production') {
    warn(
      typeof entry.createRouter === 'function',
      `Expected "createRouter" to be a function but got ${typeof entry.createRouter}`
    )
  }

  const router = entry.createRouter(context)
  const store = entry.createStore && entry.createStore(context)

  if (store && router) {
    sync(store, router)
  }

  const app = new Vue({
    store,
    router,
    render: h => {
      return h('div', {
        attrs: {
          id: root
        }
      }, [h(entry.App || 'router-view')])
    }
  })

  return {
    app,
    router,
    store,
    root
  }
}
