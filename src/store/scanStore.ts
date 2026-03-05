import { create } from 'zustand';
import type { Scan, AnalysisStep } from '../types';

interface ScanState {
    currentScan: Scan | null;
    analysisStep: AnalysisStep;
    isAnalyzing: boolean;
    setCurrentScan: (scan: Scan | null) => void;
    setAnalysisStep: (step: AnalysisStep) => void;
    setIsAnalyzing: (v: boolean) => void;
    reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
    currentScan: null,
    analysisStep: 'uploading',
    isAnalyzing: false,
    setCurrentScan: (scan) => set({ currentScan: scan }),
    setAnalysisStep: (step) => set({ analysisStep: step }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    reset: () =>
        set({
            currentScan: null,
            analysisStep: 'uploading',
            isAnalyzing: false,
        }),
}));
