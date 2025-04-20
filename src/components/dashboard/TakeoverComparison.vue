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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
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
  emits: ['toggleSection'],
  setup(props) {
    const scatterChart = ref(null);
    const versionChart = ref(null);
    const reasonsChart = ref(null);

    // 图表实例
    let scatterChartInstance = null;
    let versionChartInstance = null;
    let reasonsChartInstance = null;

    // ResizeObserver 实例
    let scatterResizeObserver = null;
    let versionResizeObserver = null;
    let reasonsResizeObserver = null;

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

      // 清理旧实例
      if (scatterChartInstance) {
        scatterChartInstance.dispose();
      }

      // 创建新实例
      scatterChartInstance = window.echarts.init(scatterChart.value, null, {
        renderer: 'canvas'
      });

      const option = {
        grid: {
          left: '10%',
          right: '5%',
          bottom: '15%',
          top: '10%'
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          },
          formatter: function(params) {
            return params.name + '<br/>跳台次数: ' + params.value[0] + '<br/>成功率: ' + params.value[1] + '%';
          }
        },
        xAxis: {
          type: 'value',
          name: '跳台次数',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            color: COLORS.textSecondary,
            fontSize: 12,
            fontWeight: 'normal'
          },
          min: 0,
          max: Math.max(...props.projectComparisonData.map(item => item.takeovers)) + 5,
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary,
            fontSize: 12
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
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            color: COLORS.textSecondary,
            fontSize: 12,
            fontWeight: 'normal'
          },
          min: 70,
          max: 100,
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary,
            fontSize: 12
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
            symbolSize: 20,
            data: props.projectComparisonData.map(item => ({
              name: item.name,
              value: [item.takeovers, item.successRate],
              itemStyle: {
                color: (params) => {
                  const value = params.data.value[1]; // 成功率
                  if (value >= 90) return COLORS.success;
                  if (value >= 75) return COLORS.warning;
                  return COLORS.danger;
                },
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            })),
            label: {
              show: true,
              position: 'right',
              color: COLORS.text,
              fontSize: 12,
              formatter: (params) => params.name
            },
            emphasis: {
              scale: true,
              focus: 'self',
              label: {
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 20,
                borderWidth: 2,
                borderColor: '#fff'
              }
            },
            animation: true,
            animationDuration: 1000,
            animationEasing: 'elasticOut'
          }
        ]
      };

      scatterChartInstance.setOption(option);

      // 添加回归线
      const takeovers = props.projectComparisonData.map(item => item.takeovers);
      const successRates = props.projectComparisonData.map(item => item.successRate);

      // 简单线性回归
      const n = takeovers.length;
      const sumX = takeovers.reduce((a, b) => a + b, 0);
      const sumY = successRates.reduce((a, b) => a + b, 0);
      const sumXY = takeovers.reduce((a, b, i) => a + b * successRates[i], 0);
      const sumX2 = takeovers.reduce((a, b) => a + b * b, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // 添加回归线
      const minX = Math.min(...takeovers);
      const maxX = Math.max(...takeovers);

      scatterChartInstance.setOption({
        series: [
          {
            name: '趋势线',
            type: 'line',
            showSymbol: false,
            data: [
              [minX, intercept + slope * minX],
              [maxX, intercept + slope * maxX]
            ],
            lineStyle: {
              color: '#fff',
              width: 2,
              type: 'dashed',
              opacity: 0.5
            },
            smooth: true,
            emphasis: {
              lineStyle: {
                width: 3,
                opacity: 0.8
              }
            },
            animation: true,
            animationDuration: 2000,
            animationDelay: 1000
          }
        ]
      });
    };

    // 初始化系统版本与性能关系图表
    const initVersionChart = () => {
      if (!versionChart.value) return;

      // 清理旧实例
      if (versionChartInstance) {
        versionChartInstance.dispose();
      }

      // 创建新实例
      versionChartInstance = window.echarts.init(versionChart.value, null, {
        renderer: 'canvas'
      });

      // 按版本分组数据
      const groupedData = {};
      props.projectScatterData.forEach(item => {
        if (!groupedData[item.version]) {
          groupedData[item.version] = [];
        }
        groupedData[item.version].push(item);
      });

      // 计算每个版本的平均值
      const versionsData = Object.keys(groupedData).map(version => {
        const items = groupedData[version];
        const avgSuccessRate = items.reduce((sum, item) => sum + item.successRate, 0) / items.length;
        const avgTakeovers = items.reduce((sum, item) => sum + item.takeovers, 0) / items.length;
        return {
          version: version,
          successRate: avgSuccessRate,
          takeovers: avgTakeovers,
          projects: items.map(i => i.name).join(', ')
        };
      });

      // 根据版本号排序
      versionsData.sort((a, b) => {
        const versionA = a.version.replace('v', '').split('.').map(Number);
        const versionB = b.version.replace('v', '').split('.').map(Number);

        for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
          const numA = i < versionA.length ? versionA[i] : 0;
          const numB = i < versionB.length ? versionB[i] : 0;
          if (numA !== numB) {
            return numA - numB;
          }
        }
        return 0;
      });

      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          },
          formatter: function(params) {
            const version = params[0].axisValue;
            const versionData = versionsData.find(v => v.version === version);
            let result = version + '<br/>';

            params.forEach(item => {
              let colorSpan = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>`;
              let value = item.seriesName === '成功率' ? item.value + '%' : item.value + ' 次';
              result += colorSpan + item.seriesName + ': ' + value + '<br/>';
            });

            result += '<br/>包含项目: ' + versionData.projects;
            return result;
          }
        },
        legend: {
          data: ['成功率', '跳台次数'],
          textStyle: {
            color: COLORS.text
          },
          top: 10,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: versionsData.map(item => item.version),
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary,
            fontSize: 12,
            interval: 0,
            rotate: versionsData.length > 3 ? 30 : 0
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '成功率 (%)',
            min: 70,
            max: 100,
            position: 'left',
            nameTextStyle: {
              color: COLORS.textSecondary,
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: COLORS.success
              }
            },
            splitLine: {
              lineStyle: {
                color: COLORS.border,
                type: 'dashed'
              }
            },
            axisLabel: {
              color: COLORS.textSecondary,
              fontSize: 12
            }
          },
          {
            type: 'value',
            name: '跳台次数',
            min: 0,
            max: Math.max(...versionsData.map(v => v.takeovers)) + 5,
            position: 'right',
            nameTextStyle: {
              color: COLORS.textSecondary,
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: COLORS.danger
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: COLORS.textSecondary,
              fontSize: 12
            }
          }
        ],
        series: [
          {
            name: '成功率',
            type: 'scatter',
            yAxisIndex: 0,
            symbolSize: 18,
            emphasis: {
              scale: true,
              focus: 'self'
            },
            itemStyle: {
              color: COLORS.success,
              borderColor: COLORS.text,
              borderWidth: 1
            },
            data: versionsData.map(item => item.successRate),
            markLine: {
              symbol: 'none',
              lineStyle: {
                color: COLORS.success,
                type: 'dashed',
                width: 1
              },
              data: [
                {
                  type: 'average',
                  name: '平均成功率',
                  label: {
                    color: COLORS.success,
                    position: 'end',
                    fontSize: 12
                  }
                }
              ]
            },
            animation: true,
            animationDuration: 1000
          },
          {
            name: '跳台次数',
            type: 'scatter',
            yAxisIndex: 1,
            symbolSize: 18,
            emphasis: {
              scale: true,
              focus: 'self'
            },
            itemStyle: {
              color: COLORS.danger,
              borderColor: COLORS.text,
              borderWidth: 1
            },
            data: versionsData.map(item => item.takeovers),
            markLine: {
              symbol: 'none',
              lineStyle: {
                color: COLORS.danger,
                type: 'dashed',
                width: 1
              },
              data: [
                {
                  type: 'average',
                  name: '平均跳台次数',
                  label: {
                    color: COLORS.danger,
                    position: 'end',
                    fontSize: 12
                  }
                }
              ]
            },
            animation: true,
            animationDuration: 1000,
            animationDelay: 300
          }
        ]
      };

      versionChartInstance.setOption(option);

      // 添加连接线
      versionChartInstance.setOption({
        series: [
          {
            name: '成功率趋势',
            type: 'line',
            yAxisIndex: 0,
            data: versionsData.map(item => item.successRate),
            showSymbol: false,
            symbolSize: 0,
            lineStyle: {
              color: COLORS.success,
              width: 2
            },
            smooth: true,
            z: -1,
            animation: true,
            animationDuration: 1500,
            animationDelay: 800
          },
          {
            name: '跳台趋势',
            type: 'line',
            yAxisIndex: 1,
            data: versionsData.map(item => item.takeovers),
            showSymbol: false,
            symbolSize: 0,
            lineStyle: {
              color: COLORS.danger,
              width: 2
            },
            smooth: true,
            z: -1,
            animation: true,
            animationDuration: 1500,
            animationDelay: 1100
          }
        ]
      });
    };

    // 初始化跳台原因分布图表
    const initReasonsChart = () => {
      if (!reasonsChart.value) return;

      // 清理旧实例
      if (reasonsChartInstance) {
        reasonsChartInstance.dispose();
      }

      // 创建新实例
      reasonsChartInstance = window.echarts.init(reasonsChart.value, null, {
        renderer: 'canvas'
      });

      // 准备跳台原因数据
      const projects = Object.keys(props.takeoverData);

      // 所有可能的原因分类
      const allReasons = new Set();
      Object.values(props.takeoverData).forEach(projectData => {
        projectData.forEach(item => {
          allReasons.add(item.reason);
        });
      });
      const reasons = Array.from(allReasons);

      // 为每个项目创建数据
      const series = projects.map(project => {
        const projectData = props.takeoverData[project];

        return {
          name: project,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: reasons.map(reason => {
            const reasonData = projectData.find(item => item.reason === reason);
            return reasonData ? reasonData.count : 0;
          }),
          animation: true,
          animationDuration: 1000,
          animationEasing: 'elasticOut',
          animationDelay: (idx) => idx * 100
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
          top: 10,
          icon: 'roundRect',
          itemWidth: 14,
          itemHeight: 8
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '15%',
          top: '20%',
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
            fontSize: 12,
            interval: 0,
            rotate: 30,
            width: 80,
            overflow: 'break'
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
            color: COLORS.textSecondary,
            fontSize: 12
          }
        },
        series: series,
        color: COLORS.chartColors
      };

      reasonsChartInstance.setOption(option);
    };

    // 处理窗口大小变化
    const handleResize = () => {
      if (scatterChartInstance) {
        scatterChartInstance.resize();
      }

      if (versionChartInstance) {
        versionChartInstance.resize();
      }

      if (reasonsChartInstance) {
        reasonsChartInstance.resize();
      }
    };

    // 监听展开状态变化，初始化图表
    watch(() => props.expanded, (isExpanded) => {
      if (isExpanded) {
        nextTick(() => {
          initScatterChart();
          initVersionChart();
          initReasonsChart();
        });
      }
    }, { immediate: true });

    // 组件挂载后设置resize监听
    onMounted(() => {
      if (window.ResizeObserver) {
        // 散点图
        if (scatterChart.value) {
          scatterResizeObserver = new ResizeObserver(handleResize);
          scatterResizeObserver.observe(scatterChart.value);
        }

        // 版本关系图
        if (versionChart.value) {
          versionResizeObserver = new ResizeObserver(handleResize);
          versionResizeObserver.observe(versionChart.value);
        }

        // 原因分布图
        if (reasonsChart.value) {
          reasonsResizeObserver = new ResizeObserver(handleResize);
          reasonsResizeObserver.observe(reasonsChart.value);
        }
      }

      // 同时监听窗口大小变化
      window.addEventListener('resize', handleResize);
    });

    // 组件卸载前清理
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);

      if (scatterResizeObserver) {
        scatterResizeObserver.disconnect();
      }

      if (versionResizeObserver) {
        versionResizeObserver.disconnect();
      }

      if (reasonsResizeObserver) {
        reasonsResizeObserver.disconnect();
      }

      if (scatterChartInstance) {
        scatterChartInstance.dispose();
        scatterChartInstance = null;
      }

      if (versionChartInstance) {
        versionChartInstance.dispose();
        versionChartInstance = null;
      }

      if (reasonsChartInstance) {
        reasonsChartInstance.dispose();
        reasonsChartInstance = null;
      }
    });

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
  transition: background-color 0.3s ease;
}

.card-header:hover {
  background-color: rgba(229, 62, 62, 0.15);
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
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
  position: relative;
  padding-left: 12px;
}

.chart-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: v-bind('COLORS.active');
  border-radius: 2px;
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
  line-height: 1.6;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.solutions-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.solutions-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: v-bind('COLORS.success');
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
  padding: 16px;
  border: 1px solid v-bind('COLORS.border');
  transition: transform 0.3s ease;
}

.solution-section:hover {
  transform: translateY(-2px);
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  position: relative;
  padding-left: 12px;
}

.section-header::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  border-radius: 2px;
}

.solution-section:first-child .section-header {
  color: v-bind('COLORS.danger');
}

.solution-section:first-child .section-header::before {
  background-color: v-bind('COLORS.danger');
}

.solution-section:last-child .section-header {
  color: v-bind('COLORS.success');
}

.solution-section:last-child .section-header::before {
  background-color: v-bind('COLORS.success');
}

.problem-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: none;
}

.problem-list li {
  margin-bottom: 16px;
  position: relative;
  padding-left: 8px;
}

.problem-list li:last-child {
  margin-bottom: 0;
}

.problem-list li::before {
  content: "•";
  position: absolute;
  left: -12px;
  font-size: 18px;
  color: v-bind('COLORS.textSecondary');
}

.problem-name {
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.problem-suggestion {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
  line-height: 1.6;
  padding-left: 8px;
  border-left: 2px solid rgba(58, 66, 86, 0.5);
  transition: border-color 0.3s ease;
}

.solution-section:hover .problem-suggestion {
  border-left-color: v-bind('COLORS.active');
}

@media (max-width: 768px) {
  .analysis-grid,
  .solutions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
