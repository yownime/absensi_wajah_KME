"use client";

import React, { useState } from "react";
import LogsheetTable from "@/components/LogsheetTable";
import { Calendar, Edit } from "lucide-react";

interface LogsheetWrapperProps {
  department: "engine" | "limbah";
}

export default function LogsheetWrapper({ department }: LogsheetWrapperProps) {
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  
  // Default to yesterday for history to show something different
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [historyDate, setHistoryDate] = useState<string>(yesterday.toISOString().split("T")[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-agency-dark uppercase tracking-tight">Pengisian Logsheet</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Silakan isi parameter operasional. Data otomatis tersimpan sebagai draft lokal.
          </p>
        </div>

        <div className="flex bg-gray-200 rounded-xl p-1.5 border border-gray-300">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "today" ? "bg-white text-agency-dark shadow-md" : "text-gray-500 hover:text-agency-dark hover:bg-gray-100"
            }`}
          >
            <Edit className="w-4 h-4" />
            Hari Ini
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "history" ? "bg-agency-dark text-agency-lime shadow-md" : "text-gray-500 hover:text-agency-dark hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Histori
          </button>
        </div>
      </div>

      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <label className="text-agency-dark font-bold uppercase tracking-wider text-sm whitespace-nowrap">Pilih Tanggal:</label>
          <input
            type="date"
            value={historyDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setHistoryDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-agency-dark font-semibold focus:outline-none focus:ring-2 focus:ring-agency-lime focus:border-transparent transition-all"
          />
        </div>
      )}

      {activeTab === "today" ? (
        <LogsheetTable department={department} />
      ) : (
        <LogsheetTable key={historyDate} department={department} date={historyDate} readOnly={true} />
      )}
    </div>
  );
}
