// src/components/cards/DetailEventCard.tsx
import React from "react";
import Card from "./card";
import { InfoGempa } from "../libs/interface";

interface Props {
  data: InfoGempa;
  onClose: () => void;
}

const DetailEventCard: React.FC<Props> = ({ data, onClose }) => {
  return (
    <Card
      title={
        <div className="w-full flex justify-between">
          <p className="font-bold text-glow-red text-sm">DETAIL EVENT</p>
          <button onClick={onClose}>X</button>
        </div>
      }
      className="show-pop-up pointer-events-auto"
    >
      <div
        className="text-glow text-sm w-full"
        style={{ fontSize: "10px" }}
      >
        <div className="flex flex-col w-full gap-2">
          <div className="bordered p-2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left">PLACE</td>
                  <td className="text-right break-words pl-2">{data.place}</td>
                </tr>
                <tr>
                  <td className="text-left">TIME</td>
                  <td className="text-right break-words pl-2">{data.time} WIB</td>
                </tr>
                <tr>
                  <td className="text-left">MAG</td>
                  <td className="text-right break-words pl-2">
                    {Number(data.mag).toFixed(1)}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">DEPTH</td>
                  <td className="text-right break-words pl-2">{data.depth}</td>
                </tr>
                <tr>
                  <td className="text-left">LAT</td>
                  <td className="text-right break-words pl-2">{data.lat}</td>
                </tr>
                <tr>
                  <td className="text-left">LNG</td>
                  <td className="text-right break-words pl-2">{data.lng}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DetailEventCard;
