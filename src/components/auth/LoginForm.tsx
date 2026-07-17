import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '../common/Button';

export const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
      addToast('Successfully logged in!', 'success');
      onSuccess();
    } catch (err: any) {
      addToast(err.friendlyMessage || 'Login failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-hairline bg-transparent p-2 text-text-primary rounded-sm focus:border-accent focus:outline-none"
          placeholder="priya@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-hairline bg-transparent p-2 text-text-primary rounded-sm focus:border-accent focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Login
      </Button>
    </form>
  );
};
