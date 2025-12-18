import { motion } from "framer-motion";
import agentsLogo from "@/assets/agents-rng-logo.png";

const LogoHeader = () => {
  return (
    <div className="relative flex items-center justify-center mb-8">
      {/* Sparkles around the logo */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${50 + Math.cos(i * Math.PI / 4) * 45}%`,
            top: `${50 + Math.sin(i * Math.PI / 4) * 45}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Additional floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-0.5 h-0.5 bg-primary rounded-full"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Glow effect behind logo */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-2xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo image with transparent background effect */}
      <div className="relative z-10 bg-transparent">
        <motion.img
          src={agentsLogo}
          alt="Agents RNG"
          className="h-16 md:h-20 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          style={{ 
            mixBlendMode: 'screen',
            filter: 'brightness(1.3)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default LogoHeader;
