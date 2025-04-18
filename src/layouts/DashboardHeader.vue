<template>
  <header class="header" :style="{ borderBottom: `1px solid ${COLORS.border}` }">
    <div class="header-left">
      <h1 class="title">RTG自动化实时监控平台</h1>
      <div class="realtime-tag">
        <span>实时</span>
        <div class="pulse-dot"></div>
      </div>
    </div>
    
    <div class="header-right">
      <!-- 视图切换按钮 -->
      <div class="view-mode-group" :style="{ background: COLORS.cardBg }">
        <button 
          @click="$emit('changeViewMode', 'single')" 
          :class="{ active: viewMode === 'single' }">
          <el-icon><Grid /></el-icon>
          <span>单项目视图</span>
        </button>
        <button 
          @click="$emit('changeViewMode', 'compare')" 
          :class="{ active: viewMode === 'compare' }">
          <el-icon><DataAnalysis /></el-icon>
          <span>项目比对</span>
        </button>
        <button 
          @click="$emit('changeViewMode', 'vehicles')" 
          :class="{ active: viewMode === 'vehicles' }">
          <el-icon><Van /></el-icon>
          <span>车辆详情</span>
        </button>
      </div>
      
      <!-- 自动轮换控制 -->
      <button 
        @click="$emit('toggleAutoRotate')" 
        :class="['auto-rotate-btn', { active: autoRotate }]">
        <el-icon v-if="autoRotate"><VideoPause /></el-icon>
        <el-icon v-else><VideoPlay /></el-icon>
        <span>{{ autoRotate ? '暂停轮换' : '自动轮换' }}</span>
      </button>
      
      <!-- 当前时间 -->
      <div class="current-time">
        <el-icon><Clock /></el-icon>
        <span>{{ currentTime }}</span>
      </div>
      
      <!-- 刷新按钮 -->
      <button class="refresh-btn" @click="$emit('refreshData')">
        <el-icon><Refresh /></el-icon>
        <span>刷新数据</span>
      </button>
    </div>
  </header>
</template>

<script>
import { COLORS } from '../utils/colors';

export default {
  name: 'DashboardHeader',
  props: {
    currentTime: {
      type: String,
      required: true
    },
    viewMode: {
      type: String,
      required: true
    },
    autoRotate: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    return {
      COLORS
    };
  }
};
</script>

<style scoped>
.header {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.realtime-tag {
  margin-left: 12px;
  background-color: #38b2ac;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  margin-left: 4px;
  animation: pulse 2s infinite;
}

.header-right {
  display: flex;
  align-items: center;
}

.view-mode-group {
  display: flex;
  margin-right: 16px;
  border-radius: 4px;
  padding: 2px;
}

.view-mode-group button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-mode-group button.active {
  background-color: #38b2ac;
}

.view-mode-group button .el-icon {
  margin-right: 6px;
}

.auto-rotate-btn {
  display: flex;
  align-items: center;
  background-color: v-bind('COLORS.cardBg');
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 16px;
}

.auto-rotate-btn.active {
  background-color: v-bind('COLORS.active');
}

.auto-rotate-btn .el-icon {
  margin-right: 6px;
}

.current-time {
  margin-right: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.current-time .el-icon {
  margin-right: 6px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  background-color: v-bind('COLORS.active');
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn .el-icon {
  margin-right: 6px;
}
</style>
