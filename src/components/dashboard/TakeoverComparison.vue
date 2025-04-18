<template>
  <div class="takeover-comparison" :style="cardStyle">
    <div 
      class="card-header" 
      :style="{ backgroundColor: 'rgba(229, 62, 62, 0.1)' }"
      @click="$emit('toggleSection')"
    >
      <div class="header-content">
        <h2 class="section-title">各项目人工跳台分析</h2>
        <div class="alert-badge">
          <el-icon><WarningFilled /></el-icon>
          <span>共 {{ totalTakeovers }} 次跳台</span>
        </div>
      </div>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <div class="analysis-grid">
        <!-- 跳台与成功率关系散点图 -->
        <div class="chart-card">
          <h3 class="chart-title">跳台与成功率关系分析</h3>
          <div class="chart-container" ref="scatterChart"></div>
          <div class="chart-analysis">
            <p>观察结果: 跳台次数与成功率呈现明显的负相关关系。跳台次数越多，成功率越低，影响作业质量。</p>
          </div>
        </div>
        
        <!-- 系统版本与性能关系分析 -->
        <div class="chart-card">
          <h3 class="chart-title">系统版本与性能关系分析</h3>
          <div class="chart-container" ref="versionChart"></div>
          <div class="chart-analysis">
            <p>观察结果: v2.3.x版本系统明显优于旧版本，成功率提高15-20%，跳台次数减少约50%。建议全面升级至v2.3.1。</p>
          </div>
        </div>
      </div>
      
      <!-- 跳台原因分析 -->
      <div class="chart-card reasons-chart">
        <h3 class="chart-title">各项目跳台原因分布</h3>
        <div class="chart-container" ref="reasonsChart"></div>
      </div>
      
      <!-- 解决方案建议 -->
      <div class="solutions-card">
        <h3 class="solutions-title">
          <el-icon><Lightning /></el-icon>
          <span>优化建议与解决方案</span>
        </h3>
        <div class="solutions-grid">
          <div class="solution-section">
            <div class="section-header">高优先级问题</div>
            <ul class="problem-list">
              <li>
                <span class="problem-name">传感器故障 (共27次):</span>
                <div class="problem-suggestion">
                  建议升级至V2+传感器，优化环境适应算法，特别针对深圳港(12次)和青岛港(7次)项目
                </div>
              </li>
              <li>
                <span class="problem-name">定位异常 (共24次):</span>
                <div class="problem-suggestion">
                  增加辅助定位系统，优化三角测量算法，优先解决深圳港(10次)和青岛港(9次)问题
                </div>
              </li>
            </ul>
          </div>
          <div class="solution-section">
            <div class="section-header">系统升级计划</div>
            <ul class="problem-list">
              <li>
                <span class="problem-name">紧急升级:</span>
                <div class="problem-suggestion">
                  深圳港项目迁移至v2.3.1版本 (预计可降低跳台次数60%，提升成功率25%)
                </div>
              </li>
              <li>
                <span class="problem-name">常规升级:</span>
                <div class="problem-suggestion">
                  青岛港项目升级至v2.3.1，并安排所有项目季度传感器校准与更新
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { COLORS } from '../../utils/colors';

export default {
  name: 'TakeoverComparison',
  props: {
    expanded: {
      type: Boolean,
      required: true
    },
    realtimeData: {
      type: Object,
      required: true
    },
    takeoverData: {
      type: Object,
      required: true
    },
    projectComparisonData: {
      type: Array,
      required: true
    },
    projectScatterData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const scatterChart = ref(null);
    const versionChart = ref(null);
    const reasonsChart = ref(null);
    
    // 卡片样式
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));
    
    // 计算总跳台次数
    const totalTakeovers = computed(() => {
      return Object.values(props.realtimeData).reduce((sum, data) => sum + data.takeovers, 0);
    });
    
    // 初始化跳台与成功率关系图表
    const initScatterChart = () => {
      if (!scatterChart.value) return;
      
      const chart = window.echarts.init(scatterChart.value);
      
      const option = {
        grid: {
          left: '10%',
          right: '5%',
          bottom: '15%',
          top: '10%'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.seriesName + '<br/>' +
                   params.name + '<br/>' +
                   '跳台次数: ' + params.value[0] + '<br/>' +
                   '成功率: ' + params.value[1] + '%';
          },
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        xAxis: {
          type: 'value',
          name: '跳台次数',
          nameLocation: 'middle',
          nameGap: 30,
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          },
          splitLine: {
            lineStyle: {
              color: COLORS.border,
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '成功率 (%)',
          min: 70,
          max: 100,
          nameLocation: 'middle',
          nameGap: 30,
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          },
          splitLine: {
            lineStyle: {
              color: COLORS.border,
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '项目指标',
            type: 'scatter',
            symbolSize: 18,
            data: props.projectComparisonData.map(item => ({
              name: item.name,
              value: [item.takeovers, item.successRate]
            })),
            itemStyle: {
              color: function(params) {
                const value = params.data.value[1]; // 成功率
                if (value >= 90) return COLORS.success;
                if (value >= 75) return COLORS.warning;
                return COLORS.danger;
              }
            },
            label: {
              show: true,
              position: 'right',
              formatter: function(params) {
                return params.name;
              },
              color: COLORS.text
            }
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 初始化系统版本与性能关系图表
    const initVersionChart = () => {
      if (!versionChart.value) return;
      
      const chart = window.echarts.init(versionChart.value);
      
      const option = {
        grid: {
          left: '10%',
          right: '15%',
          bottom: '15%',
          top: '10%'
        },
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
          data: ['成功率', '跳台次数'],
          textStyle: {
            color: COLORS.text
          },
          top: 10,
          right: 0
        },
        xAxis: {
          type: 'category',
          data: props.projectScatterData.map(item => item.version),
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
            name: '成功率 (%)',
            min: 70,
            max: 100,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: COLORS.success
              }
            },
            axisLabel: {
              color: COLORS.textSecondary
            },
            splitLine: {
              lineStyle: {
                color: COLORS.border,
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: '跳台次数',
            min: 0,
            max: 40,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: COLORS.danger
              }
            },
            axisLabel: {
              color: COLORS.textSecondary
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '成功率',
            type: 'scatter',
            yAxisIndex: 0,
            symbolSize: 16,
            data: props.projectScatterData.map(item => ({
              name: item.name,
              value: [item.version, item.successRate],
              itemStyle: {
                color: COLORS.success
              }
            }))
          },
          {
            name: '跳台次数',
            type: 'scatter',
            yAxisIndex: 1,
            symbolSize: 16,
            symbol: 'diamond',
            data: props.projectScatterData.map(item => ({
              name: item.name,
              value: [item.version, item.takeovers],
              itemStyle: {
                color: COLORS.danger
              }
            }))
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 初始化跳台原因分布图表
    const initReasonsChart = () => {
      if (!reasonsChart.value) return;
      
      const chart = window.echarts.init(reasonsChart.value);
      
      // 准备跳台原因数据
      const projects = Object.keys(props.takeoverData);
      const reasons = ['传感器故障', '定位异常', '集装箱识别错误', '路径规划失败', '其他故障'];
      
      const series = projects.map(project => {
        return {
          name: project,
          type: 'bar',
          stack: 'total',
          data: reasons.map(reason => {
            const reasonData = props.takeoverData[project].find(item => item.reason === reason);
            return reasonData ? reasonData.count : 0;
          })
        };
      });
      
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
          data: projects,
          textStyle: {
            color: COLORS.text
          },
          top: 10
        },
        grid: {
          left: '10%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: reasons,
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary,
            interval: 0,
            rotate: 30
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
        series: series,
        color: COLORS.chartColors
      };
      
      chart.setOption(option);
    };
    
    // 监听展开状态变化，初始化图表
    watch(() => props.expanded, (isExpanded) => {
      if (isExpanded) {
        setTimeout(() => {
          initScatterChart();
          initVersionChart();
          initReasonsChart();
        }, 0);
      }
    }, { immediate: true });
    
    return {
      COLORS,
      cardStyle,
      scatterChart,
      versionChart,
      reasonsChart,
      totalTakeovers
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
  margin-bottom: 20px;
}

.chart-card {
  background-color: rgba(26, 32, 44, 0.3);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid v-bind('COLORS.border');
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
}

.chart-container {
  height: 300px;
}

.chart-analysis {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(66, 153, 225, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(66, 153, 225, 0.3);
  font-size: 14px;
}

.chart-analysis p {
  margin: 0;
}

.reasons-chart {
  margin-bottom: 20px;
}

.solutions-card {
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(56, 161, 105, 0.3);
}

.solutions-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.solutions-title .el-icon {
  color: v-bind('COLORS.success');
  margin-right: 8px;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.solution-section {
  background-color: rgba(26, 32, 44, 0.3);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid v-bind('COLORS.border');
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.solution-section:first-child .section-header {
  color: v-bind('COLORS.danger');
}

.solution-section:last-child .section-header {
  color: v-bind('COLORS.success');
}

.problem-list {
  margin: 0;
  padding-left: 20px;
}

.problem-list li {
  margin-bottom: 8px;
}

.problem-list li:last-child {
  margin-bottom: 0;
}

.problem-name {
  font-weight: 500;
}

.problem-suggestion {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
  margin-top: 4px;
}
</style>
