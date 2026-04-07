"use client";

import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
}

export default function Template({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
