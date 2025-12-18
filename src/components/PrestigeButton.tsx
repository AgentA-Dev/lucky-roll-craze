import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface PrestigeButtonProps {
  canPrestige: boolean;
  prestigeCount: number;
  voidPoints: number;
  onClick: () => void;
}

const PrestigeButton = ({ canPrestige, prestigeCount, voidPoints, onClick }: PrestigeButtonProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.button
        onClick={onClick}
        disabled={!canPrestige}
        className={`
          relative px-6 py-3 rounded-xl font-bold text-sm
          transition-all duration-300 flex items-center gap-2
          ${canPrestige 
            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30' 
            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }
        `}
        whileHover={canPrestige ? { scale: 1.05 } : {}}
        whileTap={canPrestige ? { scale: 0.95 } : {}}
      >
        <RotateCcw className="w-4 h-4" />
        <span>PRESTIGE</span>
        {canPrestige && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
      
      <div className="flex gap-4 text-xs font-mono">
        <span className="text-muted-foreground">
          Rebirths: <span className="text-violet-400">{prestigeCount}</span>
        </span>
        <span className="text-muted-foreground">
          Void Points: <span className="text-purple-400">{voidPoints}</span>
        </span>
      </div>
      
      {!canPrestige && (
        <p className="text-[10px] text-muted-foreground font-mono">
          Reach 1B+ to prestige
        </p>
      )}
    </motion.div>
  );
};

export default PrestigeButton;
