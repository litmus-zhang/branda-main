"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@branda/ui/components/button";
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full text-center z-10 animate-in fade-in zoom-in duration-700">
        <div className="relative w-full aspect-square max-w-[450px] mx-auto mb-8">
          <Image
            src="https://i.postimg.cc/hGqWxBDj/404.jpg"
            alt="404 Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
          Lost in the <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">void.</span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for has drifted out of orbit. Don't worry, your business plan is safe back at base.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="px-8 py-7 text-lg font-bold rounded-2xl bg-white text-black hover:bg-slate-200 transition-all w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Back Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="px-8 py-7 text-lg font-bold rounded-2xl border-2 border-slate-800 text-white hover:bg-white/5 transition-all w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous Page
          </Button>
        </div>
      </div>

      {/* Accents */}
      <div className="absolute bottom-8 text-slate-600 text-xs font-mono tracking-widest uppercase opacity-40">
        Error Code: 404_WORKSPACE_NOT_IN_ORBIT
      </div>
    </div>
  );
}
