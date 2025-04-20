import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import * as echarts from 'echarts';

// Create Vue application
const app = createApp(App);

// Register Element Plus
app.use(ElementPlus);

// Register all icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// Make echarts available globally
// app.config.globalProperties.$echarts = echarts;
window.echarts = echarts

// Mount the app
app.mount('#app');
