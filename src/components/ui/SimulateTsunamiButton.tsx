// components/SimulateGempaButton.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves } from "lucide-react";

interface SimulateTsunamiButtonProps {
  onClick: () => void;
}

export default function SimulateTsunamiButton({
  onClick,
}: SimulateTsunamiButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setIsClicked(true);
    onClick?.();

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative overflow-hidden w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95 flex items-center justify-center"
      whileHover={{
        x: [0, -1, 1, -1, 1, 0],
        transition: {
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      }}
      whileTap={{ scale: 0.95 }}
      animate={
        isClicked
          ? {
              x: [0, -2, 2, -2, 2, -1, 1, 0],
              y: [0, -1, 1, -1, 1, 0],
              transition: { duration: 0.4, ease: "easeInOut" },
            }
          : {}
      }
    >
      {/* Ripple */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        <motion.div
          animate={
            isClicked
              ? {
                  rotate: [0, -5, 5, -5, 5, 0],
                  transition: { duration: 0.4 },
                }
              : {}
          }
        >
          <Waves className="w-4 h-4" />
        </motion.div>
        {/* <span>TEST TSUNAMI</span> */}
      </div>

      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl"
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}
