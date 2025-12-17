import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "luck" | "counter";
}

const StatCard = ({ label, value, icon, variant = "default" }: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "luck":
        return "border-accent/30 hover:border-accent/60";
      case "counter":
        return "border-primary/30 hover:border-primary/60";
      default:
        return "border-border hover:border-muted-foreground";
    }
  };

  const getValueStyles = () => {
    switch (variant) {
      case "luck":
        return "text-accent text-glow-accent";
      case "counter":
        return "text-primary text-glow-primary";
      default:
        return "text-foreground";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border-2 bg-card/50 backdrop-blur-sm
                  transition-all duration-300 ${getVariantStyles()}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm uppercase tracking-wider text-muted-foreground font-mono">
          {label}
        </span>
      </div>
      <p className={`text-3xl font-display font-bold ${getValueStyles()}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
};

export default StatCard;
