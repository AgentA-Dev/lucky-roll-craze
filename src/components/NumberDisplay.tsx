import { motion, AnimatePresence } from "framer-motion";

interface NumberDisplayProps {
  number: number | null;
  isRare: boolean;
}

const NumberDisplay = ({ number, isRare }: NumberDisplayProps) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getRarityColor = () => {
    if (!number) return "";
    if (number >= 1_000_000_000) return "text-accent text-glow-accent"; // Billion+
    if (number >= 100_000_000) return "text-secondary"; // 100M+
    if (number >= 1_000_000) return "text-primary text-glow-primary"; // 1M+
    if (number >= 10_000) return "text-primary"; // 10K+
    return "text-foreground";
  };

  return (
    <div className="min-h-[120px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {number !== null ? (
          <motion.div
            key={number}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className={`font-display text-4xl md:text-6xl font-bold ${getRarityColor()} ${isRare ? 'animate-rare-glow p-4 rounded-xl' : ''}`}
          >
            {formatNumber(number)}
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
