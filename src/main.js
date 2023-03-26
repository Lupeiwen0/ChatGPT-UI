import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import 'animate.css';

const app = createApp(App)

setupStore(app)

app.mount('#app')
