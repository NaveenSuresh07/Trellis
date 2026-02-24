import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Award,
    Shield,
    Flame,
    Trophy
} from 'lucide-react';
import { courseData } from '../data/courses';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MiniLeaderboard from '../components/MiniLeaderboard';
import DailyGoals from '../components/DailyGoals';

const Sections = () => {
    const navigate = useNavigate();
    const [currentCourseId, setCurrentCourseId] = React.useState(localStorage.getItem('selectedCourse') || 'html');
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
                if (res.data.currentCourse) {
                    const normalizedCourse = res.data.currentCourse.toLowerCase();
                    setCurrentCourseId(normalizedCourse);
                    localStorage.setItem('selectedCourse', normalizedCourse);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const activeCourse = courseData[currentCourseId] || courseData.html;

    // FIND JOURNEY PROGRESS: Centralized lookup for consistency
    const courseJourney = user?.enrolledJourneys?.find(j =>
        j.courseId && j.courseId.toLowerCase().trim() === currentCourseId.toLowerCase().trim()
    );
    const focusSectionId = courseJourney?.currentSectionId || 1;
    const maxSectionId = courseJourney?.maxSectionId || focusSectionId;
    const sectionProgress = courseJourney?.progress || 0;

    const handleJumpToSection = async (sectionId) => {
        const token = localStorage.getItem('token');

        // Optimistically update localStorage
        localStorage.setItem('selectedSectionId', sectionId);

        if (token) {
            try {
                // IMPORTANT: Await the patch before navigating to prevent race conditions
                // where Dashboard fetches old data before the jump is committed.
                await axios.patch('http://localhost:5000/api/auth/progress',
                    { currentSectionId: sectionId, currentCourse: currentCourseId, progress: 0 },
                    { headers: { 'x-auth-token': token } }
                );
            } catch (err) {
                console.error("Error updating progress:", err);
            }
        }

        navigate('/dashboard');
    };

    return (
        <div className="flex min-h-screen bg-[#111827] text-white font-['Inter',sans-serif]">
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-16 md:ml-24 mr-0 lg:mr-[300px] p-8 lg:p-12 overflow-y-auto h-screen invisible-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* Back Header */}
                    <button
                        onClick={() => navigate('/journeys')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black uppercase text-sm group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>

                    {/* Course Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                            {activeCourse.title}
                        </h1>
                        <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
                    </div>

                    {/* Sections List */}
                    <div className="space-y-6">
                        {activeCourse.sections.map((section, idx) => {
                            const isCompleted = section.id < maxSectionId;
                            const isCurrent = section.id === focusSectionId;
                            const progressText = isCompleted
                                ? `${section.lessons.length} / ${section.lessons.length} lessons`
                                : isCurrent
                                    ? `${sectionProgress} / ${section.lessons.length} lessons`
                                    : `0 / ${section.lessons.length} lessons`;

                            const percent = isCompleted ? 100 : isCurrent ? Math.round((sectionProgress / section.lessons.length) * 100) : 0;

                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#1f2937]/50 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-[#1f2937] transition-all"
                                >
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4 max-w-xl">
                                            <div className="space-y-1">
                                                <span className="text-blue-500 font-bold text-sm uppercase tracking-widest">Section {section.id}</span>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">{section.title}</h3>
                                            </div>
                                            <p className="text-slate-400 font-medium leading-relaxed">
                                                {section.description}
                                            </p>

                                            {/* Dynamic Progress Bar */}
                                            <div className="space-y-2 pt-2">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500/80">
                                                    <span>{progressText}</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl border border-white/10 transition-all ${isCompleted ? 'bg-blue-600/20 border-blue-500/30' : 'bg-white/5 opacity-40'}`}>
                                                <Award className={`w-6 h-6 ${isCompleted ? 'text-blue-400' : 'text-slate-400'}`} />
                                            </div>
                                            <button
                                                onClick={() => handleJumpToSection(section.id)}
                                                className="px-8 py-4 bg-slate-800/80 hover:bg-blue-600 text-slate-400 hover:text-white font-black italic uppercase text-sm rounded-2xl transition-all active:scale-95 border-2 border-white/5 hover:border-blue-500/30 shadow-xl"
                                            >
                                                Jump to Section
                                            </button>
                                        </div>
                                    </div>

                                    {/* Background Decorations */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
                                    <div className={`absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 blur-[50px] rounded-full -ml-16 -mb-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR: Stats (Mirroring Dashboard for consistency) */}
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
            </aside >
        </div >
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

export default Sections;
