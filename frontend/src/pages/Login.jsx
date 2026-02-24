import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ChevronRight, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

import mascot from '../assets/trellis_mascot.png';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = formData;
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard', { state: { user: res.data.user } });
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] relative overflow-hidden flex flex-col items-center justify-center p-4">



            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 z-10">

                {/* RIGHT: Mascot + Form Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-[450px] flex flex-col items-center"
                >
                    {/* Mascot (Professional size) */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
                        <img
                            src={mascot}
                            alt="Trellis Mascot"
                            className="w-32 h-auto relative z-10 drop-shadow-2xl"
                        />
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        <div className="space-y-4">
                            {/* Email Input (Pill style) */}
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    className="w-full pl-14 pr-8 py-4 rounded-full bg-[#1e4e6e]/60 border border-blue-400/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-inner"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Password Input (Pill style) */}
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    className="w-full pl-14 pr-14 py-4 rounded-full bg-[#1e4e6e]/60 border border-blue-400/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-inner"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button (Pill style) */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 rounded-full bg-[#3b82f6] text-white font-bold text-lg uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center"
                        >
                            Sign In
                        </motion.button>
                    </form>

                    {/* Register Section */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm mb-4">Or sign in with</p>
                        <div className="flex gap-4 justify-center mb-8">
                            <button
                                onClick={() => window.location.href = `${API_BASE_URL}/api/auth/github`}
                                className="p-4 bg-[#1e293b] border border-white/5 rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                            >
                                <Github className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`}
                                className="p-4 bg-[#1e293b] border border-white/5 rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                            >
                                <Chrome className="w-5 h-5 text-[#4285F4]" />
                            </button>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">New to Trellis?</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-8"
                        >
                            Create an account
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -ml-64 -mb-64" />
        </div>
    );
};

export default Login;
