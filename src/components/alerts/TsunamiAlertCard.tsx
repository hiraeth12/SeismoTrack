// src/components/alerts/TsunamiAlertCard.tsx
import React, { useState } from "react";
import Card from "../cards/card";
import ItemKotaTerdampak from "../ItemKotaTerdampak";
import TitikTsunami from "../marker/titik_tsunami";
import { X } from "lucide-react";


interface Props {
  data: TitikTsunami;
}

const TsunamiAlertCard: React.FC<Props> = ({ data }) => {
  const level = data.infoTsunami.level ?? "";

  const [visible, setVisible] = useState(true);

  if (!visible) return null;

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
              PERINGATAN TSUNAMI
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1 right-1 text-red-800 w-5 h-5 flex items-center justify-center z-10"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      }
      footer={
        <div className="flex justify-center w-full">
          <span>{level}</span>
        </div>
      }
      className="hidden md:block show-pop-up md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 pointer-events-auto"
    >
      <div
        className="flex flex-col w-full justify-center items-center text-glow text-sm"
        style={{ fontSize: "10px" }}
      >
        <div className="mt-2 bordered w-full">
          <p className="text-glow p-2 break-words font-cascadia">
            {data.infoTsunami.message}
          </p>
        </div>
      </div>

      {(level.includes("PD-1") || level.includes("PD-2")) 
        // <div
        //   className="red-bordered p-2 overflow-y-auto custom-scrollbar mt-2 pointer-events-auto"
        //   style={{ maxHeight: "20vh" }}
        // >
        //   <ul>
        //     {data.infoTsunami.listKotaTerdampak?.map((kota, i) => (
        //       <li
        //         key={i}
        //         className="flex flex-grow justify-between items-center mb-2 item-daerah slide-in-left"
        //       >
        //         <ItemKotaTerdampak kota={kota} />
        //       </li>
        //     ))}
        //   </ul>
        // </div>
      }
    </Card>
  );
};

export default TsunamiAlertCard;
