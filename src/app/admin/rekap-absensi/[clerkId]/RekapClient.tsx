"use client";

import { useState, useEffect } from "react";

type RecapSummary = {
  hariKerja: number;
  hadir: number;
  terlambat: number;
  tidakHadir: number;
  izinCuti: number;
  menitTerlambat: number;
  jamKerja: number;
  tingkatKehadiran: string;
};

type RecapDetail = {
  id: string;
  tanggal: string;
  hari: string;
  jamMasuk: string;
  jamPulang: string;
  durasi: string;
  terlambat: string;
  status: string;
};

type APIResponse = {
  summary: RecapSummary;
  detail: RecapDetail[];
  error?: string;
};

export default function RekapClient({ clerkId }: { clerkId: string }) {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  
  const [data, setData] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const years = Array.from({length: 5}, (_, i) => currentDate.getFullYear() - 2 + i);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/attendance-recap?clerkId=${clerkId}&month=${month}&year=${year}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          console.error(result.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [clerkId, month, year]);

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl">
      {/* Header Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-agency-dark tracking-tight">Rekap Absensi</h2>
          <p className="text-gray-500 text-sm">Lihat rekap kehadiran bulanan Anda</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-agency-lime focus:ring-agency-lime outline-none font-medium text-agency-dark"
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-agency-lime focus:ring-agency-lime outline-none font-medium text-agency-dark"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-agency-lime rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-10">
            <SummaryCard value={data.summary.hariKerja} label="Hari Kerja" color="text-agency-dark" />
            <SummaryCard value={data.summary.hadir} label="Hadir" color="text-emerald-500" />
            <SummaryCard value={data.summary.terlambat} label="Terlambat" color="text-yellow-500" />
            <SummaryCard value={data.summary.tidakHadir} label="Tidak Hadir" color="text-red-500" />
            <SummaryCard value={data.summary.izinCuti} label="Izin/Cuti" color="text-blue-500" />
            <SummaryCard value={data.summary.menitTerlambat} label="Menit Terlambat" color="text-orange-500" />
            <SummaryCard value={data.summary.jamKerja} label="Jam Kerja" color="text-purple-500" />
            <SummaryCard value={data.summary.tingkatKehadiran} label="Tingkat Kehadiran" color="text-emerald-600" />
          </div>

          {/* Detail Table */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50/50 p-5 border-b border-gray-100">
              <h3 className="font-bold text-agency-dark">Detail Kehadiran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white text-gray-500 font-medium border-b border-gray-100">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Hari</th>
                    <th className="px-6 py-4">Jam Masuk</th>
                    <th className="px-6 py-4">Jam Pulang</th>
                    <th className="px-6 py-4">Durasi</th>
                    <th className="px-6 py-4">Terlambat</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.detail.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                        Tidak ada data kehadiran di bulan ini.
                      </td>
                    </tr>
                  ) : (
                    data.detail.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-600">{row.tanggal}</td>
                        <td className="px-6 py-4 text-gray-600">{row.hari}</td>
                        <td className="px-6 py-4 font-medium text-agency-dark">{row.jamMasuk}</td>
                        <td className="px-6 py-4 font-medium text-agency-dark">{row.jamPulang}</td>
                        <td className="px-6 py-4 text-gray-600">{row.durasi}</td>
                        <td className={`px-6 py-4 ${row.terlambat !== '-' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>{row.terlambat}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-lg ${
                            row.status === 'Tepat Waktu' ? 'bg-emerald-50 text-emerald-600' :
                            row.status === 'Terlambat' ? 'bg-yellow-50 text-yellow-600' :
                            row.status === 'Izin' || row.status === 'Sakit' ? 'bg-blue-50 text-blue-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-red-500">Gagal memuat data.</div>
      )}
    </div>
  );
}

function SummaryCard({ value, label, color }: { value: string | number, label: string, color: string }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow h-28">
      <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center leading-tight">{label}</div>
    </div>
  );
}
