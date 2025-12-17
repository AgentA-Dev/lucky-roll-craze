import { motion } from "framer-motion";

interface RollButtonProps {
  onClick: () => void;
  isRolling: boolean;
  isSuperRoll?: boolean;
}

const RollButton = ({ onClick, isRolling, isSuperRoll = false }: RollButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isRolling}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-16 py-6 font-display text-2xl font-bold uppercase tracking-wider
                 rounded-xl transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 border-2 ${
                   isSuperRoll
                     ? 'bg-accent text-accent-foreground border-accent/50 hover:border-accent box-glow-accent'
                     : 'bg-primary text-primary-foreground border-primary/50 hover:border-primary box-glow-primary animate-pulse-glow'
                 }`}
    >
      <span className="relative z-10">
        {isRolling ? "Rolling..." : isSuperRoll ? "SUPER!" : "Roll"}
      </span>
      <div className={`absolute inset-0 rounded-xl blur-xl -z-10 ${
        isSuperRoll ? 'bg-accent/20' : 'bg-primary/20'
      }`} />
    </motion.button>
  );
};

export default RollButton;
