<template>
  <div class="status-overview" :style="cardStyle">
    <div class="card-header" @click="$emit('toggleSection')">
      <h2 class="section-title">{{ selectedProject }} - 实时状态概览</h2>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <div class="overview-grid">
        <!-- 统计卡片区域 -->
        <div class="stats-grid">
          <div class="stat-card operations">
            <div class="stat-header">
              <div class="stat-label">今日作业量</div>
              <el-icon class="icon"><DataLine /></el-icon>
            </div>
            <div class="stat-value">{{ projectData.operations }}</div>
            <div class="stat-info">
              <el-icon class="trend-icon"><TrendCharts /></el-icon>
              较昨日 +5%
            </div>
          </div>
          
          <div class="stat-card distance">
            <div class="stat-header">
              <div class="stat-label">行走距离</div>
              <el-icon class="icon"><Van /></el-icon>
            </div>
            <div class="stat-value">{{ projectData.distance }} km</div>
            <div class="stat-info">
              平均每台 {{ (projectData.distance / projectData.activeVehicles).toFixed(1) }} km
            </div>
          </div>
          
          <div class="stat-card takeovers">
            <div class="stat-header">
              <div class="stat-label">今日跳台次数</div>
              <el-icon class="icon"><WarningFilled /></el-icon>
            </div>
            <div class="stat-value">{{ projectData.takeovers }}</div>
            <div class="stat-info" :class="{ 'warning-text': projectData.takeovers > 20 }">
              {{ projectData.takeovers > 20 ? '异常，需关注' : '正常范围内' }}
            </div>
          </div>
          
          <div class="stat-card vehicles">
            <div class="stat-header">
              <div class="stat-label">车辆状态</div>
              <el-icon class="icon"><Van /></el-icon>
            </div>
            <div class="stat-value">
              {{ projectData.activeVehicles }}/{{ projectData.totalVehicles }}
            </div>
            <div class="stat-info success-text">
              {{ ((projectData.activeVehicles / projectData.totalVehicles) * 100).toFixed(0) }}% 在线率
            </div>
          </div>
        </div>
        
        <!-- 仪表盘区域 -->
        <div class="gauge-grid">
          <div class="gauge-card efficiency">
            <h3 class="gauge-title">作业效率</h3>
            <div class="gauge-chart" ref="efficiencyGauge"></div>
            <div class="gauge-status" :style="efficiencyStatusStyle">
              {{ getEfficiencyStatus(projectData.efficiency) }}
            </div>
          </div>
          
          <div class="gauge-card success-rate">
            <h3 class="gauge-title">作业成功率</h3>
            <div class="gauge-chart" ref="successRateGauge"></div>
            <div class="gauge-status" :style="successRateStatusStyle">
              {{ getEfficiencyStatus(projectData.successRate) }}
            </div>
          </div>
        </div>
        
        <!-- 趋势图区域 -->
        <div class="trend-card">
          <h3 class="trend-title">今日作业趋势</h3>
          <div class="trend-chart" ref="operationsTrendChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { COLORS, getStatusColor } from '../../utils/colors';

export default {
  name: 'StatusOverview',
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
    trendData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const efficiencyGauge = ref(null);
    const successRateGauge = ref(null);
    const operationsTrendChart = ref(null);
    
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));
    
    const efficiencyStatusStyle = computed(() => ({
      backgroundColor: getStatusColor(props.projectData.efficiency, 'efficiency')
    }));
    
    const successRateStatusStyle = computed(() => ({
      backgroundColor: getStatusColor(props.projectData.successRate, 'successRate')
    }));
    
    // 初始化和更新图表
    watch(() => [props.expanded, props.projectData, props.trendData], () => {
      if (props.expanded) {
        setTimeout(() => {
          initGauges();
          initTrendChart();
        }, 0);
      }
    }, { immediate: true });
    
    // 获取效率状态文本
    const getEfficiencyStatus = (value) => {
      if (value >= 90) return '状态优良';
      if (value >= 75) return '状态正常';
      return '需要关注';
    };
    
    // 初始化仪表盘
    const initGauges = () => {
      if (!efficiencyGauge.value || !successRateGauge.value) return;
      
      const efficiencyEchart = window.echarts.init(efficiencyGauge.value);
      const successRateEchart = window.echarts.init(successRateGauge.value);
      
      // 效率仪表盘配置
      const efficiencyOption = {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          radius: '80%',
          center: ['50%', '60%'],
          progress: {
            show: true,
            width: 12
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, 'rgba(255, 255, 255, 0.1)']]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            offsetCenter: [0, 0],
            fontSize: 32,
            color: getStatusColor(props.projectData.efficiency, 'efficiency')
          },
          data: [{
            value: props.projectData.efficiency,
            name: '效率',
            itemStyle: {
              color: getStatusColor(props.projectData.efficiency, 'efficiency')
            }
          }]
        }]
      };
      
      // 成功率仪表盘配置
      const successRateOption = {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          radius: '80%',
          center: ['50%', '60%'],
          progress: {
            show: true,
            width: 12
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, 'rgba(255, 255, 255, 0.1)']]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            offsetCenter: [0, 0],
            fontSize: 32,
            color: getStatusColor(props.projectData.successRate, 'successRate')
          },
          data: [{
            value: props.projectData.successRate,
            name: '成功率',
            itemStyle: {
              color: getStatusColor(props.projectData.successRate, 'successRate')
            }
          }]
        }]
      };
      
      efficiencyEchart.setOption(efficiencyOption);
      successRateEchart.setOption(successRateOption);
    };
    
    // 初始化趋势图
    const initTrendChart = () => {
      if (!operationsTrendChart.value) return;
      
      const chart = window.echarts.init(operationsTrendChart.value);
      
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        xAxis: {
          type: 'category',
          data: props.trendData.map(item => item.time),
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          splitLine: {
            lineStyle: {
              color: COLORS.border,
              type: 'dashed'
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          }
        },
        series: [{
          data: props.trendData.map(item => item.operations),
          type: 'line',
          smooth: true,
          symbol: 'emptyCircle',
          lineStyle: {
            width: 3,
            color: COLORS.active
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(56, 178, 172, 0.3)' },
                { offset: 1, color: 'rgba(56, 178, 172, 0.05)' }
              ]
            }
          },
          name: '作业量'
        }]
      };
      
      chart.setOption(option);
    };
    
    return {
      COLORS,
      cardStyle,
      efficiencyGauge,
      successRateGauge,
      operationsTrendChart,
      efficiencyStatusStyle,
      successRateStatusStyle,
      getEfficiencyStatus
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

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  padding: 16px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  border-radius: 6px;
  padding: 16px;
  border-width: 1px;
  border-style: solid;
}

.stat-card.operations {
  background-color: rgba(56, 178, 172, 0.1);
  border-color: rgba(56, 178, 172, 0.3);
}

.stat-card.distance {
  background-color: rgba(237, 137, 54, 0.1);
  border-color: rgba(237, 137, 54, 0.3);
}

.stat-card.takeovers {
  background-color: rgba(229, 62, 62, 0.1);
  border-color: rgba(229, 62, 62, 0.3);
}

.stat-card.vehicles {
  background-color: rgba(56, 161, 105, 0.1);
  border-color: rgba(56, 161, 105, 0.3);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.icon {
  font-size: 18px;
}

.operations .icon {
  color: v-bind('COLORS.active');
}

.distance .icon {
  color: v-bind('COLORS.warning');
}

.takeovers .icon {
  color: v-bind('COLORS.danger');
}

.vehicles .icon {
  color: v-bind('COLORS.success');
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-info {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
  margin-top: 8px;
}

.operations .stat-info {
  color: v-bind('COLORS.active');
  display: flex;
  align-items: center;
}

.trend-icon {
  margin-right: 4px;
}

.warning-text {
  color: v-bind('COLORS.danger');
}

.success-text {
  color: v-bind('COLORS.success');
}

.gauge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.gauge-card {
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-style: solid;
}

.gauge-card.efficiency {
  background-color: rgba(66, 153, 225, 0.1);
  border-color: rgba(66, 153, 225, 0.3);
}

.gauge-card.success-rate {
  background-color: rgba(56, 161, 105, 0.1);
  border-color: rgba(56, 161, 105, 0.3);
}

.gauge-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
  align-self: flex-start;
}

.gauge-chart {
  width: 100%;
  height: 180px;
}

.gauge-status {
  margin-top: 8px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: white;
}

.trend-card {
  background-color: rgba(159, 122, 234, 0.1);
  border-radius: 6px;
  padding: 16px;
  border: 1px solid rgba(159, 122, 234, 0.3);
}

.trend-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
}

.trend-chart {
  width: 100%;
  height: 200px;
}
</style>
