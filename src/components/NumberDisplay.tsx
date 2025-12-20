import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface NumberDisplayProps {
  number: number | null;
  isRare: boolean;
}

const NumberDisplay = ({ number, isRare }: NumberDisplayProps) => {
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const prevNumberRef = useRef<number | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getRarityColor = (num: number) => {
    if (num >= 1_000_000_000) return "text-accent text-glow-accent"; // Billion+
    if (num >= 100_000_000) return "text-secondary"; // 100M+
    if (num >= 1_000_000) return "text-primary text-glow-primary"; // 1M+
    if (num >= 10_000) return "text-primary"; // 10K+
    return "text-foreground";
  };

  useEffect(() => {
    // Only animate if we have a new number different from previous
    if (number !== null && number !== prevNumberRef.current) {
      prevNumberRef.current = number;
      setIsAnimating(true);

      // Clear any existing animation
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      const duration = 2000; // 2 seconds
      const intervalTime = 80; 
      const totalSteps = Math.floor(duration / intervalTime);
      let currentStep = 0;

      animationRef.current = setInterval(() => {
        currentStep++;
        
        if (currentStep >= totalSteps) {
          setDisplayNumber(number);
          setIsAnimating(false);
          if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
          }
          return;
        }

        const progress = currentStep / totalSteps;
        const maxForStep = Math.floor(number * Math.pow(progress, 0.5));
        const minForStep = Math.floor(maxForStep * 0.3);
        const randomNum = Math.floor(Math.random() * (maxForStep - minForStep + 1)) + minForStep;
        setDisplayNumber(Math.max(1, randomNum));
      }, intervalTime);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [number]);

  return (
    <div className="min-h-[120px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {displayNumber !== null ? (
          <motion.div
            key={isAnimating ? 'rolling' : 'final'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: isAnimating ? [0, -2, 2, -1, 1, 0] : 0,
            }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              x: { duration: 0.1, repeat: isAnimating ? Infinity : 0 }
            }}
            className={`font-display text-4xl md:text-6xl font-bold ${getRarityColor(displayNumber)} ${
              !isAnimating && isRare ? 'animate-rare-glow p-4 rounded-xl' : ''
            }`}
          >
            {formatNumber(displayNumber)}
            {isAnimating && (
              <span className="ml-2 text-muted-foreground animate-pulse">...</span>
            )}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-xl font-mono"
          >
            Click roll to start
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NumberDisplay;
