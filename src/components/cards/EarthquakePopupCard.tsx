// components/cards/EarthquakePopupCard.tsx
import React from "react";
import Card from "./card";

interface Props {
  mag: number;
  depth: string;
  time: string | Date;
  coordinates: [number, number];
}

function formatTo24HourString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

const EarthquakePopupCard: React.FC<Props> = ({
  mag,
  depth,
  time,
  coordinates,
}) => {
  return (
    <Card
      title={
        <div className="overflow-hidden">
          <div className="strip-wrapper">
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
          </div>
          <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <p className="p-1 bg-black font-bold text-xs text-glow font-cascadia">
              GEMPA BUMI
            </p>
          </div>
        </div>
      }
      className="min-h-48 min-w-48 whitespace-pre-wrap"
    >
      <div
        className="text-glow text-md w-full font-cascadia"
        style={{ fontSize: "10px" }}
      >
        <table className="w-full">
          <tbody>
            <tr>
              <td className="flex">Magnitudo</td>
              <td className="text-right break-words pl-2">{mag.toFixed(1)}</td>
            </tr>
            <tr>
              <td className="flex">Kedalaman</td>
              <td className="text-right break-words pl-2">
                {Number(depth).toFixed(2)} Km
              </td>
            </tr>
            {/* Baris untuk Tanggal */}
            <tr>
              <td className="flex">Tanggal</td>
              <td className="text-right break-words pl-2">
                {new Date(time).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </td>
            </tr>
            {/* Baris untuk Waktu */}
            <tr>
              <td className="flex">Waktu</td>
              <td className="text-right break-words pl-2">
                {formatTo24HourString(new Date(time))} WIB
              </td>
            </tr>
            <tr>
              <td className="flex">Lat</td>
              <td className="text-right break-words pl-2">
                {coordinates[0]}
              </td>
            </tr>
            <tr>
              <td className="flex">Lng</td>
              <td className="text-right break-words pl-2">
                {coordinates[1]}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EarthquakePopupCard;
