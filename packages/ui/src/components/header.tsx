"use client"
import { Logo } from "@branda/ui/components/logo";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Logo size={"md"} />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#pricing" className="text-slate-600 hover:text-primary font-medium transition-colors">Pricing</a>
                        <a href="#blog" className="text-slate-600 hover:text-primary font-medium transition-colors">Blog</a>
                        <a href="#about" className="text-slate-600 hover:text-primary font-medium transition-colors">About</a>
                        <div className="flex items-center space-x-4 ml-4">
                            <a href="/auth/sign-in" className="text-slate-600 hover:text-primary font-medium transition-colors">Log In</a>
                            <a href="/auth/sign-up" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                                Get Started
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600 hover:text-teal-600"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {
                isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-lg"
                    >
                        <a href="#pricing" className="block text-slate-600 font-medium py-2">Pricing</a>
                        <a href="#blog" className="block text-slate-600 font-medium py-2">Blog</a>
                        <a href="#about" className="block text-slate-600 font-medium py-2">About</a>
                        <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                            <a href="/auth/sign-in" className="w-full text-center text-slate-600 hover:text-primary font-medium py-3 border border-slate-200 rounded-full">Log In</a>
                            <a href="/auth/sign-up" className="w-full text-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium">
                                Get Started
                            </a>
                        </div>
                    </motion.div>
                )
            }
        </nav >
    )
}