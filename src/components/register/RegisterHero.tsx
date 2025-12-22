import { motion } from "framer-motion";

const RegisterHero = () => (
  <div className="hidden lg:flex items-center justify-center p-12 bg-linear-to-br from-purple-900/30 to-blue-900/30 order-1 lg:order-2">
    <motion.div
      initial={{ scale: 0.9, rotate: -5 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <img
        src="../src/assets/Images/registerhero.png"
        alt="Join the discussion"
        className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#12181e] via-transparent to-transparent rounded-3xl" />
    </motion.div>
  </div>
);

export default RegisterHero;
