import Vue from 'vue'
import App from './App'
import tab from "@/components/tab.vue"
Vue.config.productionTip = false
App.mpType = 'app'

let tabBar = Vue.component('tab', tab)
//document.body.appendChild(new tabBar().$mount().$el)

const app = new Vue({
    ...App
})
app.$mount()
