"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// Dynamically import FaceCamera to prevent SSR TextEncoder error from face-api
const FaceCamera = dynamic(() => import("@/components/FaceCamera"), { ssr: false });

export default function PresensiPage() {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // In a real app, you would fetch the user's face_descriptor from Turso database via an API route
  // For UI mockup, we will just simulate a target or simulate the verification
  const [targetDescriptor, setTargetDescriptor] = useState<Float32Array | undefined>(undefined);

  const handleVerificationResult = (distance: number, isMatch: boolean) => {
    setIsProcessing(false);
    
    if (isMatch) {
      setStatus({ type: "success", message: `Presensi Berhasil! Jarak kemiripan: ${distance.toFixed(2)}` });
      // In a real app, we would send a POST request to save the attendance log here
    } else {
      setStatus({ type: "error", message: `Wajah tidak cocok. Jarak kemiripan: ${distance.toFixed(2)}` });
    }
  };

  const handleFaceDetectedMock = async (descriptor: Float32Array) => {
    setIsProcessing(true);
    setStatus(null);

    try {
      // MOCKUP VERIFICATION
      // Usually we pass 'verificationTarget' to FaceCamera and it fires 'onVerificationResult'
      // Since we don't have DB connected to Clerk IDs yet, we'll just simulate a successful match
      // if a face is detected.
      
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceDescriptor: Array.from(descriptor) }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Presensi Shift Berhasil Tercatat!" });
      } else {
        setStatus({ type: "error", message: "Wajah tidak dikenali atau belum didaftarkan." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-agency-dark tracking-tight uppercase">Presensi Biometrik</h1>
        <p className="text-gray-500 text-lg">Silakan arahkan wajah Anda ke kamera dengan pencahayaan yang cukup.</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center space-y-8 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-agency-lime/20 rounded-bl-full pointer-events-none" />
        <FaceCamera 
          mode="enrollment" // Using enrollment mode to just detect the face and send it to our mock API
          onFaceDetected={handleFaceDetectedMock}
          isProcessing={isProcessing}
        />

        {status && (
          <div className={`w-full p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border ${status.type === 'success' ? 'bg-agency-lime/10 text-agency-dark border-agency-lime/50' : 'bg-red-50 text-red-600 border-red-200'}`}>
            <div className="flex items-center gap-4">
              {status.type === 'success' ? <CheckCircle2 className="w-8 h-8 text-agency-dark flex-shrink-0" /> : <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
              <span className="font-bold text-lg">{status.message}</span>
            </div>
            {status.type === 'success' && (
              <Link 
                href={`/operator/logsheet/${user?.publicMetadata?.role || 'engine'}`}
                className="flex items-center justify-center gap-2 bg-agency-dark text-agency-lime px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#02180E] transition-colors whitespace-nowrap uppercase tracking-wider"
              >
                Lanjut Logsheet
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
