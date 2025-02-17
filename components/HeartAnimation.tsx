"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function HeartAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <Heart className="w-32 h-32 text-primary fill-primary" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
