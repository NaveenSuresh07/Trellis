import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Clock,
    ArrowLeft,
    X
} from "lucide-react";
import mascot from "../assets/trellis_mascot.png";

const OnboardingStep5 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const language = location.state?.language || "coding";
    const [selected, setSelected] = useState(null);

    const options = [
        { id: "5min", name: "5 min per day", label: "Easygoing" },
        { id: "15min", name: "15 min per day", label: "Standard" },
        { id: "30min", name: "30 min per day", label: "Committed" },
        { id: "60min", name: "60 min per day", label: "Immersive" }
    ];

    const messages = {
        default: "How much are you ready to commit?",
        "5min": "5 minutes is all it takes to build a habit!",
        "15min": "15 minutes? A perfect balance for a busy schedule.",
        "30min": "30 minutes! Now we're getting serious about progress.",
        "60min": "60 minutes! Immersive learning is the fastest way to mastery."
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#1b1529] items-center p-6 md:p-12 relative overflow-hidden font-['Varela_Round',sans-serif]">

            {/* Top Navigation / Progress */}
            <div className="w-full max-w-7xl flex items-center gap-6 mb-12">
                <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <button onClick={() => navigate('/')} className="text-white/60 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "85%" }}
                        animate={{ width: "95%" }}
                        className="h-full bg-[#4a90e2] rounded-full"
                    />
                </div>
            </div>

            {/* Header: Mascot & Bubble */}
            <div className="flex items-center gap-12 mb-16">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="relative"
                >
                    <img src={mascot} alt="Mascot" className="w-48 h-48 object-contain" />
                </motion.div>

                <motion.div
                    key={selected || 'default'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative bg-[#2d243d] border border-white/10 px-6 py-4 rounded-xl shadow-2xl max-w-[280px]"
                >
                    <p className="text-white text-lg font-medium leading-tight text-center">
                        {messages[selected] || messages.default}
                    </p>
                    {/* Tail */}
                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#2d243d] border-l border-b border-white/10 rotate-45" />
                </motion.div>
            </div>

            {/* List of options */}
            <div className="flex flex-col gap-3 w-full max-w-md z-10 px-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all group ${selected === opt.id
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-[#2d243d] border-transparent hover:border-white/10'
                            }`}
                    >
                        <span className="text-white text-lg font-bold">{opt.name}</span>
                        <span className={`text-sm font-medium transition-colors ${selected === opt.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
                            }`}>
                            {opt.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bottom Bar Container */}
            <div className="mt-auto w-full max-w-4xl flex justify-end pb-4 pt-10">
                <button
                    onClick={() => navigate('/register-step6', { state: { ...location.state, commitment: selected } })}
                    disabled={!selected}
                    className={`h-14 px-12 rounded-xl font-bold text-lg uppercase tracking-wider transition-all ${selected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
            </div>

            {/* Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default OnboardingStep5;
