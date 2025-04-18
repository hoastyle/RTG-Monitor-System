import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],  // 确保这一行存在并且正确
  server: {
    port: 3000,
    open: true
  }
});
