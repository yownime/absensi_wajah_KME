import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ShieldCheck, LogOut, ArrowRight, BarChart3, Users, Leaf, CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    // If not logged in, show a premium agency-style landing page
    return (
      <main className="min-h-screen overflow-x-hidden bg-agency-cream font-sans selection:bg-agency-lime selection:text-agency-dark">
        {/* HERO SECTION - Dark Green */}
        <div id="beranda" className="bg-agency-dark rounded-b-[3rem] md:rounded-b-[5rem] pb-24 pt-8 px-6 relative overflow-hidden">
          {/* Background Image with Overlay */}
          <img 
            src="/hero-bg.jpeg" 
            alt="PT Karya Mandoge Energi Facility" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-agency-dark/80 to-agency-dark" />

          {/* Decorative shapes */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-agency-lime/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Navigation */}
          <nav className="max-w-7xl mx-auto flex items-center justify-between mb-20 relative z-10">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="KME Attendance Logo" className="h-12 bg-white p-1.5 rounded-xl" />
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-gray-300 text-sm font-bold uppercase tracking-wider">
              <Link href="#beranda" className="hover:text-agency-lime transition-colors">Beranda</Link>
              <Link href="#fitur" className="hover:text-agency-lime transition-colors">Fitur</Link>
              <Link href="#keamanan" className="hover:text-agency-lime transition-colors">Keamanan</Link>
              <Link href="#kontak" className="hover:text-agency-lime transition-colors">Kontak</Link>
            </div>
            
            <Link 
              href="/sign-in"
              className="px-6 py-2.5 rounded-full border border-gray-600 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Masuk Sistem
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-agency-lime font-medium text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Validasi Biometrik Wajah</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                SISTEM PRESENSI <br />
                & LOGSHEET <br />
                <span className="text-agency-lime">TERINTEGRASI</span>
              </h1>
              
              <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                Platform modern yang tangguh untuk memantau operasional mesin dan pengolahan limbah secara *real-time* dan transparan.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-agency-dark transition-all duration-300 bg-agency-lime rounded-full hover:bg-[#a3e635] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(190,242,100,0.3)]"
                >
                  Mulai Operasional
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            {/* Right side abstract/mockups */}
            <div className="flex-1 relative w-full h-[500px] hidden lg:block">
              {/* Card 1 */}
              <div className="absolute top-10 right-20 w-72 bg-agency-cream p-6 rounded-3xl shadow-2xl rotate-6 transform transition-transform hover:rotate-12 hover:scale-105 z-20 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-agency-lime flex items-center justify-center text-agency-dark">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Engine Status</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-4/5"></div>
                  <div className="h-20 bg-gray-100 rounded-xl mt-4 border border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Grafik Normal</span>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="absolute bottom-10 left-10 w-64 bg-[#0a3f2b] p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] -rotate-6 transform transition-transform hover:-rotate-12 hover:scale-105 z-10 border border-[#14532D]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-white font-bold leading-tight">Presensi<br/>Selesai</div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-agency-lime flex items-center justify-center text-agency-dark">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-8"></div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICES SECTION - Cream */}
        <div id="fitur" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-4 mb-16">
            <h4 className="text-agency-lime font-bold tracking-widest uppercase text-sm">Fitur Utama</h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-agency-dark">
              SOLUSI UNTUK <br />
              KENDALI <span className="text-emerald-600">OPERASIONAL</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto pt-4 text-lg">
              Dari deteksi biometrik wajah hingga logsheet harian, kami mendigitalisasi seluruh aspek pengawasan mesin dan lingkungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col">
              <div className="w-14 h-14 bg-agency-lime rounded-2xl flex items-center justify-center text-agency-dark mb-8">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-agency-dark mb-4 uppercase tracking-tight">Presensi Biometrik</h3>
              <p className="text-gray-600 mb-8 flex-1">
                Katakan selamat tinggal pada absensi kertas. Validasi kehadiran melalui scan wajah AI yang cepat dan anti-curang.
              </p>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-agency-dark group-hover:bg-agency-lime transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-agency-dark rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition-transform duration-300 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-agency-lime/10 rounded-bl-full pointer-events-none" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-agency-lime mb-8">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Digital Logsheet</h3>
              <p className="text-gray-400 mb-8 flex-1">
                Pencatatan parameter harian secara sistematis dengan peringatan dini jika terdeteksi anomali pada mesin.
              </p>
              <div className="w-10 h-10 rounded-full bg-agency-lime flex items-center justify-center text-agency-dark">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-emerald-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 border border-emerald-200 flex flex-col">
              <div className="w-14 h-14 bg-emerald-900 rounded-2xl flex items-center justify-center text-agency-lime mb-8">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-4 uppercase tracking-tight">Pemantauan Histori</h3>
              <p className="text-emerald-800/80 mb-8 flex-1">
                Lacak seluruh riwayat logsheet kapan saja. Data dijamin tidak dapat diubah oleh operator setelah terekam.
              </p>
              <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-950">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div id="keamanan" className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-agency-dark rounded-3xl p-10 flex flex-col md:flex-row justify-around items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-agency-lime flex items-center justify-center text-agency-dark shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">24/7</div>
                <div className="text-agency-lime font-medium text-sm tracking-wider uppercase">Operasional</div>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/20"></div>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-transparent border border-gray-600 flex items-center justify-center text-agency-lime shrink-0">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">100%</div>
                <div className="text-gray-400 font-medium text-sm tracking-wider uppercase">Akurasi Pencatatan</div>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/20"></div>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-transparent border border-gray-600 flex items-center justify-center text-agency-lime shrink-0">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">&lt;0.1%</div>
                <div className="text-gray-400 font-medium text-sm tracking-wider uppercase">Limbah Berbahaya</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT & MAP SECTION */}
        <div id="kontak" className="w-full bg-white py-24 border-t border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center space-y-4 mb-16">
              <h4 className="text-agency-lime font-bold tracking-widest uppercase text-sm">Lokasi & Kontak</h4>
              <h2 className="text-4xl font-extrabold text-agency-dark">
                KANTOR <span className="text-emerald-600">PUSAT</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info Card */}
              <div className="bg-agency-cream rounded-[2rem] p-10 flex flex-col justify-center border border-gray-100 shadow-xl space-y-10">
                <div className="space-y-4">
                  <h3 className="text-3xl font-extrabold text-agency-dark tracking-tight">Mari Berbincang</h3>
                  <p className="text-gray-500 text-lg">Hubungi kami untuk informasi lebih lanjut mengenai sistem operasional PT Karya Mandoge Energi.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-agency-dark text-agency-lime rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-agency-dark text-lg mb-1">Alamat Kantor</h4>
                      <p className="text-gray-600">Komplek Multatuli Indah<br/>Jl. Multatuli AA No. 50, Medan Maimun, Kota Medan, Sumatera Utara</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-agency-dark text-agency-lime rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-agency-dark text-lg mb-1">Telepon</h4>
                      <p className="text-gray-600">+62 21 555 1234 (Operasional)<br/>+62 811 999 888 (Hotline Darurat)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-agency-dark text-agency-lime rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-agency-dark text-lg mb-1">Email</h4>
                      <p className="text-gray-600">admin@karyamandogeenergi.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 h-[500px] lg:h-auto min-h-[400px]">
                {/* Note: Update the src below with the actual company's Google Map embed URL */}
                <iframe 
                  src="https://maps.google.com/maps?q=Komplek+Multatuli+Indah,+Jl.+Multatuli+AA+No.+50,+Medan+Maimun,+Kota+Medan,+Sumatera+Utara&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-agency-dark text-white pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-agency-lime/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="KME Attendance Logo" className="h-16 bg-white p-2 rounded-xl" />
                </div>
                <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
                  Sistem operasional terpadu yang memberdayakan industri dengan presensi biometrik anti-curang dan pencatatan mesin yang presisi.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Tautan Cepat</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><Link href="#beranda" className="hover:text-agency-lime transition-colors">Beranda</Link></li>
                  <li><Link href="#fitur" className="hover:text-agency-lime transition-colors">Fitur Utama</Link></li>
                  <li><Link href="#keamanan" className="hover:text-agency-lime transition-colors">Keamanan</Link></li>
                  <li><Link href="/sign-in" className="hover:text-agency-lime transition-colors">Login Operator</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legalitas</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><Link href="#" className="hover:text-agency-lime transition-colors">Kebijakan Privasi</Link></li>
                  <li><Link href="#" className="hover:text-agency-lime transition-colors">Syarat & Ketentuan</Link></li>
                  <li><Link href="#" className="hover:text-agency-lime transition-colors">Perizinan Keamanan</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} PT Karya Mandoge Energi. Hak Cipta Dilindungi Undang-Undang.
              </p>
              <div className="flex gap-2">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-agency-lime hover:border-agency-lime cursor-pointer transition-colors">
                  in
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-agency-lime hover:border-agency-lime cursor-pointer transition-colors">
                  tw
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-agency-lime hover:border-agency-lime cursor-pointer transition-colors">
                  ig
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  const role = user?.publicMetadata?.role;

  // Role based routing
  if (role === "admin") {
    redirect("/admin/dashboard");
  } else if (role === "management") {
    redirect("/management/dashboard");
  } else if (role === "engine" || role === "limbah") {
    redirect("/operator/dashboard");
  }

  // Fallback if role is not properly assigned
  return (
    <main className="min-h-screen bg-agency-cream flex flex-col items-center justify-center p-6">
      <div className="bg-white border border-gray-200 p-10 rounded-3xl max-w-md text-center space-y-6 shadow-2xl shadow-gray-200/60">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-agency-dark uppercase tracking-tight">Menunggu Akses</h2>
          <p className="text-gray-600">
            Akun Anda telah terdaftar namun belum diberikan peran operasional. Silakan hubungi Admin HR/IT.
          </p>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-6">
            Jika role Anda baru saja diubah, silakan keluar dan masuk kembali untuk memperbarui sesi.
          </p>
          <div className="flex justify-center">
            <SignOutButton>
              <button className="flex items-center gap-3 px-8 py-3 bg-agency-dark hover:bg-[#02180E] text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg">
                <LogOut className="w-5 h-5" />
                <span>Keluar & Segarkan Sesi</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </main>
  );
}

// Ensure FileText icon is imported for the Service section
import { FileText } from "lucide-react";
