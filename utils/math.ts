export const calculateRate = (completed = 0, total = 0) =>
  total > 0 ? ((completed * 100) / total).toFixed(0) : "0";
