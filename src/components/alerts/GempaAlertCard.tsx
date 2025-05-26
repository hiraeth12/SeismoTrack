import React, { useState } from "react";
import Card from "../cards/card";
import ItemKotaTerdampak from "../ItemKotaTerdampak";
import TitikGempa from "../marker/titik_gempa";
import { X } from "lucide-react";

interface GempaAlertCardProps {
  data: TitikGempa;
}

const GempaAlertCard: React.FC<GempaAlertCardProps> = ({ data }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Card
      title={
        <div className="relative overflow-hidden">
          {/* Strip animation */}
          <div className="strip-wrapper">
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
          </div>
          {/* Title */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <p className="p-1 bg-black text-xs text-glow font-cascadia">
              GEMPA BUMI
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1 right-1 text-red-800 w-5 h-5 flex items-center justify-center z-10"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      }
      className="hidden md:block show-pop-up md:w-1/2 lg:w-2/5 xl:w-1/5 pointer-events-auto"
    >
      <div
        className="flex flex-col w-full justify-center items-center text-glow text-sm"
        style={{ fontSize: "10px" }}
      >
        <div className="w-full flex gap-2 font-cascadia">
          <div>
            <div
              id="internal"
              className="label bordered flex mb-2 w-full lg:w-32"
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
          <div className="bordered p-1 w-full font-cascadia">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left">TIME</td>
                  <td className="text-right">{data.readableTime}</td>
                </tr>
                <tr>
                  <td className="text-left">MAG</td>
                  <td className="text-right">{Number(data.mag).toFixed(1)}</td>
                </tr>
                <tr>
                  <td className="text-left">DEPTH</td>
                  <td className="text-right">{data.depth}</td>
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
        <div className="mt-2 bordered w-full font-cascadia">
          <p className="text-glow p-2 break-words">{data.infoGempa.message}</p>
        </div>
      </div>

      {/* {data.mag >= 5 && (
        <div
          className="red-bordered p-2 overflow-y-auto custom-scrollbar mt-2 pointer-events-auto"
          style={{ maxHeight: "20vh" }}
        >
          <ul>
            {data.infoGempa.listKotaTerdampak?.map((kota, i) => (
              <li
                key={i}
                className={`flex flex-grow justify-between items-center mb-2 item-daerah ${
                  kota.hit ? "danger" : ""
                } slide-in-left`}
              >
                <ItemKotaTerdampak kota={kota} />
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </Card>
  );
};

export default GempaAlertCard;
