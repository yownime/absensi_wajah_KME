export default function ManagementDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-agency-dark uppercase tracking-tight">Dashboard Management</h1>
      <p className="text-gray-500 font-medium">Ringkasan performa operasional harian.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl">
          <div className="text-gray-500 mb-2 font-bold uppercase tracking-wider text-sm">Engine Terisi</div>
          <div className="text-4xl font-black text-agency-dark">24<span className="text-xl text-gray-400">/24</span></div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl">
          <div className="text-gray-500 mb-2 font-bold uppercase tracking-wider text-sm">Limbah Terisi</div>
          <div className="text-4xl font-black text-agency-dark">24<span className="text-xl text-gray-400">/24</span></div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl">
          <div className="text-rose-500 mb-2 font-bold uppercase tracking-wider text-sm">Peringatan</div>
          <div className="text-4xl font-black text-rose-600">2</div>
        </div>
        <div className="bg-agency-dark border border-agency-lime/20 p-8 rounded-[2rem] shadow-xl">
          <div className="text-agency-lime mb-2 font-bold uppercase tracking-wider text-sm">Status Approval</div>
          <div className="text-2xl font-black text-white mt-2 leading-tight">Menunggu Supervisor</div>
        </div>
      </div>
    </div>
  );
}
