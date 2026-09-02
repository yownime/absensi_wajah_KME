"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

export default function PrintableReport() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Laporan_Harian_Operasional",
    pageStyle: `
      @page { size: landscape; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold">Modul Cetak Laporan 1:1</h2>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          <Printer className="w-5 h-5" />
          Cetak Dokumen
        </button>
      </div>

      {/* The Printable Area (Styled as a white piece of paper for preview) */}
      <div className="overflow-x-auto bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div 
          ref={contentRef} 
          className="bg-white text-black p-8 mx-auto shadow-sm"
          style={{ width: "297mm", minHeight: "210mm" }} // A4 Landscape roughly
        >
          {/* Header Laporan */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase">Laporan Harian Operasional</h1>
            <p className="text-sm">Terpadu Pembangkit & Pengolahan Limbah</p>
          </div>
          
          <div className="flex justify-between mb-4 text-sm font-semibold">
            <div>Hari/Tanggal: ...............................</div>
            <div>Shift: Pagi / Sore / Malam</div>
          </div>

          {/* Table Mockup */}
          <table className="w-full text-xs border-collapse border border-black text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2" rowSpan={2}>Jam</th>
                <th className="border border-black p-2" colSpan={4}>Parameter Engine</th>
                <th className="border border-black p-2" colSpan={3}>Parameter Limbah</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-black p-1">Temp (C)</th>
                <th className="border border-black p-1">Daya (kW)</th>
                <th className="border border-black p-1">Voltage (V)</th>
                <th className="border border-black p-1">RPM</th>
                <th className="border border-black p-1">Level T1</th>
                <th className="border border-black p-1">pH</th>
                <th className="border border-black p-1">Pompa</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = (i + 7) % 24;
                return (
                  <tr key={i}>
                    <td className="border border-black p-1 font-semibold">{hour.toString().padStart(2, "0")}:00</td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Kolom Tanda Tangan */}
          <div className="mt-8 grid grid-cols-4 gap-4 text-center text-sm">
            <div className="border border-black p-4 flex flex-col justify-between h-32">
              <span className="font-semibold border-b border-black pb-1">Operator Shift</span>
              <div className="mt-auto">
                <p>Nama:</p>
                <p className="border-t border-black mt-4 pt-1">(Tanda Tangan)</p>
              </div>
            </div>
            <div className="border border-black p-4 flex flex-col justify-between h-32">
              <span className="font-semibold border-b border-black pb-1">Asst. Teknik</span>
              <div className="mt-auto">
                <p className="border-t border-black mt-8 pt-1">(Tanda Tangan)</p>
              </div>
            </div>
            <div className="border border-black p-4 flex flex-col justify-between h-32">
              <span className="font-semibold border-b border-black pb-1">Supervisor</span>
              <div className="mt-auto text-green-700 font-bold italic">
                <p>Approved Digitally</p>
                <p className="border-t border-black mt-4 pt-1">(Tanda Tangan)</p>
              </div>
            </div>
            <div className="border border-black p-4 flex flex-col justify-between h-32">
              <span className="font-semibold border-b border-black pb-1">Plant Manager</span>
              <div className="mt-auto">
                <p className="border-t border-black mt-8 pt-1">(Tanda Tangan)</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
