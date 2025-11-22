import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  imageUrl: string; // imagem original retornada pela API
  preprocessadaImageUrl?: string;
  superpixelImageUrl?: string;
  segmentedImage?: string; // mantido para compatibilidade com a UI atual
  superpixels: number;
  tipoLesao?: string;
  message?: string;
  diagnosis: Diagnosis;
  hasCancer: boolean;
  type: 'malignant' | 'benign' | null;
  confidence: number;
  date: string;
}

export interface Diagnosis {
  prediction: string;
  predicted_class_id: number;
  confidence: number;
  confidence_malignant: number;
  confidence_benign: number;
  error: string | null;
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isLoading: boolean;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  history: [],
  isLoading: false,

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  addToHistory: (analysis) => 
    set((state) => ({ 
      history: [analysis, ...state.history],
      currentAnalysis: analysis
    })),

  setLoading: (loading) => set({ isLoading: loading })
}));
