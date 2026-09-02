"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamically import FaceCamera to prevent SSR TextEncoder error from face-api
const FaceCamera = dynamic(() => import("@/components/FaceCamera"), { ssr: false });

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function EnrollmentClient({ users }: { users: PendingUser[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingRole, setIsSettingRole] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const currentUser = users.find(u => u.id === selectedUser);
  const needsRole = currentUser && (!currentUser.role || currentUser.role === "Unassigned");

  const handleSetRole = async (role: string) => {
    if (!selectedUser) return;
    setIsSettingRole(true);
    setStatus(null);

    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: selectedUser, role }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: `Berhasil mengatur role menjadi ${role}.` });
        router.refresh(); // Refresh server component data
      } else {
        const data = await res.json();
        setStatus({ type: "error", message: data.error || "Gagal mengatur role." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsSettingRole(false);
    }
  };

  const handleFaceDetected = async (descriptor: Float32Array) => {
    if (!selectedUser) {
      setStatus({ type: "error", message: "Pilih operator terlebih dahulu." });
      return;
    }
    if (needsRole) {
      setStatus({ type: "error", message: "Atur role operator terlebih dahulu sebelum mendaftarkan wajah." });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const descriptorArray = Array.from(descriptor);
      
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser, faceDescriptor: descriptorArray }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Wajah berhasil didaftarkan!" });
        setSelectedUser("");
        router.refresh(); // Refresh to remove user from the pending list
      } else {
        const error = await response.json();
        setStatus({ type: "error", message: error.error || "Gagal mendaftarkan wajah." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pendaftaran Biometrik Wajah</h1>
        <p className="text-gray-400 mt-2">Daftarkan profil wajah operator untuk sistem presensi harian.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Left Column: Form */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pilih Pengguna Baru / Operator</label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setStatus(null);
              }}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">-- Pilih Pengguna --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === 'Unassigned' ? 'Belum Ada Role' : user.role})
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-green-400 mt-2">Semua pengguna sudah terdaftar biometriknya!</p>
            )}
          </div>

          {/* Role Assignment UI for Unassigned Users */}
          {needsRole && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h3 className="text-blue-400 font-semibold mb-2">Perhatian: Pengguna Baru</h3>
              <p className="text-sm text-gray-400 mb-4">
                Pengguna ini belum memiliki jabatan (Role). Silakan tentukan jabatannya terlebih dahulu sebelum mendaftarkan wajah.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetRole("engine")}
                  disabled={isSettingRole}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSettingRole ? "Menyimpan..." : "Jadikan Engine"}
                </button>
                <button
                  onClick={() => handleSetRole("limbah")}
                  disabled={isSettingRole}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSettingRole ? "Menyimpan..." : "Jadikan Limbah"}
                </button>
              </div>
            </div>
          )}

          {status && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <span className="text-sm leading-relaxed">{status.message}</span>
            </div>
          )}

          <div className="text-sm text-gray-400">
            <h3 className="font-semibold text-gray-300 mb-2">Instruksi:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pilih pengguna dari menu <i>dropdown</i>.</li>
              <li>Jika pengguna belum punya jabatan, pilih tombol jabatannya terlebih dahulu.</li>
              <li>Pastikan wajah terlihat jelas tanpa penutup.</li>
              <li>Klik tombol <strong>Scan Wajah</strong> saat posisi sudah tepat.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Camera */}
        <div className="space-y-4">
          <FaceCamera 
            mode="enrollment" 
            onFaceDetected={handleFaceDetected} 
            isProcessing={isProcessing} 
          />
        </div>
      </div>
    </div>
  );
}
