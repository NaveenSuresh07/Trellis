import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import mascot from "../assets/trellis_mascot.png";

const OnboardingStep6 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, commitment } = location.state || {};

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
                        initial={{ width: "95%" }}
                        animate={{ width: "100%" }}
                        className="h-full bg-[#4a90e2] rounded-full"
                    />
                </div>
            </div>

            {/* Centered Content: Mascot & Bubble */}
            <div className="flex-1 flex flex-col items-center justify-center gap-12 -mt-20">
                <div className="relative flex flex-col items-center">
                    {/* Speech Bubble Above Mascot */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                        className="relative bg-[#2d243d] border border-white/10 px-8 py-5 rounded-2xl shadow-2xl mb-12 max-w-sm"
                    >
                        <p className="text-white text-2xl font-medium leading-tight text-center">
                            Ready for an exciting journey?
                        </p>
                        {/* Tail pointing down */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2d243d] border-r border-b border-white/10 rotate-45" />
                    </motion.div>

                    {/* Large Mascot */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <img
                            src={mascot}
                            alt="Mascot"
                            className="w-72 h-72 object-contain drop-shadow-[0_20px_50px_rgba(74,144,226,0.3)]"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Bar Container */}
            <div className="w-full max-w-4xl flex justify-end pb-4">
                <button
                    onClick={() => navigate('/register-step7', { state: { ...location.state } })}
                    className="h-14 px-12 bg-blue-600 text-white rounded-xl font-bold text-lg uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
                >
                    CONTINUE
                </button>
            </div>

            {/* Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default OnboardingStep6;
