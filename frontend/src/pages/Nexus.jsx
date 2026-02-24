import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, GraduationCap, Code2, Send, Search, Filter } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Nexus = () => {
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPeers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://127.0.0.1:5000/api/matchmaking/peers', {
                    headers: { 'x-auth-token': token }
                });
                setPeers(res.data);
            } catch (err) {
                console.error('Fetch Peers Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPeers();
    }, []);

    const filteredPeers = peers.filter(p =>
        p.username.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsToTeach.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-['Inter',sans-serif] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 p-6 lg:p-12 overflow-y-auto invisible-scrollbar">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-xl">
                                    <Users className="text-blue-400 w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tight">The Nexus</h1>
                            </div>
                            <p className="text-slate-400 font-medium">Connecting you with peers who teach what you need.</p>
                        </div>

                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by skill or username..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : filteredPeers.length === 0 ? (
                        <div className="text-center py-20 bg-[#1e293b]/30 rounded-[3rem] border border-dashed border-white/10">
                            <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">No peers found yet</h3>
                            <p className="text-slate-600 mt-2">Try updating your skills or check back later!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredPeers.map((peer, idx) => (
                                    <motion.div
                                        key={peer._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-[#1e293b] border border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
                                    >
                                        {/* Match Badge */}
                                        {peer.matchScore > 1 && (
                                            <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 backdrop-blur-md">
                                                {peer.matchScore}x Match
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-900/40">
                                                    {peer.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{peer.username}</h3>
                                                    {peer.selectedTitle && (
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">
                                                            {peer.selectedTitle}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">{peer.major || 'Computer Science'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {peer.skillsToTeach.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <GraduationCap className="w-3 h-3" /> {s}
                                                        </span>
                                                    ))}
                                                    {peer.skillsToLearn.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <Code2 className="w-3 h-3" /> {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Level</p>
                                                    <p className="text-xs font-bold text-blue-400">{Math.floor(peer.xp / 1000) + 1}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Streak</p>
                                                    <p className="text-xs font-bold text-orange-400">{peer.streak}🔥</p>
                                                </div>
                                            </div>

                                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2">
                                                Send Request <Send className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Nexus;
