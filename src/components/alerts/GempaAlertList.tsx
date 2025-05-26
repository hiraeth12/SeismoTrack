// src/components/alerts/GempaAlertList.tsx
import React, { useState } from "react";
import Card from "../cards/card";
import ItemKotaTerdampak from "../ItemKotaTerdampak";
import TitikGempa from "../marker/titik_gempa";
import { X } from "lucide-react";


interface Props {
  data: TitikGempa[]; // opsional: kalau ingin fitur tutup per item
}

const GempaAlertList: React.FC<Props> = ({ data }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <>
      {data.map((agi, i) => (
        <Card
          key={i}
          title={
            <div className="overflow-hidden relative">
              <div className="strip-wrapper">
                <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
                <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
              </div>
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="p-1 bg-black font-bold text-xs text-glow font-cascadia">
                  GEMPA BUMI
                </p>
              </div>
              <div className="absolute top-1 right-1">
                <button
                  onClick={() => setVisible(false)}
                  className="absolute top-1 right-1 text-red-800 w-5 h-5 flex items-center justify-center z-10"
                  aria-label="Close alert"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          }
          className="hidden md:block show-pop-up md:w-1/2 lg:w-2/5 xl:w-1/5 pointer-events-auto"
        >
          <div
            className="flex flex-col w-full justify-center items-center text-glow text-sm"
            style={{ fontSize: "10px" }}
          >
            <div className="w-full flex gap-2">
              <div>
                <div
                  id="internal"
                  className="label bordered flex mb-2 w-full lg:w-32"
                >
                  <div className="flex flex-col items-center p-1">
                    <div className="text -characters">{agi.readableMag}</div>
                    <div className="text">MAG</div>
                  </div>
                  <div className="decal -blink -striped"></div>
                </div>
                <p className="text-glow font-cascadia">
                  DEPTH : {agi.readableDepth} Km
                </p>
              </div>
              <div className="bordered p-2 w-full font-cascadia">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-left">TIME</td>
                      <td className="text-right">{agi.readableTime}</td>
                    </tr>
                    <tr>
                      <td className="text-left">MAG</td>
                      <td className="text-right">
                        {Number(agi.mag).toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">DEPTH</td>
                      <td className="text-right">{agi.depth}</td>
                    </tr>
                    <tr>
                      <td className="text-left">LAT</td>
                      <td className="text-right">{agi.infoGempa.lat}</td>
                    </tr>
                    <tr>
                      <td className="text-left">LNG</td>
                      <td className="text-right">{agi.infoGempa.lng}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 bordered w-full">
              <p className="text-glow p-2 break-words font-cascadia">
                {agi.infoGempa.message}
              </p>
            </div>
          </div>

          {/* {agi.mag >= 5 && (
            <div
              className="red-bordered p-2 overflow-y-auto custom-scrollbar mt-2 pointer-events-auto"
              style={{ maxHeight: "20vh" }}
            >
              <ul>
                {agi.infoGempa.listKotaTerdampak?.map((kota, idx) => (
                  <li
                    key={idx}
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
      ))}
    </>
  );
};

export default GempaAlertList;
