'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Label } from '@/components/FormElements';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'bcr306admin@gmail.com' && password === 'bcr306adminpanel') {
            // Very basic mock authentication using localStorage
            localStorage.setItem('adminAuth', 'true');
            router.push('/admin');
        } else {
            setError('Invalid email or password');
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
                    <Button type="submit" className="w-full mt-2">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
