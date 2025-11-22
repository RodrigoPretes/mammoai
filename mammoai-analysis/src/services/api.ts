import axios from 'axios';
import { AnalysisResult } from '@/store/analysisStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const authData = JSON.parse(token);
    if (authData.state?.token) {
      config.headers.Authorization = `Bearer ${authData.state.token}`;
    }
  }
  return config;
});

export const analyzeImage = async (
  imageFile: File,
  superpixels: number,
  tipoLesao: 'CALC' | 'MASS' = 'CALC'
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('n_superpixels', superpixels.toString());
  formData.append('tipo_lesao', tipoLesao);

  const response = await api.post('/upload-experimento/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const diagnosis = response.data?.diagnosis ?? {};
  const confidenceRaw = parseFloat(diagnosis.confidence ?? diagnosis.confidence_malignant ?? '0');
  const confidenceMalignantRaw = parseFloat(diagnosis.confidence_malignant ?? diagnosis.confidence ?? '0');
  const confidenceBenignRaw = parseFloat(diagnosis.confidence_benign ?? '0');
  const confidence = Number.isFinite(confidenceRaw) ? confidenceRaw : 0;
  const confidenceMalignant = Number.isFinite(confidenceMalignantRaw) ? confidenceMalignantRaw : 0;
  const confidenceBenign = Number.isFinite(confidenceBenignRaw) ? confidenceBenignRaw : 0;
  const predictedClassId = diagnosis.predicted_class_id;
  const predictionText = (diagnosis.prediction ?? '').toString().toLowerCase();
  const hasCancer = predictedClassId === 1 || predictionText.includes('malig');

  return {
    id: Date.now().toString(),
    imageUrl: response.data?.original_image_url ?? URL.createObjectURL(imageFile),
    preprocessadaImageUrl: response.data?.preprocessada_image_url,
    superpixelImageUrl: response.data?.superpixel_image_url,
    segmentedImage: response.data?.superpixel_image_url,
    superpixels: superpixels,
    tipoLesao: tipoLesao,
    message: response.data?.message,
    diagnosis: {
      prediction: diagnosis.prediction,
      predicted_class_id: predictedClassId,
      confidence,
      confidence_malignant: confidenceMalignant,
      confidence_benign: confidenceBenign,
      error: diagnosis.error ?? null
    },
    hasCancer,
    type: hasCancer ? 'malignant' : 'benign',
    confidence,
    date: new Date().toISOString()
  };
};

export default api;
