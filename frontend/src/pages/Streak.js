import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Flame,
    Zap,
    BookOpen,
    Target,
    Lock,
    Star,
    Settings,
    Shield,
    Trophy,
    Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import YipHead from '../assets/Yip_head.png';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MiniLeaderboard from '../components/MiniLeaderboard';
import DailyGoals from '../components/DailyGoals';

const Streak = () => {
    const navigate = useNavigate();
    const [viewDate, setViewDate] = React.useState(new Date());
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('http://127.0.0.1:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const dailyGoals = [
        { id: 1, title: 'Earn 90 XP', current: (user?.xp || 0) % 90, total: 90, icon: <Shield className="w-5 h-5 text-blue-400" /> },
        { id: 2, title: 'Complete 3 exercises', current: (user?.progress || 0) % 3, total: 3, icon: <BookOpen className="w-5 h-5 text-blue-400" /> },
        { id: 3, title: 'Solve 2 challenges on the first try', current: 0, total: 2, icon: <Target className="w-5 h-5 text-red-400" /> }
    ];

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const days = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDayOfMonth(currentMonth, currentYear) }, (_, i) => i);

    const isToday = (day) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    };

    const isDateActive = (day) => {
        if (!user || !user.activityDays) return false;
        // Format: YYYY-MM-DD
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return user.activityDays.includes(dateStr);
    };

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="flex min-h-screen bg-[#111827] text-white font-['Inter',sans-serif]">

            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-16 md:ml-24 mr-0 lg:mr-[300px] p-4 lg:p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl space-y-10">

                    {/* Streak Hero Section */}
                    <div className="text-center space-y-2 pt-6 relative">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative inline-block"
                        >
                            <Flame className="w-24 h-24 text-slate-700/50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-black text-white italic drop-shadow-xl mt-3">{user?.streak || 0}</span>
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">{user?.streak || 0} day streak</h1>
                        <p className="text-slate-400 font-bold text-sm">
                            {user?.streak > 0 ? "You're on fire! Keep it up!" : "Do a lesson today to start a new streak!"}
                        </p>
                    </div>

                    {/* Calendar Section - Compact & Dynamic */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#1f2937] rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6 max-w-[450px] mx-auto"
                    >
                        {/* Month Header */}
                        <div className="flex justify-between items-center px-2">
                            <ChevronLeft className="w-6 h-6 text-slate-600 hover:text-white cursor-pointer transition-colors" onClick={prevMonth} />
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-300">{monthName} {currentYear}</h2>
                            <ChevronRight className="w-6 h-6 text-slate-600 hover:text-white cursor-pointer transition-colors" onClick={nextMonth} />
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
                            {dayLabels.map(day => (
                                <div key={day} className="text-slate-600 font-black text-[10px] uppercase tracking-widest mb-1">{day}</div>
                            ))}
                            {blanks.map(blank => (
                                <div key={`blank-${blank}`} className="w-10 h-10" />
                            ))}
                            {days.map(day => {
                                const active = isDateActive(day);
                                const today = isToday(day);
                                return (
                                    <div key={day} className="relative flex items-center justify-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative
                                            ${today ? 'border-2 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' :
                                                active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-700'}
                                        `}>
                                            {day}
                                            {today && (
                                                <div className="absolute -inset-0.5 border border-orange-500/20 rounded-full animate-ping" />
                                            )}
                                            {active && (
                                                <div className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${today ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>



                </div>
            </main>

            {/* RIGHT SIDEBAR: Stats & Goals */}
            <aside className="hidden lg:flex w-[300px] fixed right-0 top-0 bottom-0 bg-[#111827] border-l border-white/5 flex-col p-6 gap-6 invisible-scrollbar overflow-y-auto">
                {/* Stats Bar */}
                <div className="flex justify-between items-center bg-[#1f2937] p-3 rounded-xl border border-white/5 shadow-lg relative">
                    <StatItem value={user?.xp || 0} type="xp" />
                    <StatItem value={user?.streak || 0} type="streak" onClick={() => navigate('/streak')} />
                </div>

                <div className="bg-[#1f2937] rounded-2xl p-5 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold italic uppercase tracking-tighter">Leaderboard</h3>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                        >
                            View
                        </button>
                    </div>
                    <MiniLeaderboard />
                </div>

                <div className="bg-[#1f2937] rounded-2xl p-5 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold italic uppercase tracking-tighter">Daily Goals</h3>
                    </div>
                    <DailyGoals user={user} />
                </div>
            </aside>
        </div>
    );
};


const StatItem = ({ value, type, onClick }) => (
    <div
        onClick={onClick}
        className={`flex flex-col items-center gap-0.5 p-2 bg-slate-800/40 rounded-xl border border-white/5 flex-1 min-w-[80px] transition-all hover:bg-slate-800/60 ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="w-8 h-8 flex items-center justify-center">
            {type === "xp" ? (
                <Shield className="w-6 h-6 text-blue-400" />
            ) : (
                <Flame className="w-6 h-6 text-orange-500" />
            )}
        </div>
        <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-slate-300">{value}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{type}</span>
        </div>
    </div>
);

export default Streak;
