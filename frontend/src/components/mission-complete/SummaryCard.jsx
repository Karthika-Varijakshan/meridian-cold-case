import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Activity, Gauge, Timer, FileCheck2, Target } from 'lucide-react';

export default function SummaryCard({ session }) {
  const hasCase = Boolean(session?.caseId);

  const rows = hasCase
    ? [
        { icon: FileText, label: 'Case ID', value: session.caseId },
        { icon: Activity, label: 'Investigation Status', value: session.status || 'Analyzed' },
        { icon: Gauge, label: 'AI Confidence Score', value: session.confidence != null ? `${session.confidence}%` : '—' },
        { icon: Timer, label: 'Analysis Time', value: session.analysisTime || '< 1s' },
        { icon: FileCheck2, label: 'Generated Report', value: session.reportGenerated ? 'Yes' : 'No' },
        { icon: Target, label: 'Recommendation', value: session.recommendation || '—' },
      ]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="glass-panel-gold rounded-2xl p-7 max-w-xl mx-auto"
    >
      <p className="text-[11px] font-mono tracking-[0.3em] text-[#C9902E] uppercase mb-5 text-center">
        Mission Summary
      </p>

      {hasCase ? (
        <div className="space-y-4">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between border-b border-[#232B36] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center space-x-2.5 text-gray-400">
                  <Icon className="w-4 h-4 text-[#3FA9A0]" />
                  <span className="text-sm">{row.label}</span>
                </div>
                <span className="text-sm font-mono font-semibold text-white text-right">{row.value}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            No specific investigation is attached to this session — this summary appears when you
            exit after analyzing a case. Head to AI Analysis to run one, or review platform-wide
            totals in the statistics above.
          </p>
        </div>
      )}
    </motion.div>
  );
}
