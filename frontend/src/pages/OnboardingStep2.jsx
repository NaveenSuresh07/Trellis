import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Terminal, FileCode, Database, Cpu, HelpCircle } from "lucide-react";
import mascot from "../assets/trellis_mascot.png";

const OnboardingStep2 = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const options = [
        {
            id: "python",
            name: "Python",
            icon: <Terminal className="w-8 h-8 text-blue-400" />
        },
        {
            id: "html",
            name: "HTML",
            icon: <FileCode className="w-8 h-8 text-orange-400" />
        },
        {
            id: "sql",
            name: "SQL",
            icon: <Database className="w-8 h-8 text-green-400" />
        },
        {
            id: "c",
            name: "C",
            icon: <Cpu className="w-8 h-8 text-slate-400" />
        }
    ];

    const messages = {
        default: "What do you wish to learn?",
        python: "Great choice! Python makes everything feel possible.",
        html: "Excellent! HTML is the foundation of the entire web.",
        sql: "Smart! Data is the heart of every modern application.",
        c: "Impressive! Mastering C gives you ultimate control."
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#1b1529] items-center p-6 md:p-12 relative overflow-hidden font-['Varela_Round',sans-serif]">

            {/* Header: Mascot & Bubble */}
            <div className="flex items-center gap-12 mb-16 mt-8">
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
                    <p className="text-white text-lg font-medium leading-tight">
                        {messages[selected] || messages.default}
                    </p>
                    {/* Tail */}
                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#2d243d] border-l border-b border-white/10 rotate-45" />
                </motion.div>
            </div>

            {/* Grid of options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg z-10">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${selected === opt.id
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-[#2d243d] border-transparent hover:border-white/10'
                            }`}
                    >
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                            {React.cloneElement(opt.icon, { className: "w-6 h-6" })}
                        </div>
                        <span className="text-white text-xl font-bold">{opt.name}</span>
                    </button>
                ))}
            </div>

            {/* Bottom Bar Container */}
            <div className="mt-auto w-full max-w-4xl flex justify-end pb-4 pt-10">
                <button
                    onClick={() => navigate('/register-step3', { state: { language: selected } })}
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

export default OnboardingStep2;
