import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    useEffect(() => {
        startCamera();
        checkMultipleCameras();
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const checkMultipleCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setHasMultipleCameras(videoDevices.length > 1);
        } catch (err) {
            console.error('Error checking cameras:', err);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.error('Camera error:', err);
            toast.error('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `plant-${Date.now()}.jpg`, { type: 'image/jpeg' });
                stopCamera();
                onCapture(file);
            }
        }, 'image/jpeg', 0.95);
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
            }}>
                <h2 style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>Take Photo</h2>
                <button
                    onClick={() => {
                        stopCamera();
                        onClose();
                    }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Video Preview */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 600,
                aspectRatio: '4/3',
                borderRadius: 16,
                overflow: 'hidden',
                border: '2px solid rgba(74,222,128,0.3)',
            }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                
                {/* Scan guide overlay */}
                <div style={{
                    position: 'absolute',
                    inset: '10%',
                    border: '2px dashed rgba(74,222,128,0.5)',
                    borderRadius: 12,
                    pointerEvents: 'none',
                }} />
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: 40,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 40,
            }}>
                {/* Switch Camera */}
                {hasMultipleCameras && (
                    <button
                        onClick={switchCamera}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        <RotateCw size={24} />
                    </button>
                )}

                {/* Capture Button */}
                <button
                    onClick={capturePhoto}
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'white',
                        border: '4px solid rgba(74,222,128,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 24px rgba(74,222,128,0.4)',
                    }}
                >
                    <Camera size={32} color="#080d0a" />
                </button>

                {/* Placeholder for symmetry */}
                {hasMultipleCameras && <div style={{ width: 56 }} />}
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Instructions */}
            <div style={{
                position: 'absolute',
                bottom: 140,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14,
            }}>
                Position the plant within the frame
            </div>
        </motion.div>
    );
}
