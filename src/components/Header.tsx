import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-secondary-light sticky top-0 z-50 shadow-sm">
            <div className="max-w-[800px] mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary-dark tracking-tight hover:opacity-80 transition-opacity">
                    BCR 306 <span className="text-secondary font-normal">Session Report Generator</span>
                </Link>
                <Link
                    href="/admin/login"
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-primary-light/50"
                >
                    Admin Login
                </Link>
            </div>
        </header>
    );
}
