// src/components/cards/GempaTerakhirCard.tsx
import React from "react";
import Card from "./card";
import { IoLocationSharp } from "react-icons/io5";
import TitikGempa from "../marker/titik_gempa";

interface Props {
  data: TitikGempa;
  onSelect: (info: any) => void;
}

const GempaTerakhirCard: React.FC<Props> = ({ data, onSelect }) => {
  return (
    <Card
      title={
        <div className="w-full flex justify-center text-center">
          <p className="font-bold text-glow-red text-sm font-cascadia">
            GEMPA TERDETEKSI TERAKHIR
          </p>
        </div>
      }
      footer={
        <div
          className="flex justify-center w-full cursor-pointer"
          onClick={() => onSelect(data.infoGempa)}
        >
          <IoLocationSharp />
        </div>
      }
      className="hidden md:block show-pop-up md:w-1/4 lg:w-1/6 pointer-events-auto"
    >
      <div
        className="text-glow text-sm w-full font-cascadia"
        style={{ fontSize: "10px" }}
      >
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-left">LOKASI</td>
              <td className="text-right">{data.infoGempa.place}</td>
            </tr>
            <tr>
              <td className="text-left">WAKTU</td>
              <td className="text-right">{data.readableTime} WIB</td>
            </tr>
            <tr>
              <td className="text-left">MAG</td>
              <td className="text-right">
                {Number(data.infoGempa.mag).toFixed(1)}
              </td>
            </tr>
            <tr>
              <td className="text-left">KEDALAMAN</td>
              <td className="text-right">{data.readableDepth} Km</td>
            </tr>
            <tr>
              <td className="text-left">LAT</td>
              <td className="text-right">{data.infoGempa.lat}</td>
            </tr>
            <tr>
              <td className="text-left">LNG</td>
              <td className="text-right">{data.infoGempa.lng}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default GempaTerakhirCard;
