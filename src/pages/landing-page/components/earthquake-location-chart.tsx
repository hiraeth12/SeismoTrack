import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Feature {
  properties: {
    place: string;
  };
}

interface EarthquakeApiResponse {
  type: string;
  features: Feature[];
}

const EarthquakeLocationChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  const url = import.meta.env.VITE_BMKG_GEMPA_ALL;

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data: EarthquakeApiResponse) => {
        const placeCounts: Record<string, number> = {};

        data.features.forEach((f) => {
          const place = f.properties.place || "Tidak diketahui";
          placeCounts[place] = (placeCounts[place] || 0) + 1;
        });

        const sortedPlaces = Object.entries(placeCounts).sort(
          (a, b) => b[1] - a[1]
        );

        const topPlaces = sortedPlaces.slice(0, 13);
        const othersCount = sortedPlaces
          .slice(5)
          .reduce((sum, [, count]) => sum + count, 0);

        const labels = topPlaces.map(([place]) => place).concat("Lainnya");
        const values = topPlaces.map(([, count]) => count).concat(othersCount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Jumlah Gempa per Lokasi",
              data: values,
              backgroundColor: [
                "#FFAC11",
                "#F88F0A",
                "#E76E00",
                "#D85100",
                "#C93700",
                "#B32000",
                "#C70000",
                "#FFB833",
                "#F9991C",
                "#E88217",
                "#D96B12",
                "#C9550D",
                "#B53F08",
                "#A32A05",
              ],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Gagal fetch data lokasi gempa:", err);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Distribusi Gempa Berdasarkan Lokasi
      </h2>
      {chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "right" as const,
              },
              title: {
                display: true,
                text: "Top 14 Lokasi Gempa + Lainnya",
              },
            },
          }}
        />
      ) : (
        <p className="text-center">Memuat data lokasi gempa...</p>
      )}
    </div>
  );
};

export default EarthquakeLocationChart;
