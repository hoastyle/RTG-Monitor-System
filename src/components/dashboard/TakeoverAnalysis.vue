<template>
  <div class="takeover-analysis" :style="cardStyle">
    <div 
      class="card-header" 
      :style="{ backgroundColor: projectData.takeovers > 20 ? 'rgba(229, 62, 62, 0.1)' : 'transparent' }"
      @click="$emit('toggleSection')"
    >
      <div class="header-content">
        <h2 class="section-title">{{ selectedProject }} - 人工跳台分析</h2>
        <div v-if="projectData.takeovers > 20" class="alert-badge">
          <el-icon><WarningFilled /></el-icon>
          <span>需要关注</span>
        </div>
      </div>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <div class="analysis-grid">
        <!-- 跳台原因分析 -->
        <div class="pie-section">
          <h3 class="section-title">跳台原因分布</h3>
          <div class="pie-container">
            <div class="pie-chart" ref="pieChart"></div>
            <div v-if="activeIndex === -1" class="pie-center-info">
              <div class="total-label">总计</div>
              <div class="total-value">{{ totalTakeovers }}</div>
              <div class="total-desc">次跳台</div>
            </div>
          </div>
          <div class="legends">
            <div class="legend-item">
              <div class="legend-color high"></div>
              <span>高优先级: {{ highPriorityTotal }} 次</span>
            </div>
            <div class="legend-item">
              <div class="legend-color medium"></div>
              <span>中优先级: {{ mediumPriorityTotal }} 次</span>
            </div>
            <div class="legend-item">
              <div class="legend-color low"></div>
              <span>低优先级: {{ lowPriorityTotal }} 次</span>
            </div>
          </div>
        </div>
        
        <!-- 高优先级问题详情 -->
        <div class="high-priority-section">
          <h3 class="high-priority-title">
            高优先级问题
            <span class="high-count">{{ highPriorityTotal }} 次</span>
          </h3>
          <div class="high-priority-list">
            <div 
              v-for="(problem, index) in highPriorityProblems" 
              :key="index"
              class="problem-item"
              :class="{ 'no-border': index === highPriorityProblems.length - 1 }"
            >
              <div class="problem-header">
                <div class="problem-name">{{ problem.reason }}</div>
                <div class="problem-count">{{ problem.count }} 次</div>
              </div>
              
              <div class="problem-time">
                发生时间: 今日 10:24 - 16:48，共 {{ problem.count }} 次
              </div>
              
              <div class="problem-status">
                <div class="status-label">解决状态:</div>
                <div class="status-tag" :class="index === 0 ? 'warning' : 'danger'">
                  <el-icon v-if="index === 0"><WarningFilled /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                  <span>{{ index === 0 ? '处理中' : '待处理' }}</span>
                </div>
              </div>
              
              <div class="problem-suggestion">
                <span class="suggestion-label">建议:</span>
                {{ problem.reason === '传感器故障' 
                  ? '更换升级型号传感器，优化故障检测算法'
                  : '校准GPS定位系统，增加辅助定位设备' }}
              </div>
              
              <div class="problem-owner">
                <span class="owner-label">负责人:</span>
                {{ problem.reason === '传感器故障' ? '张工 / 技术部' : '李工 / 运维部' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { COLORS } from '../../utils/colors';

export default {
  name: 'TakeoverAnalysis',
  props: {
    expanded: {
      type: Boolean,
      required: true
    },
    selectedProject: {
      type: String,
      required: true
    },
    projectData: {
      type: Object,
      required: true
    },
    takeoverData: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  emits: ['toggleSection', 'setActiveIndex'],
  setup(props, { emit }) {
    const pieChart = ref(null);
    
    // 卡片样式
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));
    
    // 计算高优先级问题
    const highPriorityProblems = computed(() => {
      return props.takeoverData.filter(item => item.severity === 'high');
    });
    
    // 计算总跳台次数
    const totalTakeovers = computed(() => {
      return props.takeoverData.reduce((sum, item) => sum + item.count, 0);
    });
    
    // 计算各优先级总数
    const highPriorityTotal = computed(() => {
      return props.takeoverData
        .filter(item => item.severity === 'high')
        .reduce((sum, item) => sum + item.count, 0);
    });
    
    const mediumPriorityTotal = computed(() => {
      return props.takeoverData
        .filter(item => item.severity === 'medium')
        .reduce((sum, item) => sum + item.count, 0);
    });
    
    const lowPriorityTotal = computed(() => {
      return props.takeoverData
        .filter(item => item.severity === 'low')
        .reduce((sum, item) => sum + item.count, 0);
    });
    
    // 初始化饼图
    const initPieChart = () => {
      if (!pieChart.value) return;
      
      const chart = window.echarts.init(pieChart.value);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 次 ({d}%)',
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: COLORS.cardBg,
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            data: props.takeoverData.map((item, index) => ({
              value: item.count,
              name: item.reason,
              itemStyle: {
                color: COLORS.severityColors[item.severity]
              }
            }))
          }
        ]
      };
      
      chart.setOption(option);
      
      // 监听高亮变化
      chart.on('mouseover', { seriesIndex: 0 }, (params) => {
        emit('setActiveIndex', params.dataIndex);
      });
      
      chart.on('mouseout', { seriesIndex: 0 }, () => {
        emit('setActiveIndex', -1);
      });
    };
    
    // 监听展开状态变化和数据变化，重新初始化图表
    watch(() => [props.expanded, props.takeoverData, props.selectedProject], () => {
      if (props.expanded) {
        setTimeout(() => {
          initPieChart();
        }, 0);
      }
    }, { immediate: true });
    
    return {
      COLORS,
      cardStyle,
      pieChart,
      highPriorityProblems,
      totalTakeovers,
      highPriorityTotal,
      mediumPriorityTotal,
      lowPriorityTotal
    };
  }
};
</script>

<style scoped>
.card-header {
  padding: 12px 16px;
  border-bottom: v-bind('expanded ? `1px solid ${COLORS.border}` : "none"');
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.header-content {
  display: flex;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.alert-badge {
  display: flex;
  align-items: center;
  margin-left: 12px;
  background-color: v-bind('COLORS.danger');
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.alert-badge .el-icon {
  margin-right: 4px;
}

.card-content {
  padding: 16px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.pie-section h3,
.high-priority-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
}

.pie-container {
  width: 100%;
  height: 300px;
  position: relative;
}

.pie-chart {
  width: 100%;
  height: 100%;
}

.pie-center-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-label {
  font-size: 16px;
  font-weight: bold;
}

.total-value {
  font-size: 24px;
  font-weight: bold;
}

.total-desc {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.legends {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.legend-item:last-child {
  margin-right: 0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 6px;
}

.legend-color.high {
  background-color: v-bind('COLORS.severityColors.high');
}

.legend-color.medium {
  background-color: v-bind('COLORS.severityColors.medium');
}

.legend-color.low {
  background-color: v-bind('COLORS.severityColors.low');
}

.legend-item span {
  font-size: 12px;
}

.high-priority-section {
  height: 100%;
}

.high-priority-title {
  display: flex;
  align-items: center;
}

.high-count {
  margin-left: 8px;
  padding: 2px 6px;
  background-color: v-bind('COLORS.danger');
  color: white;
  font-size: 12px;
  border-radius: 4px;
}

.high-priority-list {
  background-color: rgba(229, 62, 62, 0.05);
  border-radius: 6px;
  padding: 16px;
  border: 1px solid rgba(229, 62, 62, 0.2);
  height: calc(100% - 70px);
  overflow-y: auto;
}

.problem-item {
  border-bottom: 1px solid v-bind('COLORS.border');
  padding: 12px 0;
  margin-bottom: 8px;
}

.problem-item.no-border {
  border-bottom: none;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.problem-name {
  font-size: 16px;
  font-weight: 500;
}

.problem-count {
  background-color: v-bind('COLORS.danger');
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.problem-time {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
  margin-bottom: 8px;
}

.problem-status {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  align-items: center;
  margin-bottom: 8px;
}

.status-label {
  color: v-bind('COLORS.text');
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-tag.warning {
  background-color: rgba(237, 137, 54, 0.2);
  color: v-bind('COLORS.warning');
}

.status-tag.danger {
  background-color: rgba(229, 62, 62, 0.2);
  color: v-bind('COLORS.danger');
}

.status-tag .el-icon {
  margin-right: 4px;
}

.problem-suggestion, .problem-owner {
  font-size: 14px;
  margin-bottom: 8px;
}

.problem-owner {
  margin-bottom: 0;
}

.suggestion-label, .owner-label {
  color: v-bind('COLORS.textSecondary');
  margin-right: 8px;
}
</style>
