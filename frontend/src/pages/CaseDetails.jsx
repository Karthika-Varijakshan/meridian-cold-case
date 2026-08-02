import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderLock,
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Shield,
  FileText,
  MessageSquare,
  FileCheck,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { getCaseById } from '../services/api';

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadDetail() {
      const data = await getCaseById(id || 'CASE-1994-082');
      setCaseData(data);
    }
    loadDetail();
  }, [id]);

  if (!caseData) {
    return (
      <div className="p-8 text-center text-gray-400 font-mono">
        Loading investigation file {id}...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button & Title Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/cases')}
          className="p-2 rounded-lg bg-[#161B22] border border-[#232B36] text-gray-400 hover:text-white hover:border-[#C9902E] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#C9902E] font-bold bg-[#C9902E]/10 px-2 py-0.5 rounded border border-[#C9902E]/30">
              {caseData.id}
            </span>
            <span className="text-xs font-mono text-gray-400">
              LEO FILE #{caseData.id.replace('CASE-', '')}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-white mt-1">
            {caseData.title}
          </h1>
        </div>
      </div>

      {/* Overview Cards & Reopen Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-[#232B36]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Reopen Priority Score</span>
          <p className="text-2xl font-bold font-mono text-[#C9902E] mt-1">{caseData.reopen_score}%</p>
          <span className="text-[11px] text-gray-400">LangGraph AI Recommendation</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#232B36]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Crime Category</span>
          <p className="text-sm font-bold font-mono text-white mt-1">{caseData.crime_type}</p>
          <span className="text-[11px] text-gray-400">{caseData.location}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#232B36]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Investigator</span>
          <p className="text-sm font-bold font-mono text-white mt-1">{caseData.lead_investigator}</p>
          <span className="text-[11px] text-gray-400">Date: {caseData.date}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[#232B36] flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Status & Actions</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#D15B5B]/20 text-[#D15B5B] border border-[#D15B5B]/30">
              {caseData.status}
            </span>
            <button
              onClick={() => navigate('/ai-analysis')}
              className="px-3 py-1 bg-[#C9902E] text-black font-mono font-bold text-xs rounded shadow-goldGlow hover:bg-[#E0A33B]"
            >
              Analyze Case
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-[#232B36] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#C9902E]/20 text-[#C9902E] border border-[#C9902E]/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Case Narrative & MO
        </button>
        <button
          onClick={() => setActiveTab('witnesses')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'witnesses'
              ? 'bg-[#C9902E]/20 text-[#C9902E] border border-[#C9902E]/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Witness Statements ({caseData.witness_statements?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'evidence'
              ? 'bg-[#C9902E]/20 text-[#C9902E] border border-[#C9902E]/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Physical & Forensic Evidence ({caseData.evidence?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-[#232B36] space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#C9902E] uppercase">Investigative Narrative</h3>
            <p className="text-sm text-gray-200 leading-relaxed font-sans">{caseData.summary}</p>

            <div className="pt-4 border-t border-[#232B36]">
              <h3 className="text-sm font-bold font-mono text-[#3FA9A0] uppercase mb-2">Modus Operandi (MO) Profile</h3>
              <div className="p-3 bg-[#0D1016] border border-[#232B36] rounded-lg text-xs font-mono text-gray-300 leading-relaxed">
                {caseData.mo_description || 'Tactical heists involving power line cuts, thermite incendiary breaches, and suppressed 9mm NATO rounds.'}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-[#232B36] space-y-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C9902E]" />
              <span>Cross-Case Correlations</span>
            </h3>
            <p className="text-xs text-gray-400">
              LangGraph correlation engine detected direct link to {caseData.linked_cases?.length || 3} other investigations.
            </p>
            <div className="space-y-2 pt-2">
              {caseData.linked_cases?.map((lc) => (
                <div
                  key={lc}
                  onClick={() => navigate(`/cases/${lc}`)}
                  className="p-2.5 bg-[#0D1016] border border-[#232B36] hover:border-[#C9902E] rounded-lg cursor-pointer flex items-center justify-between text-xs font-mono text-gray-300"
                >
                  <span>{lc}</span>
                  <span className="text-[10px] text-[#3FA9A0]">Linked MO</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'witnesses' && (
        <div className="space-y-3">
          {caseData.witness_statements?.length > 0 ? (
            caseData.witness_statements.map((ws) => (
              <div key={ws.id} className="glass-panel p-5 rounded-xl border border-[#232B36] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white text-sm">{ws.witness_name} ({ws.role})</span>
                  <span className="text-gray-500">{ws.date}</span>
                </div>
                <p className="text-xs text-gray-300 italic font-mono bg-[#0D1016] p-3 rounded border border-[#232B36]">
                  "{ws.statement}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 font-mono text-xs">
              No witness statements logged for this case file.
            </div>
          )}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseData.evidence?.length > 0 ? (
            caseData.evidence.map((ev) => (
              <div key={ev.id} className="glass-panel p-5 rounded-xl border border-[#232B36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#C9902E]">{ev.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3FA9A0]/20 text-[#3FA9A0]">
                    {ev.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{ev.name}</h4>
                <p className="text-xs text-gray-400 font-mono">Type: {ev.type} • Found: {ev.location}</p>
                {ev.ocr_text && (
                  <div className="mt-2 p-2.5 bg-[#0D1016] border border-[#232B36] rounded text-[11px] font-mono text-emerald-400">
                    <span className="text-[9px] uppercase text-gray-500 block mb-0.5">OCR Text Extract</span>
                    {ev.ocr_text}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 font-mono text-xs col-span-2">
              No specific physical evidence cataloged.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
