import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, CheckCircle, Loader2, Circle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { Navbar } from '../components/layout/Navbar';
import { CameraCapture } from '../components/CameraCapture';
import { analyzePlant } from '../lib/ai';
import { useScanStore } from '../store/scanStore';
import { useLanguageStore } from '../store/languageStore';
import type { AnalysisStep } from '../types';

const STEPS: { id: AnalysisStep; label: string }[] = [
    { id: 'uploading', label: 'Uploading image...' },
    { id: 'identifying', label: 'Identifying plant...' },
    { id: 'scanning_diseases', label: 'Scanning for diseases...' },
    { id: 'analyzing_growth', label: 'Analyzing growth stage...' },
    { id: 'generating_report', label: 'Generating report...' },
];

function StepIndicator({ step, currentStep, index }: {
    step: { id: AnalysisStep; label: string };
    currentStep: AnalysisStep;
    index: number;
}) {
    const steps = STEPS.map(s => s.id);
    const currentIdx = steps.indexOf(currentStep);
    const isDone = index < currentIdx || currentStep === 'complete';
    const isActive = index === currentIdx;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10, background: isActive ? 'rgba(74,222,128,0.06)' : 'transparent', border: isActive ? '1px solid rgba(74,222,128,0.15)' : '1px solid transparent' }}
        >
            {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <CheckCircle size={18} color="#4ade80" />
                </motion.div>
            ) : isActive ? (
                <Loader2 size={18} color="#4ade80" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
                <Circle size={18} color="var(--text-muted)" />
            )}
            <span style={{
                fontSize: 14,
                color: isDone ? '#4ade80' : isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
            }}>
                {step.label}
            </span>
        </motion.div>
    );
}

export function ScanPage() {
    const navigate = useNavigate();
    const { setCurrentScan, setAnalysisStep, setIsAnalyzing, analysisStep, isAnalyzing } = useScanStore();
    const { language } = useLanguageStore();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);

    const onDrop = useCallback(async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        // Compress
        const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
        const originalMb = (file.size / 1048576).toFixed(1);
        const compressedMb = (compressed.size / 1048576).toFixed(1);
        if (parseFloat(originalMb) > parseFloat(compressedMb)) {
            toast(`Image compressed from ${originalMb}MB to ${compressedMb}MB`, { icon: 'ℹ️' });
        }

        setImageFile(compressed);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(compressed);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
        maxFiles: 1,
        multiple: false,
    });

    const handleAnalyze = async () => {
        if (!imageFile) return;
        setIsAnalyzing(true);

        try {
            setAnalysisStep('uploading');
            await new Promise(r => setTimeout(r, 500));
            setAnalysisStep('identifying');
            await new Promise(r => setTimeout(r, 600));
            setAnalysisStep('scanning_diseases');

            const analysis = await analyzePlant(imageFile, language);

            setAnalysisStep('analyzing_growth');
            await new Promise(r => setTimeout(r, 400));
            setAnalysisStep('generating_report');
            await new Promise(r => setTimeout(r, 400));

            // Store result and navigate
            const scanId = `scan_${Date.now()}`;
            const scan = {
                id: scanId,
                user_id: 'local',
                image_url: imagePreview || '',
                plant_name: analysis.plant_name,
                scientific_name: analysis.scientific_name,
                confidence: analysis.confidence_percent,
                health_score: analysis.health_score,
                growth_stage: analysis.growth_stage,
                disease_detected: analysis.disease_detected,
                disease_name: analysis.disease_name || undefined,
                severity: analysis.severity,
                full_analysis: analysis,
                created_at: new Date().toISOString(),
            };

            setCurrentScan(scan);
            setAnalysisStep('complete');

            // Store in localStorage for results page
            const existing = JSON.parse(localStorage.getItem('plantiq_scans') || '[]');
            localStorage.setItem('plantiq_scans', JSON.stringify([scan, ...existing].slice(0, 50)));

            toast.success('Analysis complete! Your plant report is ready.');
            navigate(`/results/${scanId}`);
        } catch (err: any) {
            setAnalysisStep('error');
            const message = err.message || 'Analysis failed. Please try a clearer image.';
            toast.error(message);
            console.error('Scan Error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setIsAnalyzing(false);
        setAnalysisStep('uploading');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <main style={{ paddingTop: 80, maxWidth: 900, margin: '0 auto', padding: '96px 32px 64px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
                        Scan Your Plant
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                        Upload a clear photo and get an expert AI analysis in seconds.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!imagePreview ? (
                        /* Dropzone */
                        <div {...getRootProps()} style={{ cursor: 'pointer' }}>
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                style={{
                                    height: 300,
                                    border: `2px dashed ${isDragActive ? '#4ade80' : 'rgba(74,222,128,0.25)'}`,
                                    borderRadius: 20,
                                    background: isDragActive ? 'rgba(74,222,128,0.04)' : 'rgba(18,31,24,0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 12,
                                    transition: 'all 200ms',
                                }}
                                className={isDragActive ? 'dropzone-active' : ''}
                            >
                                <input {...getInputProps()} />
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        background: 'rgba(74,222,128,0.08)',
                                        borderRadius: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Upload size={26} color="#4ade80" />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {isDragActive ? 'Drop it here!' : 'Drop your plant image here'}
                                    </p>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>or click to browse files</p>
                                </div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {['JPG', 'PNG', 'WebP', 'HEIC'].map((f) => (
                                        <span key={f} className="badge" style={{ background: 'rgba(74,222,128,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 10 }}>{f}</span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Image preview + scan */
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
                        >
                            {/* Image with scan overlay */}
                            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                                <img src={imagePreview} alt="Plant" style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
                                {isAnalyzing && (
                                    <div style={{ position: 'absolute', inset: 0 }}>
                                        <div className="scan-line" />
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(74,222,128,0.05)', border: '2px solid rgba(74,222,128,0.4)', borderRadius: 16 }} />
                                    </div>
                                )}
                                <button
                                    onClick={removeImage}
                                    disabled={isAnalyzing}
                                    style={{
                                        position: 'absolute', top: 12, right: 12,
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'rgba(8,13,10,0.8)',
                                        border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Analysis steps */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                                    {isAnalyzing ? 'Analyzing...' : 'Ready to analyze'}
                                </h3>
                                {STEPS.map((step, i) => (
                                    <StepIndicator key={step.id} step={step} currentStep={analysisStep} index={i} />
                                ))}
                                {!isAnalyzing && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="btn-primary"
                                        onClick={handleAnalyze}
                                        style={{ marginTop: 16, justifyContent: 'center', boxShadow: '0 0 24px rgba(74,222,128,0.2)' }}
                                    >
                                        <Camera size={16} /> Analyze Plant
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Camera option */}
                {!imagePreview && (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn-ghost"
                            style={{ gap: 8 }}
                            onClick={() => setShowCamera(true)}
                        >
                            <Camera size={15} /> Use Camera
                        </button>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                            Opens live camera to take photo
                        </p>
                    </div>
                )}
            </main>

            {/* Camera Modal */}
            <AnimatePresence>
                {showCamera && (
                    <CameraCapture
                        onCapture={async (file) => {
                            setShowCamera(false);
                            await onDrop([file]);
                        }}
                        onClose={() => setShowCamera(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
