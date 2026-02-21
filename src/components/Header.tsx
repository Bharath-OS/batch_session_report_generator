import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-light/60 shadow-sm transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
                    {/* Logo mark */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-foreground tracking-tight">BCR 306</span>
                        <span className="text-sm font-medium text-secondary hidden sm:inline">Session Report Generator</span>
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
