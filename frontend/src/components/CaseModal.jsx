import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { uploadCase } from '../services/api';

export default function CaseModal({ isOpen, onClose, onCaseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    crime_type: 'Homicide',
    priority: 'High',
    status: 'Cold',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    lead_investigator: '',
    summary: '',
    mo_description: '',
    witness_statements: [],
    evidence: []
  });

  const [statementInput, setStatementInput] = useState({ witness_name: '', role: '', statement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAddWitness = () => {
    if (!statementInput.witness_name || !statementInput.statement) return;
    setFormData(prev => ({
      ...prev,
      witness_statements: [
        ...prev.witness_statements,
        { id: `WS-${Date.now()}`, ...statementInput, date: new Date().toISOString().slice(0, 10) }
      ]
    }));
    setStatementInput({ witness_name: '', role: '', statement: '' });
  };

  const handleRemoveWitness = (id) => {
    setFormData(prev => ({
      ...prev,
      witness_statements: prev.witness_statements.filter(w => w.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      setError('Title and location are required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await uploadCase(formData);
      if (onCaseAdded) onCaseAdded(res.case);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#161B22] border border-[#232B36] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        <div className="p-5 border-b border-[#232B36] flex items-center justify-between bg-[#0D1016]">
          <div className="flex items-center space-x-2.5">
            <Upload className="w-5 h-5 text-[#C9902E]" />
            <h2 className="text-lg font-bold font-mono text-white">Ingest New Case File</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#232B36]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-[#D15B5B]/10 border border-[#D15B5B]/30 rounded-lg flex items-center space-x-2 text-xs text-[#D15B5B]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Case Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Southside Dock Warehouse Burglary"
              className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Crime Type</label>
              <select
                value={formData.crime_type}
                onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
              >
                <option value="Homicide">Homicide</option>
                <option value="Armed Robbery">Armed Robbery</option>
                <option value="Arson / Homicide">Arson / Homicide</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Weapons Trafficking">Weapons Trafficking</option>
                <option value="Cargo Theft">Cargo Theft</option>
                <option value="Financial Crime">Financial Crime</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Lead Investigator</label>
            <input
              type="text"
              value={formData.lead_investigator}
              onChange={(e) => setFormData({ ...formData, lead_investigator: e.target.value })}
              placeholder="Det. Name"
              className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Case Summary</label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Narrative overview of crime scene and initial findings..."
              className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase mb-1">MO Signature Description</label>
            <textarea
              rows={2}
              value={formData.mo_description}
              onChange={(e) => setFormData({ ...formData, mo_description: e.target.value })}
              placeholder="e.g. 2-person squad, cut power lines, thermite ignition, 9mm suppressed rounds..."
              className="w-full bg-[#0D1016] border border-[#232B36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9902E]"
            />
          </div>

          {/* Witness Statements Sub-section */}
          <div className="pt-2 border-t border-[#232B36]">
            <span className="block text-xs font-mono text-gray-300 uppercase mb-2">Add Witness Statement</span>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Witness Name"
                value={statementInput.witness_name}
                onChange={(e) => setStatementInput({ ...statementInput, witness_name: e.target.value })}
                className="bg-[#0D1016] border border-[#232B36] rounded px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Role (e.g. Security Guard)"
                value={statementInput.role}
                onChange={(e) => setStatementInput({ ...statementInput, role: e.target.value })}
                className="bg-[#0D1016] border border-[#232B36] rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Statement summary & entity mentions..."
                value={statementInput.statement}
                onChange={(e) => setStatementInput({ ...statementInput, statement: e.target.value })}
                className="flex-1 bg-[#0D1016] border border-[#232B36] rounded px-2.5 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddWitness}
                className="px-3 py-1 bg-[#3FA9A0]/20 text-[#3FA9A0] border border-[#3FA9A0]/40 rounded text-xs hover:bg-[#3FA9A0]/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formData.witness_statements.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {formData.witness_statements.map((ws) => (
                  <div key={ws.id} className="flex items-center justify-between p-2 bg-[#0D1016] rounded border border-[#232B36] text-xs">
                    <div>
                      <span className="font-semibold text-gray-200">{ws.witness_name}</span> ({ws.role}): "{ws.statement}"
                    </div>
                    <button type="button" onClick={() => handleRemoveWitness(ws.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#232B36] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#232B36] text-gray-300 text-xs font-semibold hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#C9902E] text-black font-mono font-bold text-xs shadow-goldGlow hover:bg-[#E0A33B] disabled:opacity-50"
            >
              {submitting ? 'Ingesting...' : 'Ingest & Trigger AI Analysis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
