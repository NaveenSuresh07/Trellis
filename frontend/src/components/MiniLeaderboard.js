import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import axios from 'axios';

const MiniLeaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/auth/leaderboard');
                setUsers(res.data.slice(0, 3));
            } catch (err) {
                console.error("MiniLeaderboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="w-full py-4 space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full space-y-2">
            {users.map((user, idx) => (
                <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-[#111827]/50 rounded-xl border border-white/5 hover:bg-white/5 transition-all group"
                >
                    <div className="w-6 text-center font-black text-[10px] text-slate-500 group-hover:text-slate-300">
                        {idx + 1}
                    </div>
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black border border-white/5 group-hover:border-blue-500/30">
                        {user.username[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate uppercase tracking-tight">
                            {user.username}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-blue-400/80">
                                {user.xp} XP
                            </p>
                            {user.selectedTitle && (
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-60">
                                    • {user.selectedTitle}
                                </span>
                            )}
                        </div>
                    </div>
                    {idx === 0 && <Trophy className="w-4 h-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />}
                    {idx > 0 && <Medal className={`w-3 h-3 ${idx === 1 ? 'text-slate-400' : 'text-amber-700'}`} />}
                </motion.div>
            ))}
        </div>
    );
};

export default MiniLeaderboard;
