import { createApp } from 'vue'
import './assets/css/main.scss'
import 'virtual:uno.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './types/global.d'
import loadingDirective from './directives/loading.tsx'
import { createI18n } from 'vue-i18n'

const pinia = createPinia()
const app = createApp(App)

;(window as any).useHead = () => {}
;(window as any).useRoute = () => ({})
;(window as any).useRouter = () => ({ push() {}, replace() {} })

// 关键：Vite 的 glob
const modules = import.meta.glob('../../i18n/locales/*.json', {
  eager: true
})

const messages: Record<string, any> = {}

for (const path in modules) {
  const matched = path.match(/\/([^/]+)\.json$/)
  if (matched) {
    const locale = matched[1]
    messages[locale] = modules[path].default
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})

app.use(i18n)
app.use(VueVirtualScroller)
app.use(pinia)
app.use(router)

app.directive('opacity', (el, binding) => {
  el.style.opacity = binding.value ? 1 : 0
})
app.directive('loading', loadingDirective)
app.mount('#app')
