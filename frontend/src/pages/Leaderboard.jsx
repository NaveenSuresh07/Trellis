import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Zap, User, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Public fetch - doesn't need token
            const usersRes = await axios.get('http://127.0.0.1:5000/api/auth/leaderboard');
            setUsers(usersRes.data);

            // Private fetch - needs token
            const token = localStorage.getItem('token');
            if (token) {
                const meRes = await axios.get('http://127.0.0.1:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setCurrentUser(meRes.data);
            }
        } catch (err) {
            console.error('Leaderboard Fetch Error:', err);
            setError(err.response?.data?.msg || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const myRank = users.findIndex(u => u._id === currentUser?._id);

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 font-['Inter',sans-serif] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 p-6 lg:p-12 overflow-y-auto pb-48">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16 relative">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="inline-block p-5 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2.5rem] mb-6 shadow-2xl shadow-yellow-500/20"
                        >
                            <Trophy className="w-14 h-14 text-white drop-shadow-lg" />
                        </motion.div>
                        <h1 className="text-5xl font-black tracking-tight mb-3 uppercase italic">Rookie League</h1>
                        <div className="flex items-center justify-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                            <div className="h-[1px] w-12 bg-white/10" />
                            Top 7 advance to the next league
                            <div className="h-[1px] w-12 bg-white/10" />
                        </div>
                    </div>

                    {/* Podium / Top-3 Cards */}
                    {!loading && users.length > 0 && (
                        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 px-4">
                            {/* 2nd Place */}
                            {users.length >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="order-2 md:order-1 flex-1 w-full max-w-[240px]"
                                >
                                    <div className="bg-[#1e293b] border border-white/5 rounded-[2.5rem] p-6 text-center shadow-xl relative overflow-hidden group hover:border-slate-400/30 transition-all">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-400/50" />
                                        <div className="w-16 h-16 bg-slate-700/50 rounded-2xl mx-auto mb-4 border border-slate-400/30 flex items-center justify-center text-2xl font-black shadow-lg">
                                            {users[1].username[0]}
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 truncate">{users[1].username}</h3>
                                        {users[1].selectedTitle && (
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 opacity-80">
                                                {users[1].selectedTitle}
                                            </p>
                                        )}
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">{users[1].xp} XP</p>
                                        <div className="inline-flex items-center gap-2 bg-slate-700/30 px-3 py-1 rounded-full text-[10px] font-black text-slate-300 border border-slate-300/10">
                                            <Medal className="w-3 h-3 text-slate-300" /> SILVER
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="order-1 md:order-2 flex-1 w-full max-w-[280px] -mb-4 z-10"
                            >
                                <div className="bg-[#1e293b] border-2 border-yellow-500/30 rounded-[3rem] p-8 text-center shadow-2xl shadow-yellow-500/10 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
                                    <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce" />
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-yellow-500/20">
                                        {users[0].username[0]}
                                    </div>
                                    <h3 className="font-black text-xl mb-1 truncate uppercase tracking-tighter">{users[0].username}</h3>
                                    {users[0].selectedTitle && (
                                        <p className="text-[11px] font-bold text-yellow-500/60 uppercase tracking-tighter mb-2 italic">
                                            {users[0].selectedTitle}
                                        </p>
                                    )}
                                    <p className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-6">{users[0].xp} XP</p>
                                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-5 py-2 rounded-2xl text-[10px] font-black text-yellow-500 border border-yellow-500/20">
                                        <Trophy className="w-3 h-3" /> RANK #1
                                    </div>
                                </div>
                            </motion.div>

                            {/* 3rd Place */}
                            {users.length >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-3 md:order-3 flex-1 w-full max-w-[220px]"
                                >
                                    <div className="bg-[#1e293b] border border-white/5 rounded-[2.5rem] p-6 text-center shadow-xl relative overflow-hidden group hover:border-amber-700/30 transition-all">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-700/50" />
                                        <div className="w-16 h-16 bg-amber-900/30 rounded-2xl mx-auto mb-4 border border-amber-700/30 flex items-center justify-center text-2xl font-black shadow-lg">
                                            {users[2].username[0]}
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 truncate">{users[2].username}</h3>
                                        {users[2].selectedTitle && (
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 opacity-80">
                                                {users[2].selectedTitle}
                                            </p>
                                        )}
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">{users[2].xp} XP</p>
                                        <div className="inline-flex items-center gap-2 bg-amber-900/20 px-3 py-1 rounded-full text-[10px] font-black text-amber-600 border border-amber-600/10">
                                            <Medal className="w-3 h-3 text-amber-600" /> BRONZE
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Ranking Table List */}
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-[3rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
                        {loading ? (
                            <div className="p-12 space-y-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-20 text-center">
                                <p className="text-red-400 font-bold mb-4">Error: {error}</p>
                                <button
                                    onClick={fetchData}
                                    className="px-6 py-2 bg-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-all"
                                >
                                    Retry Fetch
                                </button>
                            </div>
                        ) : users.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {users.slice(users.length > 3 ? 3 : 0).map((user, idx) => {
                                    const rank = users.length > 3 ? idx + 4 : idx + 1;
                                    return (
                                        <motion.div
                                            key={user._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`flex items-center gap-6 p-6 hover:bg-white/5 transition-all group ${user._id === currentUser?._id ? 'bg-blue-600/5' : ''}`}
                                        >
                                            <div className="w-10 text-center text-lg font-black text-slate-600 group-hover:text-slate-400 transition-colors">
                                                {rank}
                                            </div>
                                            <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-xl font-black group-hover:from-blue-600 group-hover:to-indigo-600 transition-all border border-white/5">
                                                {user.username[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">{user.username}</h4>
                                                    {user.selectedTitle && (
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter opacity-70">
                                                            • {user.selectedTitle}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.major || 'Learner'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-blue-400 tracking-tighter">{user.xp.toLocaleString()}</p>
                                                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">Total XP</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-20 text-center opacity-50">
                                <Star className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                                <p className="font-bold uppercase tracking-widest text-xs">Waiting for more competitors...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Sticky Current User Rank Sidebar/Footer */}
            <AnimatePresence>
                {!loading && currentUser && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-white/10 p-6 z-40 backdrop-blur-2xl bg-opacity-95 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="max-w-4xl mx-auto flex items-center justify-between gap-8">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-600/30 border border-blue-400/20">
                                    {myRank !== -1 ? myRank + 1 : '-'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Your Standing</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-black uppercase tracking-tight">{currentUser.username}</h4>
                                            {currentUser.selectedTitle && (
                                                <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-tighter italic">
                                                    {currentUser.selectedTitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white tracking-tighter">{currentUser.xp.toLocaleString()}<span className="text-[10px] text-slate-500 ml-1 tracking-widest uppercase">XP</span></p>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center justify-end gap-1 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:text-emerald-300 transition-colors cursor-pointer"
                                    >
                                        <ChevronRight className="w-3 h-3" /> Rank Up
                                    </Link>
                                </div>
                                <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                    <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaderboard;
