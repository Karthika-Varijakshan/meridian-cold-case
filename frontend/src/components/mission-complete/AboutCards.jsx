import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Clock, Network, Flame, Fingerprint, FileText } from 'lucide-react';

const ITEMS = [
  { icon: Bot, label: 'AI Investigation' },
  { icon: Clock, label: 'Timeline Intelligence' },
  { icon: Network, label: 'Relationship Graphs' },
  { icon: Flame, label: 'Crime Pattern Discovery' },
  { icon: Fingerprint, label: 'Case Similarity' },
  { icon: FileText, label: 'Investigation Reports' },
];

export default function AboutCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="glass-panel rounded-xl p-5 text-center"
          >
            <Icon className="w-5 h-5 text-[#C9902E] mx-auto mb-2.5" />
            <p className="text-xs font-medium text-gray-300">{item.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
