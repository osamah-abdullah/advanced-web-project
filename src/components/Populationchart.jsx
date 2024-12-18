import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const PopulationChart = ({ villages }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Prepare population data
    const populationData = villages.map((village) => ({
      name: village.name.split(" - ")[0],
      population: parseInt(village.demographics.populationSize, 10),
    }));

    // Get chart context
    const populationCtx = chartRef.current.getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Create new chart instance
    const chartInstance = new Chart(populationCtx, {
      type: "bar",
      data: {
        labels: populationData.map((item) => item.name),
        datasets: [
          {
            label: "Population",
            data: populationData.map((item) => item.population),
            backgroundColor: "#63b3ed",
            borderColor: "#3182ce",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Attach the chart instance to the ref for cleanup
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function to destroy the chart
    return () => {
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [villages]); // Re-run effect when villages prop changes

  return <canvas ref={chartRef} width="400" height="200" ></canvas>;
};

export default PopulationChart;
