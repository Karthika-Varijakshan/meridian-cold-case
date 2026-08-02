import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const METRICS = [
  { value: 20, suffix: '+', label: 'Cold Cases' },
  { value: 100, suffix: '+', label: 'Evidence Files' },
  { value: 96, suffix: '%', label: 'Pattern Match' },
  { value: 31, suffix: ' Yrs', label: 'Historical Data' },
  { value: 9, suffix: '', label: 'AI Agents' },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {display}
      {suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <section className="relative py-24 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#C9902E] mb-1">
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 tracking-wide">{m.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <span className="inline-flex items-center space-x-2 text-xs font-mono text-[#3FA9A0] tracking-widest uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA9A0] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3FA9A0]" />
            </span>
            <span>Real-Time Intelligence</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
