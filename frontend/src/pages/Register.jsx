import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Github, Chrome, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const onboardingData = location.state || {};

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = () => {
        // Redirect to Backend Google Auth Route
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleGithubLogin = () => {
        // Redirect to Backend Github Auth Route
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Merge onboarding preferences with account credentials
            const finalData = {
                ...formData,
                username: formData.email.split('@')[0], // Derive default username
                onboardingLanguage: onboardingData.language,
                onboardingGoal: onboardingData.goal,
                onboardingLevel: onboardingData.level,
                onboardingCommitment: onboardingData.commitment
            };

            const res = await axios.post('http://127.0.0.1:5000/api/auth/register', finalData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                navigate('/select-skills', { state: { user: res.data.user } });
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert(err.response?.data?.msg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] relative overflow-hidden flex flex-col items-center justify-center p-4">



            {/* Background Background (Simulating the blurred background in the mockup) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px]" />
            </div>

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-[480px] bg-[#1e293b] rounded-[2rem] p-10 shadow-2xl border border-white/5 relative z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-white text-3xl font-bold mb-3">Ready to Start Learning?</h2>
                    <p className="text-slate-400 text-lg">Create your account to begin your coding journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full pl-14 pr-6 py-4 bg-[#0f172a]/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-14 pr-14 py-4 bg-[#0f172a]/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold text-lg rounded-2xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
                    >
                        {loading ? "Creating Account..." : "CREATE ACCOUNT"}
                    </button>
                </form>

                {/* OR Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#1e293b] text-slate-500 font-bold uppercase tracking-widest">OR</span>
                    </div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleGithubLogin}
                        className="flex items-center justify-center gap-3 py-4 bg-[#2d3748] hover:bg-[#323d4e] text-white rounded-2xl transition-all border border-slate-700 active:scale-95"
                    >
                        <Github className="w-5 h-5 text-white fill-current" />
                        <span className="font-bold uppercase text-sm tracking-tighter">GITHUB</span>
                    </button>
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-3 py-4 bg-[#2d3748] hover:bg-[#323d4e] text-white rounded-2xl transition-all border border-slate-700 active:scale-95"
                    >
                        <Chrome className="w-5 h-5 text-[#4285F4]" />
                        <span className="font-bold uppercase text-sm tracking-tighter">GOOGLE</span>
                    </button>
                </div>

                {/* Legal & Login Link */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[300px] mx-auto">
                        By continuing you agree to our <span className="text-blue-400 cursor-pointer">Terms of Use</span> and <span className="text-blue-400 cursor-pointer">Privacy Policy</span>.
                    </p>
                    <p className="text-slate-400">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-400 font-bold hover:underline underline-offset-4"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
