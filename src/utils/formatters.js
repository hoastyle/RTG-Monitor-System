// 时间格式化
export const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', { hour12: false });
};
