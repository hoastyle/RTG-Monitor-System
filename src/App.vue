<template>
  <div class="rtg-monitor" 
       :style="{ backgroundColor: COLORS.background }"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave">
    
    <DashboardHeader 
      :currentTime="currentTime"
      :viewMode="viewMode" 
      :autoRotate="autoRotate"
      @changeViewMode="setViewMode"
      @toggleAutoRotate="toggleAutoRotate"
      @refreshData="refreshData" />
    
    <div class="main-content">
      <!-- 单项目视图或车辆视图的项目选择器 -->
      <ProjectSelector 
        v-if="viewMode === 'single' || viewMode === 'vehicles'"
        :projects="projects"
        :selectedProject="selectedProject"
        :currentProjectVersion="currentProjectVersion"
        :currentProjectData="currentProjectData"
        @changeProject="handleProjectChange" />
      
      <!-- 项目比对视图标题 -->
      <div v-if="viewMode === 'compare'" class="comparison-header">
        <div class="title-container">
          <h2>所有港口项目比对</h2>
          <div class="project-count">{{ projects.length }} 个项目</div>
        </div>
        <div class="time-info">
          <span>数据更新时间:</span>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      
      <!-- 单项目视图内容 -->
      <template v-if="viewMode === 'single'">
        <StatusOverview 
          :expanded="expandedSections.overview"
          :selectedProject="selectedProject"
          :projectData="currentProjectData"
          :trendData="currentTrendData"
          @toggleSection="toggleSection('overview')" />
        
        <TakeoverAnalysis 
          :expanded="expandedSections.takeovers"
          :selectedProject="selectedProject"
          :projectData="currentProjectData"
          :takeoverData="currentTakeoverData"
          :activeIndex="activeIndex"
          @setActiveIndex="setActiveIndex"
          @toggleSection="toggleSection('takeovers')" />
        
        <EfficiencyTrend 
          :expanded="expandedSections.trend"
          :selectedProject="selectedProject"
          :trendData="currentTrendData"
          :projectData="currentProjectData"
          @toggleSection="toggleSection('trend')" />
      </template>
      
      <!-- 车辆详情视图 -->
      <VehicleList 
        v-if="viewMode === 'vehicles'"
        :expanded="expandedSections.vehicles"
        :selectedProject="selectedProject"
        :vehiclesData="currentVehiclesData"
        :currentPage="currentPage"
        :vehiclesPerPage="vehiclesPerPage"
        :selectedVehicle="selectedVehicle"
        @toggleSection="toggleSection('vehicles')"
        @nextPage="handleNextPage"
        @prevPage="handlePrevPage"
        @selectVehicle="handleSelectVehicle" />
      
      <!-- 比对视图内容 -->
      <template v-if="viewMode === 'compare'">
        <ProjectComparison 
          :expanded="expandedSections.comparison"
          :projects="projects"
          :realtimeData="realtimeData"
          :projectComparisonData="projectComparisonData"
          :efficiencyBarData="efficiencyBarData"
          :projectScatterData="projectScatterData"
          @toggleSection="toggleSection('comparison')" />
        
        <TakeoverComparison 
          :expanded="expandedSections.takeovers"
          :realtimeData="realtimeData"
          :takeoverData="takeoverData"
          :projectComparisonData="projectComparisonData"
          :projectScatterData="projectScatterData"
          @toggleSection="toggleSection('takeovers')" />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import DashboardHeader from './layouts/DashboardHeader.vue';
import ProjectSelector from './components/dashboard/ProjectSelector.vue';
import StatusOverview from './components/dashboard/StatusOverview.vue';
import TakeoverAnalysis from './components/dashboard/TakeoverAnalysis.vue';
import EfficiencyTrend from './components/dashboard/EfficiencyTrend.vue';
import VehicleList from './components/dashboard/VehicleList.vue';
import ProjectComparison from './components/dashboard/ProjectComparison.vue';
import TakeoverComparison from './components/dashboard/TakeoverComparison.vue';

import { projects, realtimeData, vehiclesData, historyTrends, takeoverData, rotationSteps, getProjectComparisonData, getProjectScatterData, getEfficiencyBarData } from './data/projectData';
import { COLORS } from './utils/colors';
import { formatTime } from './utils/formatters';

export default {
  name: 'App',
  components: {
    DashboardHeader,
    ProjectSelector,
    StatusOverview,
    TakeoverAnalysis,
    EfficiencyTrend,
    VehicleList,
    ProjectComparison,
    TakeoverComparison
  },
  setup() {
    // 状态变量
    const currentTime = ref(formatTime());
    const selectedProject = ref(projects[0].name);
    const viewMode = ref('single'); // 'single', 'compare', 'vehicles'
    const activeIndex = ref(-1);
    const expandedSections = ref({
      overview: true,
      takeovers: true,
      trend: true,
      comparison: true,
      vehicles: true
    });
    const autoRotate = ref(true);
    const rotationTimer = ref(null);
    const rotationStep = ref(0);
    const currentPage = ref(0);
    const hovering = ref(false);
    const selectedVehicle = ref(null);
    const vehiclesPerPage = 4;

    // 计算属性
    const currentProjectData = computed(() => realtimeData[selectedProject.value]);
    const currentTakeoverData = computed(() => takeoverData[selectedProject.value]);
    const currentTrendData = computed(() => historyTrends[selectedProject.value]);
    const currentVehiclesData = computed(() => vehiclesData[selectedProject.value]);
    const currentProjectVersion = computed(() => {
      const project = projects.find(p => p.name === selectedProject.value);
      return project ? project.version : '';
    });
    
    // 比对视图数据
    const projectComparisonData = computed(() => getProjectComparisonData());
    const projectScatterData = computed(() => getProjectScatterData());
    const efficiencyBarData = computed(() => getEfficiencyBarData());

    // 自动轮换视图逻辑
    watch([autoRotate, hovering], ([isAutoRotate, isHovering]) => {
      if (rotationTimer.value) {
        clearTimeout(rotationTimer.value);
        rotationTimer.value = null;
      }
      
      if (isAutoRotate && !isHovering) {
        rotationTimer.value = setTimeout(() => {
          const nextStep = (rotationStep.value + 1) % rotationSteps.length;
          rotationStep.value = nextStep;
          
          // 应用新的视图设置
          const { mode, project, section } = rotationSteps[nextStep];
          viewMode.value = mode;
          if (project) selectedProject.value = project;
          
          // 展开当前部分，折叠其他部分
          const newExpandedSections = {
            overview: false,
            takeovers: false,
            trend: false,
            comparison: false,
            vehicles: false
          };
          newExpandedSections[section] = true;
          expandedSections.value = newExpandedSections;
          
          // 重置页码
          currentPage.value = 0;
        }, 10000); // 每10秒切换一次视图
      }
    }, { immediate: true });

    // 更新时间
    onMounted(() => {
      const timer = setInterval(() => {
        currentTime.value = formatTime();
      }, 1000);
      
      // 清理定时器
      onUnmounted(() => {
        clearInterval(timer);
        if (rotationTimer.value) {
          clearTimeout(rotationTimer.value);
        }
      });
    });

    // 处理项目切换
    const handleProjectChange = (projectName) => {
      selectedProject.value = projectName;
      currentPage.value = 0; // 重置页码
      if (selectedVehicle.value) selectedVehicle.value = null; // 重置选中的车辆
      autoRotate.value = false; // 停止自动轮换
    };

    // 切换视图模式
    const setViewMode = (mode) => {
      viewMode.value = mode;
      autoRotate.value = false; // 停止自动轮换
    };

    // 切换自动轮换
    const toggleAutoRotate = () => {
      autoRotate.value = !autoRotate.value;
    };

    // 切换展开/折叠状态
    const toggleSection = (section) => {
      expandedSections.value = {
        ...expandedSections.value,
        [section]: !expandedSections.value[section]
      };
    };

    // 鼠标悬停控制
    const handleMouseEnter = () => hovering.value = true;
    const handleMouseLeave = () => hovering.value = false;

    // 分页导航
    const handleNextPage = () => {
      const maxPage = Math.ceil(currentVehiclesData.value.length / vehiclesPerPage) - 1;
      if (currentPage.value < maxPage) {
        currentPage.value++;
      }
    };

    const handlePrevPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
      }
    };

    // 选择车辆
    const handleSelectVehicle = (vehicleId) => {
      selectedVehicle.value = vehicleId === selectedVehicle.value ? null : vehicleId;
    };

    // 刷新数据
    const refreshData = () => {
      console.log('Refreshing data...');
      activeIndex.value = -1;
    };

    // 设置活跃的饼图扇区
    const setActiveIndex = (index) => {
      activeIndex.value = index;
    };

    return {
      // 状态
      currentTime,
      selectedProject,
      viewMode,
      activeIndex,
      expandedSections,
      autoRotate,
      currentPage,
      hovering,
      selectedVehicle,
      vehiclesPerPage,
      COLORS,
      
      // 数据
      projects,
      realtimeData,
      vehiclesData,
      historyTrends,
      takeoverData,
      
      // 计算属性
      currentProjectData,
      currentTakeoverData,
      currentTrendData,
      currentVehiclesData,
      currentProjectVersion,
      projectComparisonData,
      projectScatterData,
      efficiencyBarData,
      
      // 方法
      handleProjectChange,
      setViewMode,
      toggleAutoRotate,
      toggleSection,
      handleMouseEnter,
      handleMouseLeave,
      handleNextPage,
      handlePrevPage,
      handleSelectVehicle,
      refreshData,
      setActiveIndex
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #eaeaea;
}

.rtg-monitor {
  min-height: 100vh;
}

.main-content {
  padding: 20px;
}

.comparison-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.project-count {
  margin-left: 12px;
  background-color: #38b2ac;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.time-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #a0aec0;
}

.time-info span:first-child {
  margin-right: 8px;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
