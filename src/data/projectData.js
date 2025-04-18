// 项目基础数据
export const projects = [
  { id: 1, name: '上海港项目', version: 'v2.3.1', status: 'active' },
  { id: 2, name: '青岛港项目', version: 'v2.2.5', status: 'warning' },
  { id: 3, name: '宁波港项目', version: 'v2.3.0', status: 'active' },
  { id: 4, name: '深圳港项目', version: 'v2.1.8', status: 'danger' }
];

// 实时数据，添加成功率字段
export const realtimeData = {
  '上海港项目': { 
    operations: 368, efficiency: 92, distance: 126, successRate: 94.8,
    activeVehicles: 8, totalVehicles: 10, 
    takeovers: 16, lastUpdate: '18:45:23'
  },
  '青岛港项目': { 
    operations: 421, efficiency: 79, distance: 145, successRate: 84.3,
    activeVehicles: 12, totalVehicles: 15, 
    takeovers: 28, lastUpdate: '18:46:05'
  },
  '宁波港项目': { 
    operations: 295, efficiency: 94, distance: 98, successRate: 96.7,
    activeVehicles: 6, totalVehicles: 7, 
    takeovers: 12, lastUpdate: '18:45:47'
  },
  '深圳港项目': { 
    operations: 356, efficiency: 68, distance: 132, successRate: 72.5,
    activeVehicles: 7, totalVehicles: 10, 
    takeovers: 38, lastUpdate: '18:44:58'
  }
};

// 车辆详细数据
export const vehiclesData = {
  '上海港项目': [
    { id: 'H231', status: 'active', operations: 52, distance: 18.3, efficiency: 95, successRate: 96.2, battery: 78, takeovers: 2, lastTask: '集装箱转运 #A23489', location: '东区A3-B4' },
    { id: 'H232', status: 'active', operations: 48, distance: 15.9, efficiency: 91, successRate: 93.5, battery: 65, takeovers: 3, lastTask: '集装箱装载 #B78012', location: '南区C5-D2' },
    { id: 'H233', status: 'warning', operations: 42, distance: 14.2, efficiency: 88, successRate: 92.1, battery: 42, takeovers: 4, lastTask: '集装箱卸载 #C65901', location: '西区B1-C3' },
    { id: 'H234', status: 'active', operations: 56, distance: 19.5, efficiency: 94, successRate: 95.8, battery: 81, takeovers: 1, lastTask: '集装箱转运 #D12567', location: '北区D4-A2' },
    { id: 'H235', status: 'danger', operations: 32, distance: 12.4, efficiency: 76, successRate: 84.3, battery: 23, takeovers: 6, lastTask: '集装箱装载 #E45678', location: '维修区' },
    { id: 'H236', status: 'active', operations: 50, distance: 17.2, efficiency: 93, successRate: 94.7, battery: 72, takeovers: 2, lastTask: '集装箱卸载 #F23456', location: '东区B2-C4' },
    { id: 'H237', status: 'active', operations: 47, distance: 16.8, efficiency: 92, successRate: 95.2, battery: 68, takeovers: 3, lastTask: '集装箱转运 #G34567', location: '南区A1-B3' },
    { id: 'H238', status: 'warning', operations: 41, distance: 13.9, efficiency: 87, successRate: 91.8, battery: 35, takeovers: 5, lastTask: '集装箱装载 #H45678', location: '西区C2-D1' }
  ],
  '青岛港项目': [
    { id: 'Q321', status: 'active', operations: 58, distance: 19.8, efficiency: 85, successRate: 88.4, battery: 72, takeovers: 3, lastTask: '集装箱转运 #J56789', location: '东区A4-B5' },
    { id: 'Q322', status: 'warning', operations: 45, distance: 16.2, efficiency: 78, successRate: 82.5, battery: 38, takeovers: 4, lastTask: '集装箱装载 #K67890', location: '南区B2-C4' },
    { id: 'Q323', status: 'active', operations: 52, distance: 18.5, efficiency: 82, successRate: 86.7, battery: 65, takeovers: 3, lastTask: '集装箱卸载 #L78901', location: '西区D1-A3' },
    { id: 'Q324', status: 'danger', operations: 36, distance: 14.2, efficiency: 65, successRate: 72.3, battery: 25, takeovers: 8, lastTask: '集装箱转运 #M89012', location: '维修区' },
    { id: 'Q325', status: 'active', operations: 54, distance: 18.9, efficiency: 84, successRate: 87.6, battery: 70, takeovers: 2, lastTask: '集装箱装载 #N90123', location: '北区C3-D5' },
    { id: 'Q326', status: 'active', operations: 49, distance: 17.5, efficiency: 80, successRate: 85.2, battery: 63, takeovers: 3, lastTask: '集装箱卸载 #O01234', location: '东区B3-C5' },
    { id: 'Q327', status: 'warning', operations: 42, distance: 15.3, efficiency: 76, successRate: 81.9, battery: 41, takeovers: 5, lastTask: '集装箱转运 #P12345', location: '南区A2-B4' },
    { id: 'Q328', status: 'active', operations: 51, distance: 17.8, efficiency: 83, successRate: 86.3, battery: 67, takeovers: 3, lastTask: '集装箱装载 #Q23456', location: '西区B4-C6' },
    { id: 'Q329', status: 'active', operations: 48, distance: 16.9, efficiency: 81, successRate: 85.8, battery: 59, takeovers: 4, lastTask: '集装箱卸载 #R34567', location: '北区D2-A4' },
    { id: 'Q330', status: 'warning', operations: 40, distance: 14.8, efficiency: 74, successRate: 80.1, battery: 32, takeovers: 6, lastTask: '集装箱转运 #S45678', location: '充电区' },
    { id: 'Q331', status: 'danger', operations: 34, distance: 13.2, efficiency: 62, successRate: 70.5, battery: 18, takeovers: 9, lastTask: '集装箱装载 #T56789', location: '维修区' },
    { id: 'Q332', status: 'active', operations: 50, distance: 17.2, efficiency: 82, successRate: 86.1, battery: 61, takeovers: 3, lastTask: '集装箱卸载 #U67890', location: '东区C2-D4' }
  ],
  '宁波港项目': [
    { id: 'N421', status: 'active', operations: 53, distance: 17.8, efficiency: 96, successRate: 97.2, battery: 82, takeovers: 1, lastTask: '集装箱转运 #V78901', location: '东区A5-B6' },
    { id: 'N422', status: 'active', operations: 48, distance: 16.5, efficiency: 95, successRate: 96.5, battery: 74, takeovers: 2, lastTask: '集装箱装载 #W89012', location: '南区B5-C7' },
    { id: 'N423', status: 'active', operations: 50, distance: 17.2, efficiency: 94, successRate: 96.8, battery: 78, takeovers: 2, lastTask: '集装箱卸载 #X90123', location: '西区C3-D5' },
    { id: 'N424', status: 'warning', operations: 41, distance: 14.5, efficiency: 90, successRate: 93.7, battery: 45, takeovers: 3, lastTask: '集装箱转运 #Y01234', location: '北区D3-A5' },
    { id: 'N425', status: 'active', operations: 52, distance: 17.6, efficiency: 96, successRate: 97.5, battery: 80, takeovers: 1, lastTask: '集装箱装载 #Z12345', location: '东区B4-C6' },
    { id: 'N426', status: 'active', operations: 51, distance: 17.3, efficiency: 95, successRate: 96.3, battery: 76, takeovers: 2, lastTask: '集装箱卸载 #AA2345', location: '南区C4-D6' }
  ],
  '深圳港项目': [
    { id: 'S521', status: 'warning', operations: 42, distance: 15.3, efficiency: 70, successRate: 75.2, battery: 40, takeovers: 6, lastTask: '集装箱转运 #BB3456', location: '东区A6-B7' },
    { id: 'S522', status: 'danger', operations: 35, distance: 12.8, efficiency: 60, successRate: 65.8, battery: 22, takeovers: 9, lastTask: '集装箱装载 #CC4567', location: '维修区' },
    { id: 'S523', status: 'active', operations: 46, distance: 16.5, efficiency: 72, successRate: 78.3, battery: 58, takeovers: 5, lastTask: '集装箱卸载 #DD5678', location: '西区B5-C7' },
    { id: 'S524', status: 'warning', operations: 40, distance: 14.8, efficiency: 68, successRate: 73.5, battery: 35, takeovers: 7, lastTask: '集装箱转运 #EE6789', location: '北区D4-A6' },
    { id: 'S525', status: 'active', operations: 48, distance: 17.2, efficiency: 73, successRate: 79.1, battery: 62, takeovers: 4, lastTask: '集装箱装载 #FF7890', location: '东区B6-C8' },
    { id: 'S526', status: 'danger', operations: 33, distance: 12.3, efficiency: 58, successRate: 63.4, battery: 18, takeovers: 10, lastTask: '集装箱卸载 #GG8901', location: '维修区' },
    { id: 'S527', status: 'active', operations: 45, distance: 16.2, efficiency: 71, successRate: 77.8, battery: 56, takeovers: 5, lastTask: '集装箱转运 #HH9012', location: '南区C5-D7' }
  ]
};

// 故障历史数据 - 添加成功率
export const historyTrends = {
  '上海港项目': [
    { time: '12:00', operations: 46, efficiency: 94, takeovers: 2, successRate: 95.2 },
    { time: '13:00', operations: 52, efficiency: 95, takeovers: 1, successRate: 96.5 },
    { time: '14:00', operations: 48, efficiency: 92, takeovers: 3, successRate: 94.8 },
    { time: '15:00', operations: 55, efficiency: 93, takeovers: 2, successRate: 95.6 },
    { time: '16:00', operations: 49, efficiency: 91, takeovers: 4, successRate: 93.7 },
    { time: '17:00', operations: 58, efficiency: 90, takeovers: 2, successRate: 94.2 },
    { time: '18:00', operations: 60, efficiency: 89, takeovers: 2, successRate: 94.8 }
  ],
  '青岛港项目': [
    { time: '12:00', operations: 58, efficiency: 82, takeovers: 4, successRate: 85.3 },
    { time: '13:00', operations: 62, efficiency: 80, takeovers: 5, successRate: 83.6 },
    { time: '14:00', operations: 59, efficiency: 78, takeovers: 6, successRate: 81.8 },
    { time: '15:00', operations: 65, efficiency: 81, takeovers: 3, successRate: 86.2 },
    { time: '16:00', operations: 58, efficiency: 77, takeovers: 4, successRate: 82.5 },
    { time: '17:00', operations: 63, efficiency: 79, takeovers: 3, successRate: 84.7 },
    { time: '18:00', operations: 56, efficiency: 79, takeovers: 3, successRate: 84.3 }
  ],
  '宁波港项目': [
    { time: '12:00', operations: 40, efficiency: 95, takeovers: 1, successRate: 97.3 },
    { time: '13:00', operations: 45, efficiency: 94, takeovers: 2, successRate: 96.8 },
    { time: '14:00', operations: 38, efficiency: 96, takeovers: 1, successRate: 97.6 },
    { time: '15:00', operations: 42, efficiency: 95, takeovers: 2, successRate: 96.5 },
    { time: '16:00', operations: 40, efficiency: 93, takeovers: 3, successRate: 95.2 },
    { time: '17:00', operations: 48, efficiency: 92, takeovers: 2, successRate: 95.8 },
    { time: '18:00', operations: 42, efficiency: 94, takeovers: 1, successRate: 96.7 }
  ],
  '深圳港项目': [
    { time: '12:00', operations: 48, efficiency: 70, takeovers: 6, successRate: 74.2 },
    { time: '13:00', operations: 52, efficiency: 72, takeovers: 5, successRate: 76.8 },
    { time: '14:00', operations: 49, efficiency: 68, takeovers: 7, successRate: 72.3 },
    { time: '15:00', operations: 55, efficiency: 65, takeovers: 8, successRate: 70.5 },
    { time: '16:00', operations: 50, efficiency: 66, takeovers: 5, successRate: 73.1 },
    { time: '17:00', operations: 54, efficiency: 69, takeovers: 4, successRate: 75.6 },
    { time: '18:00', operations: 48, efficiency: 67, takeovers: 3, successRate: 72.5 }
  ]
};

// 故障原因数据
export const takeoverData = {
  '上海港项目': [
    { reason: '传感器故障', count: 5, severity: 'high' },
    { reason: '定位异常', count: 3, severity: 'high' },
    { reason: '集装箱识别错误', count: 4, severity: 'medium' },
    { reason: '路径规划失败', count: 2, severity: 'medium' },
    { reason: '其他故障', count: 2, severity: 'low' }
  ],
  '青岛港项目': [
    { reason: '传感器故障', count: 7, severity: 'high' },
    { reason: '定位异常', count: 9, severity: 'high' },
    { reason: '集装箱识别错误', count: 4, severity: 'medium' },
    { reason: '路径规划失败', count: 3, severity: 'medium' },
    { reason: '其他故障', count: 5, severity: 'low' }
  ],
  '宁波港项目': [
    { reason: '传感器故障', count: 3, severity: 'high' },
    { reason: '定位异常', count: 2, severity: 'high' },
    { reason: '集装箱识别错误', count: 4, severity: 'medium' },
    { reason: '路径规划失败', count: 1, severity: 'medium' },
    { reason: '其他故障', count: 2, severity: 'low' }
  ],
  '深圳港项目': [
    { reason: '传感器故障', count: 12, severity: 'high' },
    { reason: '定位异常', count: 10, severity: 'high' },
    { reason: '集装箱识别错误', count: 6, severity: 'medium' },
    { reason: '路径规划失败', count: 5, severity: 'medium' },
    { reason: '其他故障', count: 5, severity: 'low' }
  ]
};

// 轮换视图步骤
export const rotationSteps = [
  { mode: 'single', project: '上海港项目', section: 'overview' },
  { mode: 'single', project: '上海港项目', section: 'takeovers' },
  { mode: 'single', project: '上海港项目', section: 'trend' },
  { mode: 'vehicles', project: '上海港项目', section: 'vehicles' },
  { mode: 'single', project: '青岛港项目', section: 'overview' },
  { mode: 'single', project: '青岛港项目', section: 'takeovers' },
  { mode: 'single', project: '青岛港项目', section: 'trend' },
  { mode: 'vehicles', project: '青岛港项目', section: 'vehicles' },
  { mode: 'single', project: '宁波港项目', section: 'overview' },
  { mode: 'single', project: '宁波港项目', section: 'takeovers' },
  { mode: 'single', project: '宁波港项目', section: 'trend' },
  { mode: 'vehicles', project: '宁波港项目', section: 'vehicles' },
  { mode: 'single', project: '深圳港项目', section: 'overview' },
  { mode: 'single', project: '深圳港项目', section: 'takeovers' },
  { mode: 'single', project: '深圳港项目', section: 'trend' },
  { mode: 'vehicles', project: '深圳港项目', section: 'vehicles' },
  { mode: 'compare', project: null, section: 'comparison' },
  { mode: 'compare', project: null, section: 'takeovers' }
];

// 比对视图数据
export function getProjectComparisonData() {
  return projects.map(project => ({
    name: project.name,
    takeovers: realtimeData[project.name].takeovers,
    efficiency: realtimeData[project.name].efficiency,
    successRate: realtimeData[project.name].successRate,
    operations: realtimeData[project.name].operations
  }));
}

// 散点图数据
export function getProjectScatterData() {
  return projects.map(project => ({
    name: project.name,
    version: project.version,
    takeovers: realtimeData[project.name].takeovers,
    efficiency: realtimeData[project.name].efficiency,
    successRate: realtimeData[project.name].successRate
  }));
}

// 效率柱状图数据
export function getEfficiencyBarData() {
  return projects.map(project => ({
    name: project.name,
    efficiency: realtimeData[project.name].efficiency,
    successRate: realtimeData[project.name].successRate
  }));
}
