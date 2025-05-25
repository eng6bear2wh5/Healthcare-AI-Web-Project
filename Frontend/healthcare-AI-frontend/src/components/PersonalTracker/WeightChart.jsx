import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Tự động đăng ký các loại biểu đồ

function WeightChart() {
  // Dữ liệu mẫu cho biểu đồ cân nặng theo thời gian
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [70, 72, 71, 73, 74, 72],
        fill: false,
        backgroundColor: 'rgba(34,197,94,0.5)',
        borderColor: 'rgba(34,197,94,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // cho phép điều chỉnh kích thước
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Weight History</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default WeightChart;
