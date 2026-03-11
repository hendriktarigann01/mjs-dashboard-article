import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../lib/api";

ChartJS.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const Chart = ({ selectedPeriod = "Years" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API saat period berubah
  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const period = selectedPeriod.toLowerCase(); // "years" | "months" | "days"
        const res = await api.get(`/stats/chart?period=${period}`);
        setChartData(res.data);
      } catch (err) {
        console.error("Chart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [selectedPeriod]);

  // Render/update chart saat data siap
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext("2d");
    const maxVal = Math.max(...chartData.projects, ...chartData.news, 0);
    const yMax = Math.ceil((maxVal + 1) / 5) * 5 || 10; // dynamic max, min 10

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Projects",
            data: chartData.projects,
            backgroundColor: "#3AAFA9",
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: "News",
            data: chartData.news,
            backgroundColor: "#E0F2F0",
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              usePointStyle: true,
              pointStyle: "rectRounded",
              boxWidth: 12,
              boxHeight: 12,
              padding: 16,
              color: "#414853",
              font: { size: 12, weight: "normal" },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: yMax,
            ticks: {
              stepSize: Math.ceil(yMax / 7) || 1,
              font: { size: 10 },
              color: "#9ca3af",
            },
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
            },
          },
          x: {
            ticks: {
              font: { size: 10 },
              color: "#9ca3af",
              maxRotation: 0,
              minRotation: 0,
            },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="h-72 w-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AAFA9]" />
        </div>
      )}
      <canvas ref={chartRef} />
    </div>
  );
};

export default Chart;
