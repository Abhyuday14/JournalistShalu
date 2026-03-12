import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';

const AdminLogin = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Set your single admin email here
  const ADMIN_EMAIL = 'shalusachdeva1920@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError('Access restricted to authorized admin only.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        onLogin(data.user);
        window.location.hash = 'admin-dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-sage-green/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nature-green">
            Admin Access
          </h1>
          <p className="text-deep-charcoal/60">
            Manage your portfolio content
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-nature-green text-sm text-center font-medium">{message}</p>}
          <button type="submit" className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all">
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
