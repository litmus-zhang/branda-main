import { Logo } from "@branda/ui/components/logo";
import BackgroundBoxesDemo from "@branda/ui/components/ui/boxes";

export default function AuthLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <BackgroundBoxesDemo />
      </div>
    </div>
  );
}
