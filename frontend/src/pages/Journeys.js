import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Terminal,
    FileCode,
    Codepen,
    Coffee,
    CheckCircle2,
    Map,
    Zap,
    Flame,
    Trophy,
    Shield,
    BookOpen,
    Target,
    Settings
} from 'lucide-react';
import YipHead from '../assets/Yip_head.png';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MiniLeaderboard from '../components/MiniLeaderboard';
import DailyGoals from '../components/DailyGoals';

const Journeys = () => {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = React.useState(localStorage.getItem('selectedCourse') || 'html');
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const courses = [
        {
            id: 'python',
            name: 'Python',
            icon: <Terminal className="w-8 h-8 text-blue-400" />,
            color: 'from-blue-500/10 to-blue-600/5'
        },
        {
            id: 'html',
            name: 'HTML',
            icon: <FileCode className="w-8 h-8 text-orange-400" />,
            color: 'from-orange-500/10 to-orange-600/5'
        },
        {
            id: 'javascript',
            name: 'JavaScript',
            icon: <Codepen className="w-8 h-8 text-yellow-400" />,
            color: 'from-yellow-500/10 to-yellow-600/5'
        },
        {
            id: 'java',
            name: 'Java',
            icon: <Coffee className="w-8 h-8 text-red-400" />,
            color: 'from-red-500/10 to-red-600/5'
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#111827] text-white font-['Inter',sans-serif]">

            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-16 md:ml-24 mr-0 lg:mr-[300px] p-8 lg:p-12 overflow-y-auto h-screen invisible-scrollbar">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Coding Journeys</h1>
                        <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <motion.button
                                key={course.id}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCourse(course.id)}
                                className={`relative group p-6 rounded-[1.5rem] border-2 transition-all text-left flex flex-col items-center justify-center gap-4 overflow-hidden
                                    ${selectedCourse === course.id
                                        ? 'bg-[#1f2937] border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)]'
                                        : 'bg-[#1f2937]/50 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                                {/* Selection Checkmark */}
                                {selectedCourse === course.id && (
                                    <div className="absolute top-4 right-4 text-blue-500">
                                        <CheckCircle2 className="w-6 h-6 fill-current bg-white rounded-full" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                                    {course.icon}
                                    <div className="absolute inset-0 blur-2xl opacity-20 bg-current" />
                                </div>

                                {/* Text Info */}
                                <div className="relative text-center space-y-1">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                        {course.name}
                                    </h3>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Action Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-12 flex flex-col items-center gap-4"
                    >
                        {/* Show resume progress if user already has enrollment in this course */}
                        {(() => {
                            const existingJourney = user?.enrolledJourneys?.find(j =>
                                j.courseId && j.courseId.toLowerCase().trim() === selectedCourse.toLowerCase().trim()
                            );
                            const hasProgress = existingJourney && (existingJourney.maxSectionId > 1 || existingJourney.currentSectionId > 1 || existingJourney.progress > 0);
                            if (hasProgress) {
                                return (
                                    <div className="text-center space-y-1">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            📍 Section {existingJourney.currentSectionId} &middot; Lesson {existingJourney.progress + 1}
                                        </p>
                                        <p className="text-slate-600 text-[10px] uppercase tracking-widest">Your saved progress</p>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <button
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase px-12 py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                            onClick={async () => {
                                const token = localStorage.getItem('token');

                                // --- SMART RESUME LOGIC ---
                                // Check if the user already has progress in the selected course.
                                // If so, RESUME from where they left off instead of resetting to section 1.
                                const existingJourney = user?.enrolledJourneys?.find(j =>
                                    j.courseId && j.courseId.toLowerCase().trim() === selectedCourse.toLowerCase().trim()
                                );
                                const hasExistingProgress = existingJourney && (existingJourney.maxSectionId > 1 || existingJourney.currentSectionId > 1 || existingJourney.progress > 0);

                                if (hasExistingProgress) {
                                    // RESUME: Load saved progress from backend data
                                    const resumeSectionId = existingJourney.currentSectionId || 1;

                                    localStorage.setItem('selectedCourse', selectedCourse);
                                    localStorage.setItem('selectedSectionId', resumeSectionId);

                                    // Only update the active course on the backend, keep section/progress intact
                                    if (token) {
                                        try {
                                            await axios.patch('http://localhost:5000/api/auth/progress',
                                                { currentCourse: selectedCourse },
                                                { headers: { 'x-auth-token': token } }
                                            );
                                        } catch (err) {
                                            console.error("Error setting active course:", err);
                                        }
                                    }
                                    navigate('/dashboard');
                                } else {
                                    // FRESH START: No existing progress, begin from scratch
                                    if (token) {
                                        try {
                                            await axios.patch('http://localhost:5000/api/auth/progress',
                                                { currentCourse: selectedCourse, currentSectionId: 1, progress: 0 },
                                                { headers: { 'x-auth-token': token } }
                                            );
                                        } catch (err) {
                                            console.error("Error updating progress:", err);
                                        }
                                    }
                                    localStorage.setItem('selectedCourse', selectedCourse);
                                    localStorage.setItem('selectedSectionId', 1);
                                    navigate('/dashboard');
                                }
                            }}
                        >
                            {(() => {
                                const existingJourney = user?.enrolledJourneys?.find(j =>
                                    j.courseId && j.courseId.toLowerCase().trim() === selectedCourse.toLowerCase().trim()
                                );
                                const hasProgress = existingJourney && (existingJourney.maxSectionId > 1 || existingJourney.currentSectionId > 1 || existingJourney.progress > 0);
                                return hasProgress ? 'Resume Journey ▶' : 'Start Journey';
                            })()}
                        </button>
                    </motion.div>
                </div>
            </main>

            {/* RIGHT SIDEBAR: Stats */}
            <aside className="hidden lg:flex w-[300px] fixed right-0 top-0 bottom-0 bg-[#111827] border-l border-white/5 flex-col p-6 gap-6 invisible-scrollbar overflow-y-auto">
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
                    <h3 className="text-lg font-bold italic uppercase tracking-tighter mb-4">DAILY GOALS</h3>
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

const GoalItem = ({ title, current = 0, total = 1 }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300">{title}</span>
            <span className="text-[10px] font-black text-slate-500">{current}/{total}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(current / total) * 100}%` }} />
        </div>
    </div>
);

export default Journeys;
