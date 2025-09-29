// src/components/ui/TestButtons.tsx
import React from "react";
import SimulateGempaButton from "./simulate-gempa-button";
import SimulateTsunamiButton from "./simulate-tsunami-button";
import BackToHomeButton from "./home-button";

interface Props {
  onTestGempa: () => void;
  onTestTsunami: () => void;
}

const TestButtons: React.FC<Props> = ({ onTestGempa, onTestTsunami }) => {
  return (
    <div className="fixed top-12 w-fit md:bottom-auto md:top-2 left-0 right-0 m-auto flex flex-row justify-center items-center gap-2 pointer-events-auto">
      <SimulateGempaButton onClick={onTestGempa} />
      <SimulateTsunamiButton onClick={onTestTsunami} />
      <BackToHomeButton />
    </div>
  );
};

export default TestButtons;
