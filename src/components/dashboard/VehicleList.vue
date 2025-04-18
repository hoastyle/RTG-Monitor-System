<template>
  <div class="vehicle-list" :style="cardStyle">
    <div class="card-header" @click="$emit('toggleSection')">
      <div class="header-content">
        <h2 class="section-title">{{ selectedProject }} - 车辆状态监控</h2>
        <div class="vehicle-count">共 {{ vehiclesData.length }} 台车</div>
      </div>
      <el-icon v-if="expanded"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
    
    <div v-if="expanded" class="card-content">
      <template v-if="selectedVehicleData">
        <!-- 单车详情视图 -->
        <div class="vehicle-detail">
          <div class="detail-header">
            <button class="back-button" @click="$emit('selectVehicle', null)">
              <el-icon><Back /></el-icon>
              <span>返回车辆列表</span>
            </button>
            <div class="status-container">
              <span class="status-label">状态:</span>
              <div class="status-tag" :class="selectedVehicleData.status">
                <el-icon v-if="selectedVehicleData.status === 'active'"><Check /></el-icon>
                <el-icon v-else-if="selectedVehicleData.status === 'warning'"><Warning /></el-icon>
                <el-icon v-else><CircleClose /></el-icon>
                <span>{{ getStatusText(selectedVehicleData.status) }}</span>
              </div>
            </div>
          </div>
          
          <div class="vehicle-info-card">
            <div class="vehicle-profile">
              <div class="avatar" :class="selectedVehicleData.status">
                <el-icon><Van /></el-icon>
              </div>
              <div class="profile-info">
                <h3>{{ selectedVehicleData.id }}</h3>
                <div class="location">当前位置: {{ selectedVehicleData.location }}</div>
              </div>
            </div>
            
            <div class="vehicle-status">
              <div class="battery-info">
                <el-icon :style="{ color: getBatteryColor(selectedVehicleData.battery) }"><BatteryFull /></el-icon>
                <div>
                  <div class="status-label">电量</div>
                  <div class="status-value" :style="{ color: getBatteryColor(selectedVehicleData.battery) }">
                    {{ selectedVehicleData.battery }}%
                  </div>
                </div>
              </div>
              
              <div class="task-info">
                <div class="status-label">最后任务</div>
                <div class="status-value">{{ selectedVehicleData.lastTask }}</div>
              </div>
            </div>
          </div>
          
          <div class="metrics-grid">
            <!-- 运行指标卡片 -->
            <div class="metrics-card operations">
              <h3 class="card-title">运行指标</h3>
              <div class="metrics-grid-inner">
                <div class="metric-item">
                  <div class="metric-label">今日作业量</div>
                  <div class="metric-value">{{ selectedVehicleData.operations }}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">行走距离</div>
                  <div class="metric-value">{{ selectedVehicleData.distance }} km</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">效率</div>
                  <div class="metric-value" :style="{ color: getStatusColor(selectedVehicleData.efficiency, 'efficiency') }">
                    {{ selectedVehicleData.efficiency }}%
                  </div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">成功率</div>
                  <div class="metric-value" :style="{ color: getStatusColor(selectedVehicleData.successRate, 'successRate') }">
                    {{ selectedVehicleData.successRate }}%
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 故障统计卡片 -->
            <div class="metrics-card issues">
              <h3 class="card-title">
                异常统计
                <span class="takeovers-badge">{{ selectedVehicleData.takeovers }} 次跳台</span>
              </h3>
              <div class="issues-chart" ref="issuesChart"></div>
            </div>
          </div>
          
          <!-- 车辆运行趋势 -->
          <div class="trend-card">
            <h3 class="trend-title">今日运行趋势</h3>
            <div class="trend-chart" ref="trendChart"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 车辆列表视图 -->
        <div class="vehicles-list-view">
          <!-- 分页导航器 -->
          <div v-if="pageCount > 1" class="pagination">
            <div class="pagination-info">
              显示 {{ startIndex + 1 }}-{{ endIndex }} / {{ vehiclesData.length }} 台车辆
            </div>
            <div class="pagination-controls">
              <button 
                :class="['pagination-btn', { disabled: currentPage === 0 }]"
                @click="$emit('prevPage')"
                :disabled="currentPage === 0"
              >
                <el-icon><ArrowLeft /></el-icon>
                <span>上一页</span>
              </button>
              <button 
                :class="['pagination-btn', { disabled: currentPage >= pageCount - 1 }]"
                @click="$emit('nextPage')"
                :disabled="currentPage >= pageCount - 1"
              >
                <span>下一页</span>
                <el-icon><ArrowRight /></el-icon>
              </button>
            </div>
          </div>
          
          <!-- 车辆列表 -->
          <div class="vehicles-grid">
            <div 
              v-for="vehicle in currentVehicles"
              :key="vehicle.id"
              class="vehicle-card"
              @click="$emit('selectVehicle', vehicle.id)"
            >
              <div class="status-bar" :class="vehicle.status"></div>
              
              <div class="vehicle-header">
                <div class="vehicle-avatar" :class="vehicle.status">
                  <el-icon><Van /></el-icon>
                </div>
                <div class="vehicle-main-info">
                  <h4 class="vehicle-id">{{ vehicle.id }}</h4>
                  <div class="vehicle-location">{{ vehicle.location }}</div>
                </div>
                <div class="vehicle-status-tag" :class="vehicle.status">
                  <el-icon v-if="vehicle.status === 'active'"><Check /></el-icon>
                  <el-icon v-else-if="vehicle.status === 'warning'"><Warning /></el-icon>
                  <el-icon v-else><CircleClose /></el-icon>
                  <span>{{ getStatusText(vehicle.status) }}</span>
                </div>
              </div>
              
              <div class="vehicle-metrics">
                <div class="metric-row">
                  <div class="metric">
                    <div class="metric-label">今日作业量</div>
                    <div class="metric-value">{{ vehicle.operations }}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">跳台次数</div>
                    <div class="metric-value" :class="{ warning: vehicle.takeovers > 5, danger: vehicle.takeovers > 7 }">
                      {{ vehicle.takeovers }}
                    </div>
                  </div>
                </div>
                
                <div class="metric-row">
                  <div class="metric">
                    <div class="metric-label">效率</div>
                    <div class="metric-value" :style="{ color: getStatusColor(vehicle.efficiency, 'efficiency') }">
                      {{ vehicle.efficiency }}%
                    </div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">成功率</div>
                    <div class="metric-value" :style="{ color: getStatusColor(vehicle.successRate, 'successRate') }">
                      {{ vehicle.successRate }}%
                    </div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">电量</div>
                    <div class="metric-value battery" :style="{ color: getBatteryColor(vehicle.battery) }">
                      <el-icon><BatteryFull /></el-icon>
                      {{ vehicle.battery }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { COLORS, getStatusColor } from '../../utils/colors';

export default {
  name: 'VehicleList',
  props: {
    expanded: {
      type: Boolean,
      required: true
    },
    selectedProject: {
      type: String,
      required: true
    },
    vehiclesData: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    vehiclesPerPage: {
      type: Number,
      required: true
    },
    selectedVehicle: {
      type: String,
      default: null
    }
  },
  emits: ['toggleSection', 'prevPage', 'nextPage', 'selectVehicle'],
  setup(props) {
    const issuesChart = ref(null);
    const trendChart = ref(null);
    
    // 卡片样式
    const cardStyle = computed(() => ({
      backgroundColor: COLORS.cardBg,
      borderRadius: '8px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }));
    
    // 获取当前页面的车辆
    const currentVehicles = computed(() => {
      const start = props.currentPage * props.vehiclesPerPage;
      const end = start + props.vehiclesPerPage;
      return props.vehiclesData.slice(start, end);
    });
    
    // 获取选中的车辆数据
    const selectedVehicleData = computed(() => {
      if (!props.selectedVehicle) return null;
      return props.vehiclesData.find(v => v.id === props.selectedVehicle);
    });
    
    // 分页相关计算
    const pageCount = computed(() => {
      return Math.ceil(props.vehiclesData.length / props.vehiclesPerPage);
    });
    
    const startIndex = computed(() => {
      return props.currentPage * props.vehiclesPerPage;
    });
    
    const endIndex = computed(() => {
      return Math.min((props.currentPage + 1) * props.vehiclesPerPage, props.vehiclesData.length);
    });
    
    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'active': return '运行中';
        case 'warning': return '注意';
        case 'danger': return '故障';
        default: return '未知';
      }
    };
    
    // 获取电池颜色
    const getBatteryColor = (battery) => {
      if (battery > 60) return COLORS.success;
      if (battery > 30) return COLORS.warning;
      return COLORS.danger;
    };
    
    // 初始化故障统计图表
    const initIssuesChart = () => {
      if (!issuesChart.value || !selectedVehicleData.value) return;
      
      const chart = window.echarts.init(issuesChart.value);
      
      const takeovers = selectedVehicleData.value.takeovers;
      
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
        grid: {
          left: '25%',
          right: '5%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
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
          type: 'category',
          data: ['传感器故障', '定位异常', '识别错误', '路径规划', '其他故障'],
          axisLine: {
            lineStyle: {
              color: COLORS.border
            }
          },
          axisLabel: {
            color: COLORS.textSecondary
          }
        },
        series: [
          {
            name: '次数',
            type: 'bar',
            data: [
              Math.round(takeovers * 0.3),
              Math.round(takeovers * 0.25),
              Math.round(takeovers * 0.2),
              Math.round(takeovers * 0.15),
              takeovers - Math.round(takeovers * 0.3) - Math.round(takeovers * 0.25) - Math.round(takeovers * 0.2) - Math.round(takeovers * 0.15)
            ],
            itemStyle: {
              color: COLORS.danger
            }
          }
        ]
      };
      
      chart.setOption(option);
    };
    
    // 初始化趋势图
    const initTrendChart = () => {
      if (!trendChart.value || !selectedVehicleData.value) return;
      
      const chart = window.echarts.init(trendChart.value);
      
      // 模拟当天数据
      const data = [
        { time: '10:00', efficiency: 95, successRate: 96, takeovers: 0 },
        { time: '11:00', efficiency: 93, successRate: 95, takeovers: 1 },
        { time: '12:00', efficiency: 92, successRate: 94, takeovers: 0 },
        { time: '13:00', efficiency: 91, successRate: 93, takeovers: 1 },
        { time: '14:00', efficiency: 88, successRate: 91, takeovers: 2 },
        { time: '15:00', efficiency: 87, successRate: 90, takeovers: 1 },
        { time: '16:00', efficiency: 89, successRate: 92, takeovers: 0 },
        { time: '17:00', efficiency: 90, successRate: 93, takeovers: 0 },
        { time: '18:00', efficiency: selectedVehicleData.value.efficiency, successRate: selectedVehicleData.value.successRate, takeovers: 1 }
      ];
      
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
          data: data.map(item => item.time),
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
            min: 80,
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
            max: 5,
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
            data: data.map(item => item.efficiency),
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
            data: data.map(item => item.successRate),
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
            data: data.map(item => item.takeovers),
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
    
    // 监听车辆选择变化和展开状态变化，初始化图表
    watch(() => [props.expanded, props.selectedVehicle, props.selectedProject], () => {
      if (props.expanded && props.selectedVehicle) {
        setTimeout(() => {
          initIssuesChart();
          initTrendChart();
        }, 0);
      }
    }, { immediate: true });
    
    return {
      COLORS,
      cardStyle,
      issuesChart,
      trendChart,
      currentVehicles,
      selectedVehicleData,
      pageCount,
      startIndex,
      endIndex,
      getStatusText,
      getBatteryColor,
      getStatusColor
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

.vehicle-count {
  margin-left: 12px;
  background-color: v-bind('COLORS.active');
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.card-content {
  padding: 16px;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pagination-info {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  background-color: v-bind('COLORS.cardBg');
  border: 1px solid v-bind('COLORS.border');
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-btn.disabled {
  background-color: rgba(58, 66, 86, 0.5);
  cursor: not-allowed;
}

.pagination-btn .el-icon {
  margin: 0 6px;
}

/* 车辆列表网格 */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 车辆卡片样式 */
.vehicle-card {
  background-color: rgba(26, 32, 44, 0.3);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid v-bind('COLORS.border');
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.status-bar.active {
  background-color: v-bind('COLORS.success');
}

.status-bar.warning {
  background-color: v-bind('COLORS.warning');
}

.status-bar.danger {
  background-color: v-bind('COLORS.danger');
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.vehicle-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: v-bind('COLORS.cardBg');
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border-width: 2px;
  border-style: solid;
}

.vehicle-avatar.active {
  border-color: v-bind('COLORS.success');
}

.vehicle-avatar.warning {
  border-color: v-bind('COLORS.warning');
}

.vehicle-avatar.danger {
  border-color: v-bind('COLORS.danger');
}

.vehicle-avatar .el-icon {
  font-size: 20px;
  color: v-bind('COLORS.active');
}

.vehicle-main-info {
  flex: 1;
}

.vehicle-id {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.vehicle-location {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.vehicle-status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.vehicle-status-tag.active {
  background-color: rgba(56, 161, 105, 0.1);
  color: v-bind('COLORS.success');
}

.vehicle-status-tag.warning {
  background-color: rgba(237, 137, 54, 0.1);
  color: v-bind('COLORS.warning');
}

.vehicle-status-tag.danger {
  background-color: rgba(229, 62, 62, 0.1);
  color: v-bind('COLORS.danger');
}

.vehicle-status-tag .el-icon {
  margin-right: 4px;
}

.vehicle-metrics {
  display: grid;
  gap: 12px;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.metric-label {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.metric-value {
  font-size: 16px;
  font-weight: bold;
}

.metric-value.warning {
  color: v-bind('COLORS.warning');
}

.metric-value.danger {
  color: v-bind('COLORS.danger');
}

.metric-value.battery {
  display: flex;
  align-items: center;
}

.metric-value.battery .el-icon {
  margin-right: 4px;
}

/* 车辆详情样式 */
.vehicle-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: v-bind('COLORS.cardBg');
  border: 1px solid v-bind('COLORS.border');
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-button .el-icon {
  margin-right: 6px;
}

.status-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.active {
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

.vehicle-info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(66, 153, 225, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(66, 153, 225, 0.3);
}

.vehicle-profile {
  display: flex;
  align-items: center;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: v-bind('COLORS.cardBg');
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  border-width: 2px;
  border-style: solid;
}

.avatar .el-icon {
  font-size: 32px;
  color: v-bind('COLORS.active');
}

.avatar.active {
  border-color: v-bind('COLORS.success');
}

.avatar.warning {
  border-color: v-bind('COLORS.warning');
}

.avatar.danger {
  border-color: v-bind('COLORS.danger');
}

.profile-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.location {
  font-size: 14px;
  color: v-bind('COLORS.textSecondary');
  margin-top: 4px;
}

.vehicle-status {
  display: flex;
  align-items: center;
}

.battery-info {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.battery-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.battery-info .status-label {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.status-value {
  font-size: 16px;
  font-weight: bold;
}

.task-info .status-label {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metrics-card {
  border-radius: 8px;
  padding: 16px;
  border-width: 1px;
  border-style: solid;
}

.metrics-card.operations {
  background-color: rgba(56, 178, 172, 0.1);
  border-color: rgba(56, 178, 172, 0.3);
}

.metrics-card.issues {
  background-color: rgba(229, 62, 62, 0.1);
  border-color: rgba(229, 62, 62, 0.3);
}

.card-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
  display: flex;
  align-items: center;
}

.takeovers-badge {
  margin-left: 8px;
  padding: 2px 6px;
  background-color: v-bind('COLORS.danger');
  color: white;
  font-size: 12px;
  border-radius: 4px;
}

.metrics-grid-inner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.metric-item .metric-label {
  font-size: 12px;
  color: v-bind('COLORS.textSecondary');
}

.metric-item .metric-value {
  font-size: 24px;
  font-weight: bold;
}

.issues-chart {
  height: 100px;
}

.trend-card {
  background-color: rgba(159, 122, 234, 0.1);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(159, 122, 234, 0.3);
}

.trend-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: v-bind('COLORS.textSecondary');
}

.trend-chart {
  height: 250px;
}
</style>
