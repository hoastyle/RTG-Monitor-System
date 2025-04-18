<template>
  <div class="project-comparison" :style="cardStyle">
    <div class="card-header" @click="$emit('toggleSection')">
      <h2 class="section-title">项目绩效汇总比对</h2>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <!-- 项目综合指标对比 -->
      <div class="comparison-section">
        <h3 class="sub-title">核心指标对比</h3>
        
        <div class="metrics-grid">
          <!-- 作业量对比 -->
          <div class="metric-card operations">
            <div class="metric-header">
              <div class="metric-label">总作业量</div>
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="metric-value">{{ totalOperations }} 箱</div>
            <div class="metric-comparison">
              <div class="comparison-item">
                <span class="comparison-label">最高:</span>
                <span>青岛港 ({{ realtimeData['青岛港项目'].operations }})</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">最低:</span>
                <span>宁波港 ({{ realtimeData['宁波港项目'].operations }})</span>
              </div>
            </div>
          </div>
          
          <!-- 效率对比 -->
          <div class="metric-card efficiency">
            <div class="metric-header">
              <div class="metric-label">平均效率</div>
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="metric-value">{{ averageEfficiency }}%</div>
            <div class="metric-comparison">
              <div class="comparison-item">
                <span class="comparison-label">最高:</span>
                <span class="success-text">宁波港 ({{ realtimeData['宁波港项目'].efficiency }}%)</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">最低:</span>
                <span class="danger-text">深圳港 ({{ realtimeData['深圳港项目'].efficiency }}%)</span>
              </div>
            </div>
          </div>
          
          <!-- 成功率对比 -->
          <div class="metric-card success-rate">
            <div class="metric-header">
              <div class="metric-label">平均成功率</div>
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="metric-value">{{ averageSuccessRate }}%</div>
            <div class="metric-comparison">
              <div class="comparison-item">
                <span class="comparison-label">最高:</span>
                <span class="success-text">宁波港 ({{ realtimeData['宁波港项目'].successRate }}%)</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">最低:</span>
                <span class="danger-text">深圳港 ({{ realtimeData['深圳港项目'].successRate }}%)</span>
              </div>
            </div>
          </div>
          
          <!-- 跳台统计对比 -->
          <div class="metric-card takeovers">
            <div class="metric-header">
              <div class="metric-label">总跳台次数</div>
              <el-icon><WarningFilled /></el-icon>
            </div>
            <div class="metric-value">{{ totalTakeovers }} 次</div>
            <div class="metric-comparison">
              <div class="comparison-item">
                <span class="comparison-label">最多:</span>
                <span class="danger-text">深圳港 ({{ realtimeData['深圳港项目'].takeovers }})</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">最少:</span>
                <span class="success-text">宁波港 ({{ realtimeData['宁波港项目'].takeovers }})</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 对比图表 -->
        <div class="charts-grid">
          <div class="chart-card efficiency-chart">
            <h3 class="chart-title">各项目效率与成功率对比</h3>
            <div class="chart-container" ref="efficiencyChart"></div>
          </div>
          
          <div class="chart-card takeovers-chart">
            <h3 class="chart-title">各项目跳台与作业量对比</h3>
            <div class="chart-container" ref="takeoverOperationsChart"></div>
          </div>
        </div>
      </div>
      
      <!-- 项目状态汇总表格 -->
      <div class="summary-section">
        <h3 class="sub-title">项目状态汇总</h3>
        <div class="summary-table">
          <table>
            <thead>
              <tr>
                <th>项目名称</th>
                <th>版本</th>
                <th>作业量</th>
                <th>效率</th>
                <th>成功率</th>
                <th>跳台次数</th>
                <th>车辆状态</th>
                <th>整体状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id">
                <td class="project-name">
                  {{ project.name }}
                  <span 
                    class="status-indicator" 
                    :style="{ 
                      backgroundColor: getProjectStatusColor(realtimeData[project.name].efficiency) 
                    }"
                  ></span>
                </td>
                <td>{{ project.version }}</td>
                <td>{{ realtimeData[project.name].operations }}</td>
                <td :style="{ color: getStatusColor(realtimeData[project.name].efficiency, 'efficiency') }">
                  {{ realtimeData[project.name].efficiency }}%
                </td>
                <td :style="{ color: getStatusColor(realtimeData[project.name].successRate, 'successRate') }">
                  {{ realtimeData[project.name].successRate }}%
                </td>
                <td :style="{ 
                  color: realtimeData[project.name].takeovers > 20 ? COLORS.danger : 
                         realtimeData[project.name].takeovers > 15 ? COLORS.warning : COLORS.text 
                }">
                  {{ realtimeData[project.name].takeovers }}
                </td>
                <td>
                  <div class="vehicle-status">
                    <span>{{ realtimeData[project.name].activeVehicles }}/{{ realtimeData[project.name].totalVehicles }}</span>
                    <span class="online-rate">
                      {{ ((realtimeData[project.name].activeVehicles / realtimeData[project.name].totalVehicles) * 100).toFixed(0) }}%
                    </span>
                  </div>
                </td>
                <td>
                  <div 
                    class="status-tag" 
                    :class="getProjectStatusClass(realtimeData[project.name].efficiency)"
                  >
                    <el-icon v-if="realtimeData[project.name].efficiency >= 90"><Check /></el-icon>
                    <el-icon v-else-if="realtimeData[project.name].efficiency >= 75"><Warning /></el-icon>
                    <el-icon v-else><CircleClose /></el-icon>
                    <span>{{ getProjectStatusText(realtimeData[project.name].efficiency) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { COLORS, getStatusColor } from '../../utils/colors';

export default {
  name: 'ProjectComparison',
  props: {
    expanded: {
      type: Boolean,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    realtimeData: {
      type: Object,
      required: true
    },
    projectComparisonData: {
      type: Array,
      required: true
    },
    efficiencyBarData: {
      type: Array,
      required: true
    },
    projectScatterData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const efficiencyChart = ref(null);
    const takeoverOperationsChart = ref(null);
    
    // 卡片样式
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));
    
    // 计算总作业量
    const totalOperations = computed(() => {
      return Object.values(props.realtimeData).reduce((sum, data) => sum + data.operations, 0);
    });
    
    // 计算平均效率
    const averageEfficiency = computed(() => {
      return (Object.values(props.realtimeData).reduce((sum, data) => sum + data.efficiency, 0) / props.projects.length).toFixed(1);
    });
    
    // 计算平均成功率
    const averageSuccessRate = computed(() => {
      return (Object.values(props.realtimeData).reduce((sum, data) => sum + data.successRate, 0) / props.projects.length).toFixed(1);
    });
    
    // 计算总跳台次数
    const totalTakeovers = computed(() => {
      return Object.values(props.realtimeData).reduce((sum, data) => sum + data.takeovers, 0);
    });
    
    // 获取项目状态颜色
    const getProjectStatusColor = (efficiency) => {
      if (efficiency >= 90) return COLORS.success;
      if (efficiency >= 75) return COLORS.warning;
      return COLORS.danger;
    };
    
    // 获取项目状态类名
    const getProjectStatusClass = (efficiency) => {
      if (efficiency >= 90) return 'success';
      if (efficiency >= 75) return 'warning';
      return 'danger';
    };
    
    // 获取项目状态文本
    const getProjectStatusText = (efficiency) => {
      if (efficiency >= 90) return '状态优良';
      if (efficiency >= 75) return '状态正常';
      return '需要关注';
    };
    
    // 初始化效率对比图表
    const initEfficiencyChart = () => {
      if (!efficiencyChart.value) return;
      
      const chart = window.echarts.init(efficiencyChart.value);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        legend: {
          data: ['效率 (%)', '成功率 (%)'],
          textStyle: {
            color: COLORS.text
          },
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.efficiencyBarData.map(item => item.name),
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
          min: 0,
          max: 100,
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
        series: [
          {
            name: '效率 (%)',
            type: 'bar',
            data: props.efficiencyBarData.map(item => ({
              value: item.efficiency,
              itemStyle: {
                color: getStatusColor(item.efficiency, 'efficiency')
              }
            }))
          },
          {
            name: '成功率 (%)',
            type: 'bar',
            data: props.efficiencyBarData.map(item => ({
              value: item.successRate,
              itemStyle: {
                color: getStatusColor(item.successRate, 'successRate')
              }
            }))
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 初始化跳台与作业量对比图表
    const initTakeoverOperationsChart = () => {
      if (!takeoverOperationsChart.value) return;
      
      const chart = window.echarts.init(takeoverOperationsChart.value);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        legend: {
          data: ['跳台次数', '作业量'],
          textStyle: {
            color: COLORS.text
          },
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.projectComparisonData.map(item => item.name),
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '跳台次数',
            min: 0,
            max: 50,
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
          {
            type: 'value',
            name: '作业量',
            min: 0,
            max: 500,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: COLORS.border
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: COLORS.textSecondary
            }
          }
        ],
        series: [
          {
            name: '跳台次数',
            type: 'bar',
            data: props.projectComparisonData.map(item => ({
              value: item.takeovers,
              itemStyle: {
                color: COLORS.danger
              }
            }))
          },
          {
            name: '作业量',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3
            },
            itemStyle: {
              color: COLORS.active
            },
            data: props.projectComparisonData.map(item => item.operations)
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 监听展开状态变化，初始化图表
    watch(() => props.expanded, (isExpanded) => {
      if (isExpanded) {
        setTimeout(() => {
          initEfficiencyChart();
          initTakeoverOperationsChart();
        }, 0);
      }
    }, { immediate: true });
    
    return {
      COLORS,
      cardStyle,
      efficiencyChart,
      takeoverOperationsChart,
      totalOperations,
      averageEfficiency,
      averageSuccessRate,
      totalTakeovers,
      getStatusColor,
      getProjectStatusColor,
      getProjectStatusClass,
      getProjectStatusText
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

.comparison-section {
  margin-bottom: 24px;
}

.sub-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.metric-card {
  border-radius: 6px;
  padding: 16px;
  border-width: 1px;
  border-style: solid;
}

.metric-card.operations {
  background-color: rgba(56, 178, 172, 0.1);
  border-color: rgba(56, 178, 172, 0.3);
}

.metric-card.efficiency {
  background-color: rgba(66, 153, 225, 0.1);
  border-color: rgba(66, 153, 225, 0.3);
}

.metric-card.success-rate {
  background-color: rgba(56, 161, 105, 0.1);
  border-color: rgba(56, 161, 105, 0.3);
}

.metric-card.takeovers {
  background-color: rgba(229, 62, 62, 0.1);
  border-color: rgba(229, 62, 62, 0.3);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.operations .metric-header .el-icon {
  color: v-bind('COLORS.active');
}

.efficiency .metric-header .el-icon {
  color: #4299e1;
}

.success-rate .metric-header .el-icon {
  color: v-bind('COLORS.success');
}

.takeovers .metric-header .el-icon {
  color: v-bind('COLORS.danger');
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
}

.metric-comparison {
  margin-top: 10px;
}

.comparison-item {
  font-size: 12px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.comparison-item:last-child {
  margin-bottom: 0;
}

.comparison-label {
  color: v-bind('COLORS.textSecondary');
}

.success-text {
  color: v-bind('COLORS.success');
}

.danger-text {
  color: v-bind('COLORS.danger');
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background-color: rgba(26, 32, 44, 0.3);
  border-radius: 6px;
  padding: 16px;
  border: 1px solid v-bind('COLORS.border');
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.chart-container {
  height: 250px;
}

.summary-table {
  background-color: rgba(26, 32, 44, 0.3);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid v-bind('COLORS.border');
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 8px;
  text-align: left;
}

th {
  color: v-bind('COLORS.textSecondary');
  font-size: 14px;
  font-weight: normal;
  border-bottom: 1px solid v-bind('COLORS.border');
}

td {
  border-bottom: 1px solid v-bind('COLORS.border');
}

tr:last-child td {
  border-bottom: none;
}

.project-name {
  position: relative;
  font-weight: 500;
  padding-left: 16px;
}

.status-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 4px;
  height: 70%;
  border-radius: 0 2px 2px 0;
}

.vehicle-status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.online-rate {
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 6px;
  background-color: rgba(56, 161, 105, 0.1);
  color: v-bind('COLORS.success');
  border-radius: 4px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.success {
  background-color: rgba(56, 161, 105, 0.1);
  color: v-bind('COLORS.success');
}

.status-tag.warning {
  background-color: rgba(237, 137, 54, 0.1);
  color: v-bind('COLORS.warning');
}

.status-tag.danger {
  background-color: rgba(229, 62, 62, 0.1);
  color: v-bind('COLORS.danger');
}

.status-tag .el-icon {
  margin-right: 4px;
}
</style>
