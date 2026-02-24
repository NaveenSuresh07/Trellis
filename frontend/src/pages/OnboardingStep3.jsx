import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    Brain,
    TrendingUp,
    Gamepad2,
    GraduationCap,
    Rocket,
    Palette,
    MoreHorizontal,
    ArrowLeft,
    X
} from "lucide-react";
import mascot from "../assets/trellis_mascot.png";

const OnboardingStep3 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const language = location.state?.language || "coding";
    const [selected, setSelected] = useState(null);

    const options = [
        { id: "explore", name: "Explore what is coding", icon: <Search /> },
        { id: "brain", name: "Challenge my brain", icon: <Brain /> },
        { id: "career", name: "Boost my career", icon: <TrendingUp /> },
        { id: "fun", name: "Just for fun", icon: <Gamepad2 /> },
        { id: "education", name: "Support my education", icon: <GraduationCap /> },
        { id: "apps", name: "Build my own apps", icon: <Rocket /> },
        { id: "creative", name: "Expand creative skills", icon: <Palette /> },
        { id: "other", name: "Other", icon: <MoreHorizontal /> }
    ];

    const messages = {
        default: `Why are you learning ${language.charAt(0).toUpperCase() + language.slice(1)}?`,
        explore: "Welcome to the world of limitless creations!",
        brain: "Brain, meet your toughest opponent: code.",
        career: "High-income skills? You've come to the right place.",
        fun: "Fun fact: Coding is basically solving puzzles all day.",
        education: "Let's turn that 'A' into an 'A+' with Trellis.",
        apps: "From idea to App Store—one step at a time.",
        creative: "Who said coding wasn't a form of art?",
        other: "Whatever your goal, we're here to help you crush it."
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
                        initial={{ width: "40%" }}
                        animate={{ width: "65%" }}
                        className="h-full bg-[#4a90e2] rounded-full"
                    />
                </div>
            </div>

            {/* Header: Mascot & Bubble */}
            <div className="flex items-center gap-12 mb-12">
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

            {/* Grid of options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl z-10 px-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all group ${selected === opt.id
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-[#2d243d] border-transparent hover:border-white/10'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center transition-colors ${selected === opt.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
                            }`}>
                            {React.cloneElement(opt.icon, { className: "w-6 h-6" })}
                        </div>
                        <span className="text-white text-lg font-medium">{opt.name}</span>
                    </button>
                ))}
            </div>

            {/* Bottom Bar Container */}
            <div className="mt-auto w-full max-w-4xl flex justify-end pb-4 pt-10">
                <button
                    onClick={() => navigate('/register-step4', { state: { language, goal: selected } })}
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

export default OnboardingStep3;
