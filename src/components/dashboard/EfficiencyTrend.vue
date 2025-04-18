<template>
  <div class="efficiency-trend" :style="cardStyle">
    <div class="card-header" @click="$emit('toggleSection')">
      <h2 class="section-title">{{ selectedProject }} - 效率、成功率与跳台关联分析</h2>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <div class="trend-chart" ref="trendChart"></div>
      
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
import { ref, computed, watch } from 'vue';
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
  setup(props) {
    const trendChart = ref(null);
    
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
      
      const chart = window.echarts.init(trendChart.value);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
          textStyle: {
            color: COLORS.text
          }
        },
        legend: {
          data: ['效率 (%)', '成功率 (%)', '跳台次数'],
          textStyle: {
            color: COLORS.text
          },
          top: 10
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
            name: '百分比',
            min: 50,
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
          {
            type: 'value',
            name: '次数',
            min: 0,
            max: 10,
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
            name: '效率 (%)',
            type: 'line',
            data: props.trendData.map(item => item.efficiency),
            smooth: true,
            symbol: 'emptyCircle',
            itemStyle: {
              color: COLORS.active
            },
            lineStyle: {
              width: 3
            }
          },
          {
            name: '成功率 (%)',
            type: 'line',
            data: props.trendData.map(item => item.successRate),
            smooth: true,
            symbol: 'emptyCircle',
            itemStyle: {
              color: COLORS.success
            },
            lineStyle: {
              width: 3
            }
          },
          {
            name: '跳台次数',
            type: 'line',
            yAxisIndex: 1,
            data: props.trendData.map(item => item.takeovers),
            smooth: true,
            symbol: 'emptyCircle',
            itemStyle: {
              color: COLORS.danger
            },
            lineStyle: {
              width: 3
            }
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 监听展开状态变化和数据变化，重新初始化图表
    watch(() => [props.expanded, props.trendData, props.selectedProject], () => {
      if (props.expanded) {
        setTimeout(() => {
          initTrendChart();
        }, 0);
      }
    }, { immediate: true });
    
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
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  padding: 16px;
}

.trend-chart {
  width: 100%;
  height: 300px;
}

.trend-analysis {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(66, 153, 225, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(66, 153, 225, 0.3);
  font-size: 14px;
}

.analysis-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.analysis-content {
  margin-bottom: 8px;
}

.analysis-content:last-child {
  margin-bottom: 0;
}
</style>
