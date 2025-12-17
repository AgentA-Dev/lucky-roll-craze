import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

interface AutoRollButtonProps {
  isAutoRolling: boolean;
  onClick: () => void;
}

const AutoRollButton = ({ isAutoRolling, onClick }: AutoRollButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-4 font-display text-lg font-bold uppercase tracking-wider
                 rounded-xl border-2 transition-all duration-200
                 ${isAutoRolling 
                   ? 'bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30' 
                   : 'bg-muted/50 border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary'
                 }`}
    >
      <div className="flex items-center gap-2">
        <RotateCw className={`w-5 h-5 ${isAutoRolling ? 'animate-spin' : ''}`} />
        {isAutoRolling ? 'Stop' : 'Auto'}
      </div>
    </motion.button>
  );
};

export default AutoRollButton;
