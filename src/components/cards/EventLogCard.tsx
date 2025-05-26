// src/components/cards/EventLogCard.tsx
import React from "react";
import Card from "./card";
import TitikGempa from "../marker/titik_gempa";

interface Props {
  events: TitikGempa[];
  onSelect: (info: any) => void;
}

const EventLogCard: React.FC<Props> = ({ events, onSelect }) => {
  return (
    <Card
      title={
        <p className="font-bold text-glow-red text-sm text-center" style={{ color: "red" }}>
          EVENT LOG
        </p>
      }
      className="fixed right-6 md:right-2 top-1 md:top-3 card-float md:w-1/3 lg:w-1/5 show-pop-up pointer-events-auto font-cascadia"
    >
      <ul>
        {events.map((v, i) => (
          <li
            key={i}
            onClick={() => onSelect(v.infoGempa)}
            className="flex flex-col mb-2 list-event cursor-pointer slide-in-left"
            style={{
              animationDelay: `${i * 0.01}s`,
              transform: "translateX(-110%)",
              fontSize: "12px",
            }}
          >
            <span className="block mb-1 text-[11px] font-cascadia">
              {v.infoGempa.time} WIB
            </span>
            <div className="bordered p-2 overflow-hidden font-cascadia">
              {v.readableMag} Mag - {v.infoGempa.place || "unknown"}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default EventLogCard;
