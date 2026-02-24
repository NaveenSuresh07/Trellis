import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, GraduationCap, ChevronRight, Check } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const CORE_LANGUAGES = [
    { name: 'Javascript', icon: '🟨' },
    { name: 'HTML', icon: '🟧' },
    { name: 'C', icon: '🟦' },
    { name: 'Python', icon: '🟩' }
];

const SkillSelection = () => {
    const [teach, setTeach] = useState([]);
    const [learn, setLearn] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggle = (lang, list, setList) => {
        if (list.includes(lang)) {
            setList(list.filter(l => l !== lang));
        } else {
            setList([...list, lang]);
        }
    };

    const handleSave = async () => {
        if (teach.length === 0 && learn.length === 0) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/api/matchmaking/skills', {
                skillsToTeach: teach,
                skillsToLearn: learn
            }, {
                headers: { 'x-auth-token': token }
            });
            navigate('/nexus');
        } catch (err) {
            console.error('Save Skills Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-['Inter',sans-serif] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 p-6 lg:p-12 overflow-y-auto invisible-scrollbar">
                <div className="max-w-4xl mx-auto pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Personalize Your Nexus
                        </h1>
                        <p className="text-slate-400 text-lg">Tell us your stack so we can find your perfect study buddies.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Teach Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <GraduationCap className="text-emerald-400 w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">What can you teach?</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {CORE_LANGUAGES.map(lang => (
                                    <button
                                        key={lang.name}
                                        onClick={() => toggle(lang.name, teach, setTeach)}
                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${teach.includes(lang.name)
                                            ? 'bg-emerald-500/20 border-emerald-500/50 scale-[1.02]'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-2xl">{lang.icon}</span>
                                        <span className={`text-xs font-bold tracking-widest uppercase ${teach.includes(lang.name) ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {lang.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Learn Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                    <Code2 className="text-blue-400 w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">What do you want to learn?</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {CORE_LANGUAGES.map(lang => (
                                    <button
                                        key={lang.name}
                                        onClick={() => toggle(lang.name, learn, setLearn)}
                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${learn.includes(lang.name)
                                            ? 'bg-blue-500/20 border-blue-500/50 scale-[1.02]'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-2xl">{lang.icon}</span>
                                        <span className={`text-xs font-bold tracking-widest uppercase ${learn.includes(lang.name) ? 'text-blue-400' : 'text-slate-400'}`}>
                                            {lang.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 flex justify-center"
                    >
                        <button
                            onClick={handleSave}
                            disabled={loading || (teach.length === 0 && learn.length === 0)}
                            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Optimizing Profile...' : 'Enter the Nexus'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default SkillSelection;
