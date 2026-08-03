import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { FolderCheck, Bot, Tags, Share2, GitCommitHorizontal, FileCheck2 } from 'lucide-react';

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsGrid({ stats }) {
  const items = [
    { icon: FolderCheck, label: 'Cases Analysed', value: stats.casesAnalysed, suffix: '' },
    { icon: Bot, label: 'AI Agents Executed', value: stats.agentsExecuted, suffix: '' },
    { icon: Tags, label: 'Entities Identified', value: stats.entitiesIdentified, suffix: '' },
    { icon: Share2, label: 'Relationships Discovered', value: stats.relationshipsDiscovered, suffix: '' },
    { icon: GitCommitHorizontal, label: 'Timeline Events', value: stats.timelineEvents, suffix: '' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel rounded-xl p-4 text-center"
          >
            <Icon className="w-4 h-4 text-[#3FA9A0] mx-auto mb-2" />
            <div className="text-2xl font-bold font-mono text-[#C9902E]">
              <Counter value={item.value} />
              {item.suffix}
            </div>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">{item.label}</p>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 5 * 0.08 }}
        className="glass-panel-gold rounded-xl p-4 text-center"
      >
        <FileCheck2 className="w-4 h-4 text-[#C9902E] mx-auto mb-2" />
        <div className="text-lg font-bold text-[#C9902E]">
          {stats.reportGenerated ? 'Generated' : 'Pending'}
        </div>
        <p className="text-[10px] text-gray-500 mt-1 leading-tight">Investigation Report</p>
      </motion.div>
    </div>
  );
}
