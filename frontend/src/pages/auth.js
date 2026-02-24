import React, { useState } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import { useNavigate } from 'react-router-dom';

// Import your exact files
import mascot from '../assets/trellis_mascot.png';
import logo from '../assets/Logo.jpeg';
import loginAnim from '../assets/login-animation.json';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const res = await axios.post(`${API_BASE_URL}/api/auth${endpoint}`, formData);
            if (res.data.user) {
                navigate('/dashboard', { state: { user: res.data.user } });
            }
        } catch (err) {
            alert("Authentication error. Check backend.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-10 bg-[#0F172A]">
            <div className="flex w-full max-w-5xl items-center justify-between gap-12">

                {/* LEFT SECTION: Branding */}
                <div className="flex flex-col items-center space-y-6 text-center">
                    <img src={mascot} alt="Mascot" className="w-24 h-auto" />
                    <img src={logo} alt="Trellis" className="h-10 w-auto object-contain" />
                    <p className="text-slate-400 text-sm font-medium">Your programming guardian.</p>
                </div>

                {/* RIGHT SECTION: Glass Card */}
                <div className="glass-card w-full max-w-md p-12">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center italic">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>

                    <form onSubmit={handleAction} className="space-y-6">
                        {/* Animation (Reduced size above buttons) */}
                        <div className="flex h-16 w-full justify-center overflow-hidden">
                            <Lottie animationData={loginAnim} loop={true} className="h-20" />
                        </div>

                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Name"
                                className="glass-input"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="glass-input"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="glass-input"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <button type="submit" className="btn-blue">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-400 text-sm hover:text-white underline underline-offset-8 decoration-blue-500"
                        >
                            {isLogin ? "Need an account? Sign up" : "Already a member? Log in"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;