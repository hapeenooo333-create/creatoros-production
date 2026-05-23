import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from './types';

interface LoginModalProps {
  onLoginSuccess: (user: User, token: string) => void;
  onClose?: () => void;
  isClosable?: boolean;
}

export default function LoginModal({ onLoginSuccess, onClose, isClosable = false }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isReset, setIsReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReset) {
      if (!email) {
        setErrorMsg("Please enter your email address to reset password.");
        return;
      }
      setLoading(true);
      setErrorMsg(null);
      // Simulate reset email link dispatch
      setTimeout(() => {
        setResetSent(true);
        setLoading(false);
      }, 1000);
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please fill in all requested fields.");
      return;
    }
    
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp ? { email, password, name } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Try again.");
      }

      if (data.token && data.user) {
        onLoginSuccess(data.user, data.token);
      } else {
        throw new Error("Invalid response format from service.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "A network error occurred. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      // Direct login with static demo user
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@creatoros.ai', password: 'demo123' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to launch demo workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1917]/40 backdrop-blur-sm animate-fade-in" id="auth-modal-screen">
      <div className="w-full max-w-md bg-white border border-[#e2dfd9] rounded-2xl shadow-2xl p-8 overflow-hidden relative" id="auth-modal-card">
        {isClosable && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-sm font-semibold text-[#5c5952] hover:text-[#1a1917]"
          >
            ✕
          </button>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="h-11 w-11 rounded-xl bg-[#1a1917] flex items-center justify-center shadow-md mb-3">
            <Sparkles className="h-6 w-6 text-amber-200" />
          </div>
          <h2 className="font-display font-bold text-2xl text-[#1a1917]">
            {isReset 
              ? "Reset Account Password" 
              : isSignUp 
                ? "Create your workspace" 
                : "Welcome back to CreatorOS"}
          </h2>
          <p className="text-[#a19c91] text-xs font-mono tracking-wider uppercase mt-1">
            {isReset ? "PASSPHRASE RECOVERY NODE" : "SECURED END-TO-END SAAS"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[#7a4805] text-sm animate-shake" id="auth-alert">
            {errorMsg}
          </div>
        )}

        {resetSent ? (
          <div className="space-y-4 text-center py-4" id="reset-success-block">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              🔑 <strong>Recovery Link Triggered</strong>
              <p className="text-xs text-[#5c5952] mt-1.5 leading-relaxed">
                We've dispatched a sandbox recovery link to <strong className="font-mono">{email}</strong>. Check your spam folders or click below to return.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setIsReset(false); setResetSent(false); setErrorMsg(null); }}
              className="px-4 py-2 bg-[#1a1917] text-white hover:bg-[#383531] text-xs font-semibold rounded-lg font-mono tracking-tight"
            >
              ← Back to Workspace Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !isReset && (
              <div>
                <label className="block text-xs font-semibold text-[#5c5952] font-mono mb-1.5 uppercase">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#a19c91]" />
                  <input
                    type="text"
                    placeholder="e.g. Rachel Solopreneur"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fcfbf9] border border-[#e2dfd9] rounded-xl text-sm focus:outline-none focus:border-[#1a1917]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] font-mono mb-1.5 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#a19c91]" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#fcfbf9] border border-[#e2dfd9] rounded-xl text-sm focus:outline-none focus:border-[#1a1917]"
                />
              </div>
            </div>

            {!isReset && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#5c5952] font-mono uppercase">Account Password</label>
                  <button
                    type="button"
                    onClick={() => { setIsReset(true); setErrorMsg(null); }}
                    className="text-[10px] text-amber-700 hover:underline font-mono font-bold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#a19c91]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#fcfbf9] border border-[#e2dfd9] rounded-xl text-sm focus:outline-none focus:border-[#1a1917]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#a19c91] hover:text-[#1a1917]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#1a1917] hover:bg-[#383531] text-[#f7f6f2] font-display font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isReset 
                    ? "Dispatch Recovery Key" 
                    : isSignUp 
                      ? "Register Premium Account" 
                      : "Access Personal Workspace"}
                  <ArrowRight className="h-4 w-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {isReset && !resetSent && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => { setIsReset(false); setErrorMsg(null); }}
              className="text-xs text-[#5c5952] hover:text-[#1a1917] hover:underline font-semibold"
            >
              ← Back to Access Panel
            </button>
          </div>
        )}

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-[#e2dfd9]"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-[#a19c91] font-mono">OR</span>
          <div className="flex-grow border-t border-[#e2dfd9]"></div>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          disabled={loading}
          className="w-full py-3 bg-[#ebe7de] text-[#1a1917] border border-[#d8d4cb] font-display font-semibold text-sm rounded-xl hover:bg-[#dedad0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Use Default Demo Sandbox Account
        </button>

        <p className="text-center text-xs text-[#5c5952] mt-6 font-sans">
          {isReset 
            ? "Ready to authenticate?" 
            : isSignUp 
              ? "Already have an account?" 
              : "New to CreatorOS?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setIsReset(false);
              setErrorMsg(null);
            }}
            className="font-semibold text-[#1a1917] hover:underline"
          >
            {isReset ? "Sign in" : isSignUp ? "Sign in instead" : "Create one now"}
          </button>
        </p>
      </div>
    </div>
  );
}
