// src/component/league/NextButton.tsx
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function NextButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2563EB] px-6 py-4 font-[iranBold] text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1d4ed8]"
    >
      {children}
      <ArrowLeft
        size={20}
        className="transition-transform group-hover:-translate-x-1"
      />
    </motion.button>
  );
}