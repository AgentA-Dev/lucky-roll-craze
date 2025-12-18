import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface VoidShopButtonProps {
  onClick: () => void;
  voidPoints: number;
}

const VoidShopButton = ({ onClick, voidPoints }: VoidShopButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 hover:border-violet-500/70 transition-all font-mono text-sm"
    >
      <Flame className="w-4 h-4 text-violet-400" />
      <span className="text-violet-300">Void</span>
      <span className="text-violet-400 font-bold">{voidPoints}</span>
    </motion.button>
  );
};

export default VoidShopButton;
