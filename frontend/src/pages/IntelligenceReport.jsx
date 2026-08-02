import React, { useEffect, useState } from 'react';
import { Printer, Download, ShieldCheck, Award, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getIntelligenceReport } from '../services/api';
import { exportToCSV, printReportPage } from '../utils/exportUtils';

export default function IntelligenceReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      const data = await getIntelligenceReport('CASE-1994-082');
      setReportData(data);
      setLoading(false);
    }
    loadReport();
  }, []);

  if (loading || !reportData) {
    return <div className="p-8 text-center text-gray-400 font-mono">Generating Intelligence Report...</div>;
  }

  const { case: caseInfo, report, recommendation, patterns, extracted_entities } = reportData;

  const handleExportCSV = () => {
    const csvData = (report?.key_findings || []).map((kf, i) => ({
      Finding_Index: i + 1,
      Finding_Description: kf,
      Confidence: '94%',
      Case_Target: caseInfo.id
    }));
    exportToCSV(`MERIDIAN_Report_${caseInfo.id}`, csvData);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Actions (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#C9902E]" />
            <span>OFFICIAL INTELLIGENCE REPORT</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Command staff briefing & cold case reopening dossier
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#232B36] hover:bg-[#2c3746] text-gray-200 text-xs font-mono border border-[#3FA9A0]/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#3FA9A0]" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={printReportPage}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C9902E] text-black font-mono font-bold text-xs shadow-goldGlow hover:bg-[#E0A33B] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div id="report-document" className="glass-panel p-8 rounded-2xl border border-[#232B36] space-y-6">
        {/* Classification Header */}
        <div className="border-b-2 border-[#C9902E] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#D15B5B] uppercase font-bold block">
              {report?.classification || 'LAW ENFORCEMENT SENSITIVE // COLD CASE INTELLIGENCE'}
            </span>
            <h2 className="text-xl font-bold font-mono text-white mt-1">
              MERIDIAN COLD CASE REOPEN DOSSIER: {caseInfo?.title}
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Target ID: {caseInfo?.id} • Date Generated: {report?.date_generated}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#C9902E]/10 border border-[#C9902E] flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#C9902E]" />
          </div>
        </div>

        {/* Confidence & Reopen Score Banner */}
        <div className="p-4 rounded-xl bg-[#0D1016] border border-[#C9902E]/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase">Recommendation Priority Status</span>
            <h3 className="text-lg font-bold font-mono text-[#C9902E]">{recommendation?.reopen_priority}</h3>
            <p className="text-xs text-gray-300 mt-1 max-w-xl">{recommendation?.justification}</p>
          </div>

          <div className="text-right min-w-[140px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase">AI Confidence Index</span>
            <div className="text-3xl font-bold font-mono text-[#3FA9A0]">{recommendation?.score}%</div>
            {/* Visual Confidence Meter */}
            <div className="w-full bg-[#232B36] h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#3FA9A0] h-full rounded-full" style={{ width: `${recommendation?.score}%` }} />
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono text-[#C9902E] uppercase">1. Executive Summary</h3>
          <p className="text-xs text-gray-200 leading-relaxed font-sans bg-[#0D1016] p-4 rounded-xl border border-[#232B36]">
            {report?.executive_summary}
          </p>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-[#3FA9A0] uppercase">2. Key Findings & Cross-Case Corroboration</h3>
          <div className="space-y-2">
            {(report?.key_findings || []).map((kf, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3 rounded-lg bg-[#0D1016] border border-[#232B36] text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#3FA9A0] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{kf}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Investigative Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-[#D15B5B] uppercase">3. Recommended Command Actions</h3>
          <div className="space-y-2">
            {(report?.recommended_next_steps || []).map((action, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3 rounded-lg bg-[#0D1016] border border-[#232B36] text-xs text-gray-300 font-mono">
                <span className="text-[#C9902E] font-bold">{i + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Authorization Block */}
        <div className="pt-6 border-t border-[#232B36] flex items-center justify-between text-[11px] font-mono text-gray-400">
          <div>
            <p>Prepared By: MERIDIAN Multi-Agent Intelligence Engine</p>
            <p>Approved Command Staff: Det. Marcus Vance (Chicago Homicide Taskforce)</p>
          </div>
          <div className="text-right">
            <p className="text-[#C9902E] font-bold">DIGITALLY SEALED</p>
            <p>LEO Security Hash: 0x98A4...F12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
