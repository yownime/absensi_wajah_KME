"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ clerkId, userName }: { clerkId: string, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akses untuk operator ${userName}? Data riwayat laporan mereka akan tetap dipertahankan.`)) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/users/${clerkId}`, {
          method: "DELETE",
        });
        
        if (res.ok) {
          router.refresh();
        } else {
          const data = await res.json();
          alert(`Gagal menghapus user: ${data.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan jaringan.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors disabled:opacity-50"
      title={`Hapus Akses ${userName}`}
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
