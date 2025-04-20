<template>
  <div class="efficiency-trend" :style="cardStyle">
    <div class="card-header" @click="$emit('toggleSection')">
      <h2 class="section-title">{{ selectedProject }} - 效率、成功率与跳台关联分析</h2>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>

    <div v-if="expanded" class="card-content">
      <!-- Added explicit inline height to ensure proper rendering -->
      <div class="trend-chart" ref="trendChart" style="width: 100%; height: 400px;"></div>

      <div class="trend-analysis">
        <div class="analysis-title">效率与成功率分析:</div>
        <div class="analysis-content">
          <template v-if="projectData.efficiency >= 90 && projectData.successRate >= 90">
            {{ selectedProject }}的效率和成功率均表现优秀，效率{{ projectData.efficiency }}%，成功率{{ projectData.successRate }}%，远高于行业平均水平。
          </template>
          <template v-else-if="projectData.efficiency >= 75 && projectData.successRate >= 75">
            {{ selectedProject }}的效率和成功率均处于正常范围，效率{{ projectData.efficiency }}%，成功率{{ projectData.successRate }}%，接近行业平均水平。
          </template>
          <template v-else>
            {{ selectedProject }}的效率和成功率表现欠佳，效率{{ projectData.efficiency }}%，成功率{{ projectData.successRate }}%，低于行业平均水平，需要重点关注。
          </template>
        </div>
        <div class="analysis-content">
          <template v-if="projectData.takeovers > 20">
            高频率的人工跳台（{{ projectData.takeovers }}次）对效率和成功率产生了明显的负面影响，建议优先解决高优先级跳台问题以提升整体性能。
          </template>
          <template v-else>
            人工跳台次数（{{ projectData.takeovers }}次）在可接受范围内，对整体效率和成功率影响有限。
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { COLORS } from '../../utils/colors';

export default {
  name: 'EfficiencyTrend',
  props: {
    expanded: {
      type: Boolean,
      required: true
    },
    selectedProject: {
      type: String,
      required: true
    },
    trendData: {
      type: Array,
      required: true
    },
    projectData: {
      type: Object,
      required: true
    }
  },
  emits: ['toggleSection'],
  setup(props) {
    const trendChart = ref(null);
    let chartInstance = null;
    let resizeObserver = null;
    let chartInitialized = ref(false);

    // 卡片样式
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));

    // 初始化趋势图
    const initTrendChart = () => {
      if (!trendChart.value) return;

      // Clear old instance
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }

      // 使用setTimeout确保DOM已完全渲染
      setTimeout(() => {
        // Create new instance
        chartInstance = window.echarts.init(trendChart.value, null, {
          renderer: 'canvas'
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
              let result = params[0].name + '<br/>';
              params.forEach(item => {
                let colorSpan = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>`;
                let value = item.seriesName === '跳台次数' ? item.value : item.value + '%';
                result += colorSpan + item.seriesName + ': ' + value + '<br/>';
              });
              return result;
            }
          },
          legend: {
            data: ['效率 (%)', '成功率 (%)', '跳台次数'],
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
            left: '3%',
            right: '5%',
            bottom: '3%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: props.trendData.map(item => item.time),
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: COLORS.border
              }
            },
            axisLabel: {
              color: COLORS.textSecondary,
              fontSize: 12
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '百分比',
              min: 50,
              max: 100,
              nameTextStyle: {
                color: COLORS.textSecondary,
                fontSize: 12
              },
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
                fontSize: 12,
                formatter: '{value}%'
              }
            },
            {
              type: 'value',
              name: '次数',
              min: 0,
              max: 10,
              position: 'right',
              nameTextStyle: {
                color: COLORS.textSecondary,
                fontSize: 12
              },
              axisLine: {
                lineStyle: {
                  color: COLORS.border
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
              name: '效率 (%)',
              type: 'line',
              yAxisIndex: 0,
              data: props.trendData.map(item => item.efficiency),
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              showSymbol: true,
              label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                fontSize: 12,
                color: COLORS.textSecondary,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 3,
                padding: [2, 4],
                distance: 8
              },
              lineStyle: {
                width: 3,
                color: COLORS.active
              },
              itemStyle: {
                color: COLORS.active,
                borderWidth: 2
              }
            },
            {
              name: '成功率 (%)',
              type: 'line',
              yAxisIndex: 0,
              data: props.trendData.map(item => item.successRate),
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              showSymbol: true,
              label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                fontSize: 12,
                color: COLORS.textSecondary,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 3,
                padding: [2, 4],
                distance: 8
              },
              lineStyle: {
                width: 3,
                color: COLORS.success
              },
              itemStyle: {
                color: COLORS.success,
                borderWidth: 2
              }
            },
            {
              name: '跳台次数',
              type: 'bar',
              yAxisIndex: 1,
              data: props.trendData.map(item => item.takeovers),
              barWidth: 10,
              barCategoryGap: '40%',
              label: {
                show: true,
                position: 'top',
                formatter: '{c}',
                fontSize: 12,
                color: COLORS.textSecondary,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 3,
                padding: [2, 4]
              },
              itemStyle: {
                color: COLORS.danger,
                borderRadius: [3, 3, 0, 0]
              }
            }
          ]
        };

        // 应用配置
        chartInstance.setOption(option);

        // 添加辅助线
        if (props.trendData.length > 0) {
          const lastEfficiency = props.trendData[props.trendData.length - 1].efficiency;
          chartInstance.setOption({
            series: [
              {
                name: '效率 (%)',
                markLine: {
                  silent: true,
                  symbol: 'none',
                  lineStyle: {
                    color: COLORS.active,
                    type: 'dashed',
                    width: 1
                  },
                  label: {
                    show: true,
                    position: 'insideEndTop',
                    formatter: '当前效率: {c}%',
                    color: COLORS.active,
                    fontSize: 12
                  },
                  data: [
                    {
                      yAxis: lastEfficiency
                    }
                  ]
                }
              }
            ]
          });
        }

        // 标记图表已初始化
        chartInitialized.value = true;

        // 立即触发一次resize以确保正确渲染
        chartInstance.resize();
      }, 100); // 短暂延迟以确保DOM已完全渲染
    };

    // 处理窗口大小变化
    const handleResize = () => {
      if (chartInstance && chartInitialized.value) {
        chartInstance.resize();
      }
    };

    // 监听展开状态变化和数据变化，重新初始化图表
    watch(() => [props.expanded, props.trendData, props.selectedProject], () => {
      if (props.expanded) {
        nextTick(() => {
          // 重置初始化状态
          chartInitialized.value = false;
          // 初始化图表
          initTrendChart();
        });
      }
    }, { immediate: true });

    // 单独监听项目数据变化，更新图表
    watch(() => props.projectData, () => {
      if (props.expanded && chartInstance && chartInitialized.value) {
        chartInstance.resize();
      }
    });

    // 组件挂载后设置resize监听
    onMounted(() => {
      // 使用nextTick确保DOM已渲染
      nextTick(() => {
        if (props.expanded) {
          initTrendChart();
        }

        // 设置ResizeObserver
        if (window.ResizeObserver && trendChart.value) {
          resizeObserver = new ResizeObserver(handleResize);
          resizeObserver.observe(trendChart.value);
        }

        // 同时监听窗口大小变化
        window.addEventListener('resize', handleResize);
      });
    });

    // 组件卸载前清理
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
    });

    return {
      COLORS,
      cardStyle,
      trendChart
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
  background-color: rgba(58, 66, 86, 0.3);
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  padding: 16px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.trend-chart {
  width: 100%;
  height: 400px; /* Explicit fixed height */
  margin-bottom: 16px;
}

.trend-analysis {
  margin-top: 16px;
  padding: 16px;
  background-color: rgba(66, 153, 225, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(66, 153, 225, 0.3);
  font-size: 14px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trend-analysis:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.analysis-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: v-bind('COLORS.active');
  display: flex;
  align-items: center;
}

.analysis-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: v-bind('COLORS.active');
  margin-right: 8px;
  border-radius: 2px;
}

.analysis-content {
  margin-bottom: 12px;
  line-height: 1.6;
  padding-left: 12px;
  border-left: 2px solid rgba(66, 153, 225, 0.3);
}

.analysis-content:last-child {
  margin-bottom: 0;
}
</style>
