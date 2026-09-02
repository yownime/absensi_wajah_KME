"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertTriangle, RefreshCw } from "lucide-react";
import { ENGINE_PARAMS, LIMBAH_PARAMS, HOURS } from "@/lib/constants";

interface LogsheetTableProps {
  department: "engine" | "limbah";
  date?: string;
  readOnly?: boolean;
}

export default function LogsheetTable({ department, date, readOnly = false }: LogsheetTableProps) {
  const [data, setData] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = department === "engine" ? ENGINE_PARAMS : LIMBAH_PARAMS;

  // Load data from API or localStorage
  useEffect(() => {
    const loadData = async () => {
      if (date) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/logsheet/history?department=${department}&date=${date}`);
          if (res.ok) {
            const result = await res.json();
            if (result.data && Object.keys(result.data).length > 0) {
              setData(result.data);
              setIsLoading(false);
              return; // If API has data, use it
            }
          }
        } catch (e) {
          console.error("Error fetching history:", e);
        }
        setIsLoading(false);
      }

      // If no API data or date is not provided, load from draft for today
      if (!readOnly) {
        const draft = localStorage.getItem(`logsheet_draft_${department}`);
        if (draft) {
          try {
            setData(JSON.parse(draft));
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        setData({}); // Clear data if readOnly and no API data found
      }
    };
    loadData();
  }, [department, date, readOnly]);

  const handleChange = (hour: string, paramId: string, value: string) => {
    if (readOnly) return;
    const newData = {
      ...data,
      [hour]: {
        ...(data[hour] || {}),
        [paramId]: value,
      },
    };
    setData(newData);
    localStorage.setItem(`logsheet_draft_${department}`, JSON.stringify(newData));
  };

  const checkWarning = (param: any, value: string) => {
    if (!value) return false;
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    
    if (param.max !== undefined && num > param.max) return true;
    if (param.min !== undefined && num < param.min) return true;
    
    return false;
  };

  const handleSave = async () => {
    if (readOnly) return;
    setIsSaving(true);
    try {
      const today = date || new Date().toISOString().split("T")[0];
      const res = await fetch("/api/logsheet/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          date: today,
          data
        }),
      });

      if (res.ok) {
        alert("Data logsheet harian berhasil disimpan ke database Turso!");
        localStorage.removeItem(`logsheet_draft_${department}`);
      } else {
        const err = await res.json();
        alert("Gagal menyimpan data: " + (err.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col h-[calc(100vh-12rem)] relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
          <RefreshCw className="w-10 h-10 text-agency-lime animate-spin" />
        </div>
      )}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-black text-agency-dark tracking-tight uppercase">Logsheet {department === 'engine' ? 'Genset (Engine)' : 'Scrubber & WWTP'}</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {readOnly ? "Mode Baca Saja (Histori). Data tidak dapat diubah." : "Autosave aktif. Warna merah menunjukkan nilai di luar batas acuan."}
          </p>
        </div>
        {!readOnly && (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-agency-lime hover:bg-[#a3e635] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-agency-dark font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(190,242,100,0.2)] active:scale-95 uppercase tracking-wider text-sm"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Menyimpan..." : "Simpan Permanen"}
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-white">
        <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
          <thead className="text-xs text-white uppercase bg-agency-dark sticky top-0 z-10 shadow-md">
            <tr>
              <th className="px-6 py-5 border-b border-agency-dark w-24 sticky left-0 bg-agency-dark z-20 font-bold tracking-wider">Jam</th>
              {params.map(p => (
                <th key={p.id} className="px-6 py-5 border-b border-agency-dark min-w-[200px]">
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wider">{p.name}</span>
                    <span className="text-[10px] text-agency-lime mt-0.5">{p.unit}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour, idx) => (
              <tr key={hour} className={`border-b border-gray-100 hover:bg-agency-cream transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className={`px-6 py-4 font-bold text-agency-dark sticky left-0 z-10 border-r border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>{hour}</td>
                {params.map(p => {
                  const val = data[hour]?.[p.id] || "";
                  const isWarning = checkWarning(p, val);
                  return (
                    <td key={p.id} className="px-4 py-2 relative border-r border-gray-50">
                      <input
                        type={p.type}
                        value={val}
                        onChange={(e) => handleChange(hour, p.id, e.target.value)}
                        disabled={readOnly}
                        className={`w-full bg-transparent border rounded-lg px-3 py-2.5 text-agency-dark font-semibold focus:outline-none focus:ring-2 focus:ring-agency-lime focus:border-transparent transition-all ${
                          isWarning ? 'border-red-400 bg-red-50 text-red-700 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'
                        } ${readOnly ? 'opacity-70 cursor-not-allowed bg-gray-50' : ''}`}
                        placeholder="-"
                      />
                      {isWarning && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" title="Nilai di luar batas normal">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
