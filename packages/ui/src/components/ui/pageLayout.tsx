import { cn } from "@branda/ui/lib/utils";
import { Header } from "@branda/ui/components/header";
import { Footer } from "@branda/ui/components/footer";


export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function PageLayout({ children, className, fullWidth = false, ...props }: PageLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main 
                className={cn(
                    "flex-1",
                    !fullWidth && "mx-auto max-w-4xl px-4 py-12 pt-24 sm:px-6 lg:px-8",
                    className
                )} 
                {...props}
            >
                {children}
            </main>
            <Footer />
        </div>
    )
}