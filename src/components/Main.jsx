import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PopulationChart from "./Populationchart";
import Sidebar from "./Sidebar";
import {
  Chart,
  PieController,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(PieController, DoughnutController, ArcElement, Tooltip, Legend);

function VillageStats({ villages }) {
  const [stats, setStats] = useState({
    totalVillages: 0,
    urbanAreas: 0,
    totalPopulation: 0,
    avgLandArea: 0,
  });

  useEffect(() => {
    const totalVillages = villages.length;
    const urbanAreas = villages.filter((v) => v.tags.includes("urban")).length;
    const totalPopulation = villages.reduce(
      (sum, village) => sum + parseInt(village.demographics.populationSize, 10),
      0
    );
    const avgLandArea =
      villages.reduce((sum, village) => sum + parseFloat(village.landArea), 0) /
      totalVillages;

    setStats({
      totalVillages,
      urbanAreas,
      totalPopulation,
      avgLandArea,
    });
  }, [villages]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-gray-800 rounded p-4 text-center">
        Total Villages{" "}
        <span className="block text-lg font-bold">{stats.totalVillages}</span>
      </div>
      <div className="bg-gray-800 rounded p-4 text-center">
        Urban Areas{" "}
        <span className="block text-lg font-bold">{stats.urbanAreas}</span>
      </div>
      <div className="bg-gray-800 rounded p-4 text-center">
        Population{" "}
        <span className="block text-lg font-bold">
          {stats.totalPopulation.toLocaleString()}
        </span>
      </div>
      <div className="bg-gray-800 rounded p-4 text-center">
        Avg Land Area{" "}
        <span className="block text-lg font-bold">
          {stats.avgLandArea.toFixed(2)} <small>sq km</small>
        </span>
      </div>
    </div>
  );
}

const Main = () => {
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    let map;

    const initializeMap = () => {
      const mapContainer = document.getElementById("map");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer.innerHTML = "";
      }

      map = L.map("map", { zoomControl: true }).setView([31.5, 34.8], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      return map;
    };

    const fetchVillages = async () => {
      try {
        const response = await fetch("/v.json");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setVillages(data);
        updateDashboard(map, data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    const updateDashboard = (map, villages) => {
      updateMap(map, villages);
      updateCharts(villages);
    };

    const updateMap = (map, villages) => {
      villages.forEach((village) => {
        const lat = parseFloat(village.latitude);
        const lng = parseFloat(village.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          L.marker([lat, lng])
            .addTo(map)
            .bindPopup(
              `<b>${village.name}</b><br>Population: ${village.demographics.populationSize}<br>Region: ${village.region}`
            );
        } else {
          console.warn(`Invalid coordinates for village: ${village.name}`);
        }
      });
    };

    let ageChartInstance = null;
    let genderChartInstance = null;

    const updateCharts = (villages) => {
      if (ageChartInstance) {
        ageChartInstance.destroy();
      }
      if (genderChartInstance) {
        genderChartInstance.destroy();
      }

      const ageCtx = document
        .getElementById("ageDistributionChart")
        .getContext("2d");
      ageChartInstance = new Chart(ageCtx, {
        type: "pie",
        data: {
          labels: ["0-14", "15-64", "65+"],
          datasets: [
            {
              data: [40, 50, 10],
              backgroundColor: ["#a74c65", "#2f72a3", "#684eaf"],
            },
          ],
        },
      });

      const genderCtx = document
        .getElementById("genderRatiosChart")
        .getContext("2d");
      genderChartInstance = new Chart(genderCtx, {
        type: "doughnut",
        data: {
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [60, 40],
              backgroundColor: ["#3182ce", "#f56565"],
            },
          ],
        },
      });
    };

    map = initializeMap();
    fetchVillages();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
  <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
    {/* Sidebar */}
    <Sidebar/>

    {/* Main Content */}
    <main className="flex-grow flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="bg-gray-800 rounded mb-4">
          <div id="map" className="h-72"></div>
        </div>
        <VillageStats villages={villages} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-bold mb-2">Age Distribution</h3>
            <canvas id="ageDistributionChart"></canvas>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-bold mb-2">Gender Ratios</h3>
            <canvas id="genderRatiosChart"></canvas>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-4 mt-4">
          <h3 className="text-lg font-bold mb-2">Population by Area</h3>
          <div className="h-full">
            <PopulationChart villages={villages} />
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
