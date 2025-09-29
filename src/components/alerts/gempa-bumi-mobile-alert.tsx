// src/components/alerts/GempaBumiMobileAlert.tsx
import React from "react";
import Card from "../cards/card";
import TitikGempa from "../marker/titik_gempa";

interface Props {
  data: TitikGempa;
}

const GempaBumiMobileAlert: React.FC<Props> = ({ data }) => {
  return (
    <Card
      title={
        <div className="overflow-hidden">
          <div className="strip-wrapper">
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
            <div className="strip-bar loop-strip-reverse anim-duration-20"></div>
          </div>
          <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <p className="p-1 bg-black font-bold text-xs text-glow">
              GEMPA BUMI
            </p>
          </div>
        </div>
      }
      className="block md:hidden show-pop-up fixed bottom-10 md:top-6 left-0 card-warning right-0 md:left-6 md:w-1/4 lg:w-1/5"
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
                <div className="text -characters">{data.readableMag}</div>
                <div className="text">MAG</div>
              </div>
              <div className="decal -blink -striped"></div>
            </div>
            <p className="text-glow font-bold">DEPTH : {data.readableDepth} KM</p>
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
          <p className="text-glow p-2 break-words">{data.infoGempa.message}</p>
        </div>
      </div>
    </Card>
  );
};

export default GempaBumiMobileAlert;
