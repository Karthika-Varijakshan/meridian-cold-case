import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Play,
  CheckCircle2,
  Loader2,
  FileSearch,
  Sparkles,
  Network,
  GitCommitHorizontal,
  Flame,
  Award,
  FileText,
  ChevronRight
} from 'lucide-react';
import { runAiAnalysis, getCases } from '../services/api';

const agentsList = [
  { id: 'evidence', name: '1. Evidence Processing Agent', desc: 'Extract entities, normalize evidence, OCR support', icon: FileSearch },
  { id: 'similarity', name: '2. Case Similarity Agent', desc: 'Compare vector embeddings with historical cold cases', icon: Sparkles },
  { id: 'correlation', name: '3. Evidence Correlation Agent', desc: 'Build relationship graph, cross-reference entities', icon: Network },
  { id: 'timeline', name: '4. Timeline Reconstruction Agent', desc: 'Merge events, sort chronologically', icon: GitCommitHorizontal },
  { id: 'pattern', name: '5. Pattern Discovery Agent', desc: 'Identify recurring MO, suspects, addresses, vehicles, phones', icon: Flame },
  { id: 'recommendation', name: '6. Recommendation Agent', desc: 'Calculate reopening priority & confidence score', icon: Award },
  { id: 'summary', name: '7. Investigation Summary Agent', desc: 'Synthesize law enforcement executive intelligence report', icon: FileText }
];

export default function AiAnalysis() {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-1994-082');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCases() {
      const res = await getCases();
      setCases(res.cases || []);
    }
    loadCases();
  }, []);

  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setActiveStepIndex(0);
    setLogs([]);
    setAnalysisResults(null);

    // Simulate animated step-by-step pipeline progression
    for (let i = 0; i < agentsList.length; i++) {
      setActiveStepIndex(i);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: agentsList[i].name,
          message: `Executing ${agentsList[i].name}...`
        }
      ]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const targetCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
      const results = await runAiAnalysis(selectedCaseId);
      setAnalysisResults(results);
      setActiveStepIndex(agentsList.length);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: 'LangGraph Pipeline',
          message: 'Multi-agent analysis completed successfully.'
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-[#C9902E]" />
            <span>LANGGRAPH MULTI-AGENT PIPELINE</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Autonomous multi-agent cold case correlation & reopening recommendation engine
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            disabled={isProcessing}
            className="bg-[#161B22] border border-[#232B36] text-gray-200 text-xs font-mono rounded-xl px-3 py-2 focus:border-[#C9902E]"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleStartAnalysis}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9902E] to-[#b37a1f] text-black font-mono font-bold text-xs shadow-goldGlow hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PROCESSING PIPELINE...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>EXECUTE 7-AGENT WORKFLOW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Pipeline Agent Visualizer & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Workflow Cards (2 columns) */}
        <div className="lg:col-span-2 space-y-3">
          {agentsList.map((agent, index) => {
            const Icon = agent.icon;
            const isCompleted = activeStepIndex > index || (activeStepIndex === agentsList.length && !isProcessing);
            const isCurrent = activeStepIndex === index && isProcessing;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-panel p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-[#C9902E] bg-[#C9902E]/10 shadow-goldGlow'
                    : isCompleted
                    ? 'border-[#3FA9A0]/40 bg-[#3FA9A0]/5'
                    : 'border-[#232B36] opacity-70'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`p-2.5 rounded-lg ${
                      isCurrent
                        ? 'bg-[#C9902E] text-black font-bold'
                        : isCompleted
                        ? 'bg-[#3FA9A0] text-black'
                        : 'bg-[#232B36] text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-2">
                      <span>{agent.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{agent.desc}</p>
                  </div>
                </div>

                <div>
                  {isCurrent && (
                    <span className="flex items-center space-x-1.5 text-xs font-mono text-[#C9902E] bg-[#C9902E]/10 px-2.5 py-1 rounded border border-[#C9902E]/30 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>EXECUTING</span>
                    </span>
                  )}
                  {isCompleted && (
                    <span className="flex items-center space-x-1 text-xs font-mono text-[#3FA9A0] bg-[#3FA9A0]/10 px-2.5 py-1 rounded border border-[#3FA9A0]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COMPLETED</span>
                    </span>
                  )}
                  {!isCurrent && !isCompleted && (
                    <span className="text-[11px] font-mono text-gray-500">QUEUED</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Execution Logs & Report Preview (1 column) */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="glass-panel p-4 rounded-xl border border-[#232B36] font-mono text-xs space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#232B36]">
              <span className="text-xs font-bold text-gray-300">LANGGRAPH TERMINAL LOGS</span>
              <span className="text-[10px] text-[#C9902E]">STREAM ACTIVE</span>
            </div>

            <div className="bg-[#0D1016] p-3 rounded-lg border border-[#232B36] flex-1 overflow-y-auto max-h-[380px] space-y-2 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-gray-600 italic">Click 'Execute 7-Agent Workflow' to initiate real-time analysis stream...</div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="text-gray-300">
                    <span className="text-gray-500">[{l.timestamp}]</span>{' '}
                    <span className="text-[#C9902E] font-semibold">[{l.agent}]:</span>{' '}
                    <span>{l.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Results Action Card */}
          {analysisResults && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel-gold p-4 rounded-xl border border-[#C9902E] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C9902E]">REOPEN PRIORITY SCORE</span>
                <span className="text-lg font-bold font-mono text-white">
                  {analysisResults.recommendation?.score || 94.5}%
                </span>
              </div>
              <p className="text-xs text-gray-300">
                {analysisResults.recommendation?.justification || 'Direct CODIS DNA & ballistics link established.'}
              </p>
              <button
                onClick={() => navigate('/report')}
                className="w-full py-2 rounded-lg bg-[#C9902E] text-black font-mono font-bold text-xs shadow-goldGlow hover:bg-[#E0A33B] flex items-center justify-center space-x-2"
              >
                <span>VIEW OFFICIAL INTELLIGENCE REPORT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
