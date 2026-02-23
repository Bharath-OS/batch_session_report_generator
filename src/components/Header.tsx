import Link from "next/link";
import Image from 'next/image';

export default function Header() {
    return (
        <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-light/60 shadow-sm transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
                    {/* Logo mark replaced with your Favicon */}
                    <div className="w-9 h-9 relative flex items-center justify-center overflow-hidden rounded-lg shadow-sm">
                        <Image
                            src="/favicon.ico"
                            alt="QuickReport Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-foreground tracking-tight">QuickReport</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/login"
                        className="text-sm font-semibold text-secondary-dark hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-primary-light/60 border border-transparent hover:border-primary-light"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>
    );
}
