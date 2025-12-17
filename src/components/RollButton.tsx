import { motion } from "framer-motion";

interface RollButtonProps {
  onClick: () => void;
  isRolling: boolean;
}

const RollButton = ({ onClick, isRolling }: RollButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isRolling}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-16 py-6 font-display text-2xl font-bold uppercase tracking-wider
                 bg-primary text-primary-foreground rounded-xl
                 box-glow-primary animate-pulse-glow
                 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 border-2 border-primary/50
                 hover:border-primary"
    >
      <span className="relative z-10">
        {isRolling ? "Rolling..." : "Roll"}
      </span>
      <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10" />
    </motion.button>
  );
};

export default RollButton;
