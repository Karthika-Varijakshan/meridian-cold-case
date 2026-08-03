import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function CinematicIntro({ onDone }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);   // logo appears
    const t2 = setTimeout(() => setStage(2), 1300);  // "MISSION COMPLETE" + scan
    const t3 = setTimeout(() => onDone(), 2600);      // reveal page
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: stage >= 1 ? 1 : 0.7, opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center shadow-goldGlow"
        >
          <ShieldCheck className="w-8 h-8 text-black" />
          {stage >= 2 && (
            <motion.div
              className="absolute inset-x-0 h-1 bg-[#3FA9A0]"
              initial={{ top: '0%', opacity: 0.9 }}
              animate={{ top: '100%', opacity: 0 }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {stage >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 font-mono font-bold tracking-[0.3em] text-white text-sm"
            >
              MISSION COMPLETE
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
