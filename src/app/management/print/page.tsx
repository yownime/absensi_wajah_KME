import PrintableReport from "@/components/PrintableReport";

export default function PrintPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cetak Laporan Resmi</h1>
        <p className="text-gray-400 mt-2">Cetak laporan harian dalam format fisik (1:1 Layout Landscape).</p>
      </div>
      <PrintableReport />
    </div>
  );
}
