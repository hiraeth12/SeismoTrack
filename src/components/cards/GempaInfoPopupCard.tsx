// components/cards/GempaInfoPopupCard.tsx

import Card from "./card"; // Pastikan path-nya benar
import { InfoGempa } from "../libs/interface";

interface Props {
  data: InfoGempa;
}

export default function GempaInfoPopupCard({ data }: Props) {
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
      className="min-h-48 min-w-48 whitespace-pre-wrap font-cascadia"
    >
      <ul className="text-glow font-cascadia ">
        <li>Magnitudo&nbsp; : {Number(data.mag).toFixed(1)}</li>
        <li>Kedalaman&nbsp; : {data.depth}</li>
        <li>
          Tanggal&nbsp;&nbsp;&nbsp;&nbsp;: {new Date(data.time!).toLocaleDateString()}
        </li>
        <li>
          Waktu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
          {new Date(data.time!).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}{" "}
          WIB
        </li>
        <li>Lat&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.lat}</li>
        <li>Lng&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.lng}</li>
      </ul>
    </Card>
  );
}
