import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const QUOTES = [
  'Every piece of evidence tells a story.',
  'The smallest clue can solve the biggest mystery.',
  'Artificial Intelligence empowers investigators — not replaces them.',
];

export default function QuoteRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-10">
      <Quote className="w-6 h-6 text-[#C9902E]/50 mx-auto mb-4" />
      <div className="h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 font-light italic"
          >
            "{QUOTES[index]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
