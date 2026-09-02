"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { Camera, RefreshCw } from "lucide-react";

interface FaceCameraProps {
  onFaceDetected?: (descriptor: Float32Array) => void;
  isProcessing?: boolean;
  mode?: "enrollment" | "verification";
  verificationTarget?: Float32Array;
  onVerificationResult?: (distance: number, isMatch: boolean) => void;
}

export default function FaceCamera({
  onFaceDetected,
  isProcessing = false,
  mode = "enrollment",
  verificationTarget,
  onVerificationResult,
}: FaceCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Initialize TensorFlow backend first to avoid "highest priority backend has not yet been initialized" error
        const tf = faceapi.tf as any;
        await tf.setBackend('webgl');
        await tf.ready();
        
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        setError("Gagal memuat model face recognition.");
        console.error(err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      if (!isModelLoaded) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isModelLoaded]);

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // We only scan manually when user clicks "Scan Wajah" for enrollment, 
    // but for verification we might want continuous scanning.
    // Let's implement manual scanning function instead of interval for better performance,
    // or continuous for verification.
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !isModelLoaded || isProcessing || isDetecting) return;

    setIsDetecting(true);

    // Provide a small delay to allow React to render the "Memproses..." state
    // before the heavy synchronous ML processing blocks the main thread
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        if (mode === "enrollment" && onFaceDetected) {
          onFaceDetected(detection.descriptor);
        } else if (mode === "verification" && verificationTarget && onVerificationResult) {
          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            verificationTarget
          );
          const isMatch = distance <= 0.45; // 0.45 threshold from PRD
          onVerificationResult(distance, isMatch);
        }
      } else {
        alert("Wajah tidak terdeteksi. Pastikan pencahayaan cukup dan wajah terlihat jelas di kamera.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses gambar. Coba muat ulang halaman.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 w-full">
      <div className="relative w-full aspect-video bg-agency-dark flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-agency-lime via-transparent to-transparent pointer-events-none"></div>
        {error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : !isModelLoaded ? (
          <div className="flex flex-col items-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
            <span>Memuat Model AI...</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onPlay={handleVideoPlay}
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
          />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      </div>

      <div className="p-6 w-full bg-white flex justify-center border-t border-gray-100 relative z-10">
        <button
          onClick={captureAndDetect}
          disabled={!isModelLoaded || isProcessing || isDetecting}
          className="flex items-center gap-3 px-8 py-4 bg-agency-lime hover:bg-[#a3e635] disabled:bg-gray-200 disabled:text-gray-400 text-agency-dark font-extrabold rounded-full transition-all active:scale-95 shadow-[0_10px_30px_rgba(190,242,100,0.3)] uppercase tracking-wider"
        >
          {isProcessing || isDetecting ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Camera className="w-6 h-6" />
          )}
          <span className="text-lg">{isProcessing || isDetecting ? "Memproses Wajah..." : "Scan Wajah Sekarang"}</span>
        </button>
      </div>
    </div>
  );
}
