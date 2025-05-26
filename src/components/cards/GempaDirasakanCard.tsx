// src/components/cards/GempaDirasakanCard.tsx
import React from "react";
import Card from "./card";
import { IoLocationSharp } from "react-icons/io5";
import TitikGempa from "../marker/titik_gempa";

interface Props {
  data: TitikGempa;
  onSelect: (info: any) => void;
}

const GempaDirasakanCard: React.FC<Props> = ({ data, onSelect }) => {
  return (
    <Card
      title={
        <div className="w-full flex justify-center text-center">
          <p className="font-bold text-glow-red text-sm font-cascadia">
            GEMPA DIRASAKAN TERAKHIR
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
      className="hidden md:block show-pop-up md:w-1/2 lg:w-2/5 xl:w-1/5 pointer-events-auto"
    >
      <div
        className="flex flex-col w-full justify-center items-center text-glow text-sm"
        style={{ fontSize: "10px" }}
      >
        <div className="w-full flex flex-col md:flex-row gap-2 font-cascadia">
          <div>
            <div
              id="internal"
              className="label bordered flex justify-between mb-2 w-full lg:w-32"
            >
              <div className="flex flex-col items-center p-1">
                <div className="text -characters">{data.readableMag}</div>
                <div className="text">MAG</div>
              </div>
              <div className="decal -blink -striped"></div>
            </div>
            <p className="text-glow">
              DEPTH : {data.readableDepth} KM
            </p>
          </div>
          <div className="bordered p-2 w-full">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left">TIME</td>
                  <td className="text-right">{data.infoGempa.time} WIB</td>
                </tr>
                <tr>
                  <td className="text-left">MAG</td>
                  <td className="text-right">
                    {Number(data.infoGempa.mag).toFixed(1)}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">DEPTH</td>
                  <td className="text-right">{data.infoGempa.depth}</td>
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
        </div>
        <div className="mt-2 bordered">
          <p className="text-glow p-2 break-words font-cascadia">
            {data.infoGempa.message}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GempaDirasakanCard;
