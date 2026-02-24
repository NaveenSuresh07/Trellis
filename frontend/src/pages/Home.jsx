import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Terminal,
    FileCode,
    Codepen,
    Coffee,
    Cpu,
    Database,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Globe,
    Share2,
    Settings,
    HelpCircle,
    BarChart3,
    Layers,
    Play,
    Shield,
    MessageSquare,
    Search
} from "lucide-react";

import logo from "../assets/Logo.jpeg";
import trellisMascot from "../assets/trellis_mascot.png";

const languages = [
    { name: "Python", icon: <Terminal className="w-full h-full text-blue-400" /> },
    { name: "HTML", icon: <FileCode className="w-full h-full text-orange-400" /> },
    { name: "JavaScript", icon: <Codepen className="w-full h-full text-yellow-400" /> },
    { name: "Java", icon: <Coffee className="w-full h-full text-red-400" /> },
    { name: "C++", icon: <Cpu className="w-full h-full text-blue-500" /> },
    { name: "SQL", icon: <Database className="w-full h-full text-green-400" /> },
];

const additionalLinks = [
    { id: "link2", icon: <Globe className="w-full h-full" />, alt: "Link" },
    { id: "link3", icon: <Share2 className="w-full h-full" />, alt: "Link" },
    { id: "link4", icon: <Settings className="w-full h-full" />, alt: "Link" },
    { id: "link5", icon: <HelpCircle className="w-full h-full" />, alt: "Link" },
    { id: "link6", icon: <BarChart3 className="w-full h-full" />, alt: "Link" },
    { id: "link7", icon: <Layers className="w-full h-full" />, alt: "Link" },
    { id: "link8", icon: <Play className="w-full h-full" />, alt: "Link" },
    { id: "link9", icon: <Shield className="w-full h-full" />, alt: "Link" },
    { id: "link10", icon: <MessageSquare className="w-full h-full" />, alt: "Link" },
    { id: "link", icon: <Search className="w-full h-full" />, alt: "Link" },
];

const languagePositions = [
    "left-[calc(50.00%_-_425px)]",
    "left-[calc(50.00%_-_264px)]",
    "left-[calc(50.00%_-_114px)]",
    "left-[calc(50.00%_+_75px)]",
    "left-[calc(50.00%_+_209px)]",
    "left-[calc(50.00%_+_338px)]",
];

const languageWidths = [
    "w-[113px]",
    "w-[102px]",
    "w-[142px]",
    "w-[86px]",
    "w-20",
    "w-[84px]",
];

const linkPositions = [
    "left-[calc(50.00%_+_470px)]",
    "left-[calc(50.00%_+_576px)]",
    "left-[calc(50.00%_+_706px)]",
    "left-[calc(50.00%_+_824px)]",
    "left-[calc(50.00%_+_958px)]",
    "left-[calc(50.00%_+_1092px)]",
    "left-[calc(50.00%_+_1215px)]",
    "left-[calc(50.00%_+_1321px)]",
    "left-[calc(50.00%_+_1457px)]",
    "left-[calc(50.00%_+_1584px)]",
];

const linkWidths = [
    "w-[58px]",
    "w-[83px]",
    "w-[70px]",
    "w-[86px]",
    "w-[85px]",
    "w-[75px]",
    "w-[58px]",
    "w-[88px]",
    "w-[79px]",
    "w-[94px]",
];

const Home = () => {
    const navigate = useNavigate();
    const [selectedLanguage] = useState("English");

    return (
        <div className="relative w-full min-h-screen bg-[#1b1529] overflow-hidden flex flex-col items-center justify-center">

            {/* Header / Logo Section */}
            <header className="absolute top-4 left-6 md:top-6 md:left-10 w-48 md:w-64 h-auto z-50">
                <img
                    className="w-full h-auto object-contain brightness-110 drop-shadow-lg"
                    alt="Trellis Logo"
                    src={logo}
                />
            </header>

            {/* Language Selector */}
            <nav
                className="absolute top-8 right-6 md:top-10 md:right-12 z-50"
                aria-label="Language selector"
            >
                <button
                    className="w-[180px] md:w-[201px] h-10 flex bg-white rounded-lg border-2 border-solid border-[#884c4c] items-center px-4 cursor-pointer hover:bg-gray-50 transition-all shadow-md active:scale-95"
                    aria-label="Select language"
                >
                    <div className="h-[18px] w-6 flex items-center justify-center text-blue-600">
                        <Globe className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-center font-['Varela_Round',sans-serif] font-normal text-[#0000008a] text-base md:text-lg">
                        {selectedLanguage}
                    </span>
                    <ChevronDown className="w-5 h-5 text-black/50" />
                </button>
            </nav>

            {/* Main Section */}
            <main className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 p-10 mt-10 w-full max-w-7xl z-10">

                {/* Mascot Integration */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        className="w-full max-w-[450px] aspect-square object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in"
                        alt="Trellis mascot character"
                        src={trellisMascot}
                    />
                </div>

                {/* Text & Buttons */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-10">
                    <h1 className="font-['Varela_Round',sans-serif] font-normal text-[#ffffffde] text-3xl md:text-4xl lg:text-5xl text-center md:text-left leading-tight drop-shadow-md">
                        The free, fun, and effective way
                        <br />
                        to learn to code!
                    </h1>

                    <div className="flex flex-col gap-6 w-full max-w-[350px]">
                        <button
                            className="w-full h-14 bg-[#784b99] rounded-xl overflow-hidden shadow-[0px_6px_0px_#4c2b66] cursor-pointer hover:bg-[#8a5aab] hover:translate-y-[2px] transition-all active:translate-y-[6px] active:shadow-none"
                            aria-label="Get started with learning to code"
                            onClick={() => navigate('/register')}
                        >
                            <span className="flex items-center justify-center font-['Varela_Round',sans-serif] font-bold text-[#ffffffde] text-lg tracking-widest">
                                GET STARTED
                            </span>
                        </button>

                        <button
                            className="w-full h-14 bg-[#3c3549] rounded-xl border-2 border-solid border-[#b3b3b3] shadow-[0px_5px_0px_#b3b3b3] cursor-pointer hover:bg-[#4a4157] hover:translate-y-[1px] transition-all active:translate-y-[5px] active:shadow-none"
                            aria-label="Sign in to existing account"
                            onClick={() => navigate('/login')}
                        >
                            <span className="flex items-center justify-center font-['Varela_Round',sans-serif] font-bold text-[#29abe2] text-lg tracking-widest">
                                I ALREADY HAVE AN ACCOUNT
                            </span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="absolute bottom-0 left-0 w-full h-24 bg-[#174c70] flex items-center px-6 md:px-12 border-t border-white/5 overflow-hidden">
                <button
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>

                <div className="flex-1 mx-4 overflow-hidden relative h-full flex items-center">
                    <nav className="flex items-center gap-12 animate-marquee whitespace-nowrap" style={{ '--duration': '40s', '--gap': '48px' }}>
                        {languages.concat(languages).map((lang, index) => (
                            <div
                                key={`${lang.name}-${index}`}
                                className="flex items-center gap-4 opacity-[0.64] hover:opacity-100 transition-opacity cursor-pointer group"
                            >
                                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {lang.icon}
                                </div>
                                <span className="font-['Varela_Round',sans-serif] font-normal text-[#ffffffde] text-xl tracking-tight">
                                    {lang.name}
                                </span>
                            </div>
                        ))}

                        {/* Divider */}
                        <div className="w-[1px] h-10 bg-white/10 mx-6" />

                        {additionalLinks.map((link, index) => (
                            <div
                                key={index}
                                className="w-8 h-8 opacity-[0.64] hover:opacity-100 transition-all cursor-pointer hover:scale-125 hover:text-blue-400 text-slate-400"
                            >
                                {link.icon}
                            </div>
                        ))}
                    </nav>
                </div>

                <button
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </footer>

            {/* Background blurs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default Home;
