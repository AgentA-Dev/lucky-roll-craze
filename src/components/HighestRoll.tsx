import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface HighestRollProps {
  highest: number;
}

const HighestRoll = ({ highest }: HighestRollProps) => {
  if (highest === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-4 rounded-xl border border-accent/20 bg-accent/5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center gap-3">
        <Trophy className="w-5 h-5 text-accent" />
        <span className="text-sm uppercase tracking-wider text-muted-foreground font-mono">
          Highest Roll
        </span>
        <Trophy className="w-5 h-5 text-accent" />
      </div>
      <p className="text-2xl font-display font-bold text-accent text-glow-accent text-center mt-2">
        {highest.toLocaleString()}
      </p>
    </motion.div>
  );
};

export default HighestRoll;
