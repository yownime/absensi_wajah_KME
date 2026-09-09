import { SignUp } from "@clerk/nextjs";
import { Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex bg-agency-cream font-sans selection:bg-agency-lime selection:text-agency-dark">
      {/* Left Side: Photo and Text (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-agency-dark overflow-hidden flex-col justify-between p-12 lg:p-16">
        {/* Background Image with Overlay */}
        <img 
          src="/hero-bg.jpeg" 
          alt="PT Karya Mandoge Energi Facility" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" 
        />
        {/* Gradient mask to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-agency-dark via-agency-dark/60 to-transparent" />
        
        {/* Logo Top Left */}
        <div className="relative z-10 flex items-center gap-2">
          <img src="/logo.png" alt="KME Attendance Logo" className="h-16 bg-white p-2 rounded-xl" />
        </div>

        {/* Hero Text Bottom Left */}
        <div className="relative z-10 space-y-6 max-w-xl pb-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-agency-lime font-bold text-sm tracking-wider uppercase">
            Portal Karyawan
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Sistem Kendali <br /> <span className="text-agency-lime">Operasional Cerdas</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Daftarkan diri Anda untuk mengakses portal manajemen pusat. Mulai pantau kinerja mesin dan pengolahan limbah secara *real-time*.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-agency-cream">
        {/* Back to Home Button */}
        <Link 
          href="/"
          className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-agency-lime hover:text-agency-dark rounded-full text-gray-500 font-bold transition-all shadow-sm hover:shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Beranda
        </Link>

        {/* Ambient glow for the right side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-agency-lime/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile Logo (Only visible on small screens) */}
          <div className="lg:hidden flex justify-center items-center gap-2 mb-10">
            <img src="/logo.png" alt="KME Attendance Logo" className="h-16 bg-white p-2 rounded-xl" />
          </div>

          <div className="w-full flex justify-center shadow-2xl rounded-[2rem] bg-white border border-gray-100 p-2">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full flex justify-center",
                  card: "bg-transparent shadow-none border-none p-4 sm:p-6 w-full max-w-full",
                  headerTitle: "text-agency-dark font-extrabold text-3xl tracking-tight text-center",
                  headerSubtitle: "text-gray-500 font-medium text-center",
                  formButtonPrimary: 
                    "bg-agency-lime hover:bg-[#a3e635] text-agency-dark font-extrabold border-none shadow-[0_5px_15px_rgba(190,242,100,0.3)] transition-all active:scale-95 py-3",
                  socialButtonsBlockButton: "border-gray-200 text-agency-dark font-bold hover:bg-gray-50 rounded-xl transition-colors py-3",
                  formFieldLabel: "text-agency-dark font-bold",
                  formFieldInput: "rounded-xl border-gray-200 focus:border-agency-lime focus:ring-agency-lime text-agency-dark font-medium transition-colors bg-gray-50/50 py-3",
                  footerActionLink: "text-agency-dark font-extrabold hover:text-[#042b1f] underline transition-colors"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
