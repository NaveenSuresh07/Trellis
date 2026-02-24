import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/trellis_mascot.png";

const Onboarding = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#1b1529] items-center justify-center relative overflow-hidden font-['Varela_Round',sans-serif]">

            {/* Centered Content Container */}
            <div className="flex flex-col items-center justify-center -mt-20">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex flex-col items-center"
                >
                    {/* Speech Bubble */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="mb-6"
                    >
                        <div className="relative bg-white px-8 py-3 rounded-xl border border-gray-200 shadow-xl min-w-[160px]">
                            <span className="text-gray-800 text-lg font-bold text-center block leading-tight">
                                Hi there, I'm Yip!
                            </span>
                            {/* Speech Bubble Tail */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                                <div className="w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Mascot */}
                    <img
                        className="w-48 md:w-56 h-auto object-contain drop-shadow-2xl"
                        alt="Trellis mascot"
                        src={mascot}
                    />
                </motion.div>
            </div>

            {/* Bottom Right Button */}
            <div className="absolute bottom-10 right-10 md:bottom-16 md:right-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register-step2')}
                    className="flex h-14 min-w-[160px] items-center justify-center px-10 bg-[#575290] rounded-xl text-white font-bold text-lg uppercase tracking-wider shadow-[0px_4px_0px_#4c2b66] transition-all hover:bg-[#635cb0] active:shadow-none active:translate-y-[4px]"
                >
                    CONTINUE
                </motion.button>
            </div>

            {/* Subtle Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />
        </div>
    );
};

export default Onboarding;
