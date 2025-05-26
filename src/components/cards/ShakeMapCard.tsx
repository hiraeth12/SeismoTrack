// src/components/cards/ShakeMapCard.tsx
import React from "react";
import Card from "./card";

interface Props {
  fileName: string;
  onClose: () => void;
}

const ShakeMapCard: React.FC<Props> = ({ fileName, onClose }) => {
  const url = `https://bmkg-content-inatews.storage.googleapis.com/${fileName}`;

  return (
    <Card
      title={
        <div className="relative w-full">
          <p className="text-glow-red text-sm text-center font-cascadia font-semibold">
            SHAKEMAP
          </p>
          <button
            onClick={onClose}
            className="absolute right-0 top-1 text-xs px-2"
          >
            X
          </button>
        </div>
      }
      className="show-pop-up pointer-events-auto"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt="Shakemap"
          width={300}
          style={{ filter: "invert(1)" }}
        />
      </a>
    </Card>
  );
};

export default ShakeMapCard;
