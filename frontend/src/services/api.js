import axios from 'axios';

// Local dev: relative '/api' works because vite.config.js proxies it to
// localhost:5000. In production, the frontend and backend are on
// different domains (e.g. Vercel + Render), so a relative path can't
// reach the backend — VITE_API_URL must be set to the deployed backend's
// full URL (e.g. https://meridian-backend.onrender.com/api) as an
// environment variable in your hosting provider's dashboard.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

export const getCases = async (params = {}) => {
  try {
    const response = await api.get('/cases', { params });
    return response.data;
  } catch (error) {
    console.warn('API connection failed, fallback to local data', error);
    return { total: 0, cases: [] };
  }
};

export const getCaseById = async (id) => {
  try {
    const response = await api.get(`/cases/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const uploadCase = async (caseData) => {
  try {
    const response = await api.post('/upload', caseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const runAiAnalysis = async (caseId) => {
  try {
    const response = await api.post('/analyze', { case_id: caseId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRelationshipGraph = async () => {
  try {
    const response = await api.get('/graph');
    return response.data;
  } catch (error) {
    return { nodes: [], edges: [], stats: {} };
  }
};

export const getTimeline = async () => {
  try {
    const response = await api.get('/timeline');
    return response.data;
  } catch (error) {
    return { total: 0, timeline: [] };
  }
};

export const getPatterns = async () => {
  try {
    const response = await api.get('/patterns');
    return response.data;
  } catch (error) {
    return { total: 0, patterns: [] };
  }
};

export const getIntelligenceReport = async (caseId = 'CASE-1994-082') => {
  try {
    const response = await api.get('/report', { params: { case_id: caseId } });
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
