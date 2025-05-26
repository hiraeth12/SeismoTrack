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
                "#6A7D5A", // hijau zaitun gelap
                "#B0C4B1", // hijau muda keabu-abuan
                "#8D9F87", // hijau sage
                "#D1E8B3", // hijau pucat cerah
                "#C5C9A4", // hijau kekuningan lembut
                "#999999", // abu-abu netral

                "#7C8F65", // hijau zaitun medium
                "#AFC8A6", // hijau pastel
                "#5E7353", // hijau daun tua
                "#DCEAD1", // hijau keputihan sangat terang
                "#B2BCA5", // hijau dusty
                "#E2EAD2", // hijau muda nyaris krem

                "#6D6F64", // abu kehijauan tua
                "#8FA98B", // hijau keabu-abuan kalem
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
