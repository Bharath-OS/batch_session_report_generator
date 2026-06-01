'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Label } from '@/components/FormElements';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                localStorage.setItem('adminAuth', 'true');
                router.push('/admin');
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Invalid email or password');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="card-container w-full max-w-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-6 text-center">Admin Login</h2>
                {error && (
                    <div className="bg-danger-light text-danger-dark p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full mt-2">
                        {isLoading ? 'Logging in…' : 'Login'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
