import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Logo } from '@branda/ui/components/logo';
export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering entrepreneurs to build, launch, and scale their dream businesses with the power of Artificial Intelligence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Branda Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}