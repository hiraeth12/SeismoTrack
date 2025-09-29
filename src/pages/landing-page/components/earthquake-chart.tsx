import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const EarthquakeChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

const url = import.meta.env.VITE_BMKG_GEMPA_ALL;


  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const magnitudes = data.features.map((feature: any) => {
          const rawMag =
            feature?.properties?.Magnitude ||
            feature?.properties?.mag ||
            feature?.properties?.magnitude;
          if (!rawMag) return NaN;
          const cleanedMag =
            typeof rawMag === "string"
              ? rawMag.replace(/[^\d.]/g, "")
              : rawMag.toString();
          return parseFloat(cleanedMag);
        });

        const bins = { "< 2.5": 0, "2.6 - 3.5": 0, "3.6 - 4.5": 0, "> 4.6": 0 };

        magnitudes.forEach((m) => {
          if (isNaN(m)) return;
          if (m < 2.5) bins["< 2.5"]++;
          else if (m < 3.5) bins["2.6 - 3.5"]++;
          else if (m < 4.5) bins["3.6 - 4.5"]++;
          else bins["> 4.6"]++;
        });

        setChartData({
          labels: Object.keys(bins),
          datasets: [
            {
              label: "Jumlah Gempa",
              data: Object.values(bins),
              backgroundColor: "#FFAC11",
              borderColor: "#FFAC11",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Gagal fetch data gempa:", err);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Grafik Gempa Berdasarkan Magnitudo
      </h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: "Distribusi Gempa per Kategori Magnitudo",
              },
            },
          }}
        />
      ) : (
        <p className="text-center">Memuat data grafik...</p>
      )}
    </div>
  );
};

export default EarthquakeChart;
