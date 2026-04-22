import { LogIn } from 'lucide-react';
import { Logo } from '@branda/ui/components/logo';
import Link from 'next/link';
import { Button } from '@branda/ui/components/button';
export const Header = () => {
    return (
        <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 z-10 sticky top-0 shadow-sm">
            <Logo />
            <div className="flex items-center gap-6">
                <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-primary-600">Features</a>
                    <a href="#pricing" className="hover:text-primary-600">Pricing</a>
                    <a href="#testimonials" className="hover:text-primary-600">Testimonials</a>
                </nav>
                <Link className='text-white' href="/auth/sign-in">
                    <Button className='text-white font-bold'>
                        <LogIn />
                        Login
                    </Button>
                </Link>
            </div>
        </header>
    )
}