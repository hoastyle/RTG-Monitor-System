// 预设颜色
export const COLORS = {
  background: '#1a1e2c',
  cardBg: '#252a3a',
  text: '#eaeaea',
  textSecondary: '#a0aec0',
  border: '#3a4256',
  active: '#38b2ac',
  warning: '#ed8936',
  danger: '#e53e3e',
  success: '#38a169',
  chartColors: ['#38b2ac', '#4299e1', '#9f7aea', '#ed8936', '#f56565'],
  severityColors: {
    high: '#f56565',
    medium: '#ed8936',
    low: '#38a169'
  }
};

// 获取状态颜色函数
export const getStatusColor = (value, type) => {
  if (type === 'efficiency' || type === 'successRate') {
    if (value >= 90) return COLORS.success;
    if (value >= 75) return COLORS.warning;
    return COLORS.danger;
  }
  return COLORS.active;
};
