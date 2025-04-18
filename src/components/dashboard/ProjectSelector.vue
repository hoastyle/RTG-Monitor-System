<template>
  <div class="project-selector">
    <div class="selector-left">
      <div class="selector-label">选择项目:</div>
      <div class="button-group">
        <button
          v-for="project in projects"
          :key="project.id"
          :class="['project-btn', { active: selectedProject === project.name }]"
          @click="$emit('changeProject', project.name)"
        >
          {{ project.name }}
          <span 
            class="status-indicator" 
            :style="{ 
              backgroundColor: project.status === 'active' ? COLORS.success : 
                              project.status === 'warning' ? COLORS.warning : COLORS.danger 
            }"
          ></span>
        </button>
      </div>
    </div>
    
    <div class="version-info">
      <span class="label">版本:</span>
      <span class="version-tag" :style="{ backgroundColor: COLORS.cardBg }">
        {{ currentProjectVersion }}
      </span>
      <span class="label last-update">最后更新:</span>
      <span>{{ currentProjectData.lastUpdate }}</span>
    </div>
  </div>
</template>

<script>
import { COLORS } from '../../utils/colors';

export default {
  name: 'ProjectSelector',
  props: {
    projects: {
      type: Array,
      required: true
    },
    selectedProject: {
      type: String,
      required: true
    },
    currentProjectVersion: {
      type: String,
      required: true
    },
    currentProjectData: {
      type: Object,
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
.project-selector {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selector-left {
  display: flex;
  align-items: center;
}

.selector-label {
  font-size: 14px;
  margin-right: 10px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.project-btn {
  background-color: v-bind('COLORS.cardBg');
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
}

.project-btn.active {
  background-color: v-bind('COLORS.active');
}

.status-indicator {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.version-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.label {
  margin-right: 8px;
}

.version-tag {
  padding: 2px 8px;
  border-radius: 4px;
}

.last-update {
  margin-left: 16px;
}
</style>
