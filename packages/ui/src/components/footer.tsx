import { MapPin } from "lucide-react";
import { Logo } from "@branda/ui/components/logo";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Logo href="/" />
                        <p className="text-slate-500 max-w-sm mb-6">Building a better Lagos through active civic participation, transparency, and community collaboration.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Report Issue</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Initiatives</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Townhalls</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="/terms" className="text-slate-500 hover:text-teal-600 transition-colors">Terms of Service</a></li>
                            <li><a href="/privacy" className="text-slate-500 hover:text-teal-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="/data-usage" className="text-slate-500 hover:text-teal-600 transition-colors">Data Usage Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Engage Lagos. All rights reserved.</p>
                    <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        Lagos State, Nigeria
                    </div>
                </div>
            </div>
        </footer>
    )
}