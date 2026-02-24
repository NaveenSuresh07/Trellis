import React from 'react';
import { motion } from 'framer-motion';
import {
    Layout,
    Shield,
    Trophy,
    Target,
    BookOpen,
    Settings,
    ChevronRight,
    ChevronLeft,
    Lock,
    Eye,
    Star,
    Flame,
    Crown,
    Map,
    Play
} from 'lucide-react';
import YipHead from '../assets/Yip_head.png';
import mascot from '../assets/trellis_mascot.png';
import { useNavigate } from 'react-router-dom';
import { courseData } from '../data/courses';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MiniLeaderboard from '../components/MiniLeaderboard';
import DailyGoals from '../components/DailyGoals';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [currentCourseId, setCurrentCourseId] = React.useState(localStorage.getItem('selectedCourse') || 'html');
    const [currentSectionId, setCurrentSectionId] = React.useState(parseInt(localStorage.getItem('selectedSectionId')) || 1);
    const [isClaiming, setIsClaiming] = React.useState(false);

    React.useEffect(() => {
        const fetchUserData = async () => {
            // Check for token in URL (from Social Login Redirect)
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');

            if (tokenFromUrl) {
                localStorage.setItem('token', tokenFromUrl);
                // Clean the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

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
                if (res.data.currentSectionId) {
                    const localS = parseInt(localStorage.getItem('selectedSectionId'));
                    if (localS && localS !== res.data.currentSectionId) {
                        // If DB is behind Local, keep Local focus but DON'T overwrite Local yet
                        console.log(`[SYNC] Preserved local section S:${localS} (Database returned S:${res.data.currentSectionId})`);
                        setCurrentSectionId(localS);
                    } else {
                        setCurrentSectionId(res.data.currentSectionId);
                        localStorage.setItem('selectedSectionId', res.data.currentSectionId);
                    }
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const currentCourse = courseData[currentCourseId] || courseData.html;

    // Improved Section Selection: Use last section if maxSectionId exceeds available sections (Course Mastered)
    const availableSections = currentCourse.sections || [];
    let targetSection = availableSections.find(s => s.id === currentSectionId);

    // If currentSectionId is beyond available sections, we have MASTERED the course
    const isCourseMastered = !targetSection && currentSectionId > availableSections.length;

    // Use last section if mastered or fallback to first
    const currentSection = targetSection || (isCourseMastered ? availableSections[availableSections.length - 1] : availableSections[0]);

    const dailyGoals = [
        { id: 1, title: 'Earn 90 XP', current: user?.xp || 0, total: 90, icon: <Shield className="w-5 h-5 text-blue-400" /> },
        { id: 2, title: 'Complete 3 exercises', current: user?.exercisesCompletedToday || 0, total: 3, icon: <BookOpen className="w-5 h-5 text-blue-400" /> },
        { id: 3, title: 'Solve 2 challenges on the first try', current: user?.firstTrySolves || 0, total: 2, icon: <Target className="w-5 h-5 text-red-400" /> }
    ];

    const handleLessonClick = (nodeId) => {
        navigate(`/lesson/${currentCourseId}/${currentSectionId}/${nodeId}`);
    };

    const learningPath = currentSection.lessons;
    const courseJourney = user?.enrolledJourneys?.find(j =>
        j.courseId && j.courseId.toLowerCase().trim() === currentCourseId.toLowerCase().trim()
    );
    const courseProgress = courseJourney?.progress || 0;
    const focusSectionId = courseJourney?.currentSectionId || 1;
    const maxSectionId = courseJourney?.maxSectionId || focusSectionId;

    // Is the user viewing a section they already finished?
    const isSectionAlreadyMastered = maxSectionId > currentSectionId;
    const isSectionCompleted = isSectionAlreadyMastered || (courseProgress >= learningPath.length);

    const handleCompleteSection = async () => {
        console.log("[DEBUG] handleCompleteSection called. isSectionCompleted:", isSectionCompleted);
        if (!isSectionCompleted || isClaiming || isSectionAlreadyMastered) return;

        setIsClaiming(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("[DEBUG] No token found in localStorage");
            setIsClaiming(false);
            return;
        }

        try {
            console.log("[DEBUG] Sending section completion request for course:", currentCourseId);
            const res = await axios.patch('http://localhost:5000/api/auth/progress', {
                currentCourse: currentCourseId,
                completeSection: true
            }, {
                headers: { 'x-auth-token': token }
            });
            console.log("[DEBUG] Section completion response:", res.data);

            const updatedUser = res.data;
            setUser(updatedUser);
            setCurrentSectionId(updatedUser.currentSectionId);
            localStorage.setItem('selectedSectionId', updatedUser.currentSectionId);

            console.log("[DEBUG] Successfully updated user. Forcing Hard Reset.");

            // HARD RESET: Clear transients and force fresh load from root
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (err) {
            console.error("[DEBUG] Error completing section:", err.response?.data || err.message);
            setIsClaiming(false);
            // Only alert on ACTUAL failure
            alert(err.response?.data?.msg || "Failed to claim reward. Please try again!");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#111827] text-white font-['Inter',sans-serif]">

            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-16 md:ml-24 mr-0 lg:mr-[300px] p-4 lg:p-6 flex flex-col items-center">

                {/* Learning Path Header */}
                <div className="w-full max-w-2xl bg-[#1e293b] rounded-2xl p-6 mb-12 relative overflow-hidden shadow-2xl border border-white/5">
                    <div className="relative z-10">
                        <button
                            onClick={() => navigate('/sections')}
                            className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 hover:text-blue-300 transition-colors group"
                        >
                            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Section {currentSection.id}: {currentSection.title}</span>
                        </button>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{currentCourse.title}</h1>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                </div>

                <div className="flex flex-col items-center gap-8 relative pb-32">
                    {/* Connection Line */}
                    <div className="absolute top-0 bottom-[140px] left-1/2 -translate-x-1/2 w-2 bg-slate-700/50 shadow-[0_0_15px_rgba(30,41,59,0.5)]" />

                    {learningPath.map((node, index) => {
                        let status = 'locked';
                        if (isSectionAlreadyMastered || isCourseMastered) {
                            status = 'completed';
                        } else {
                            if (index < courseProgress) status = 'completed';
                            else if (index === courseProgress) status = 'current';
                        }

                        return (
                            <PathNode
                                key={node.id}
                                node={{ ...node, status }}
                                index={index}
                                onClick={() => handleLessonClick(node.id)}
                            />
                        );
                    })}

                    {/* Final Trophy Node */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: isSectionCompleted ? 1.1 : 1, opacity: 1 }}
                        whileHover={isSectionCompleted ? { scale: 1.2 } : { scale: 1 }}
                        className="relative z-20 mt-8"
                    >
                        <div
                            onClick={(e) => {
                                console.log("[DEBUG] Trophy clicked!");
                                handleCompleteSection();
                            }}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex flex-col items-center justify-center border-4 transition-all cursor-pointer relative overflow-hidden group
                                ${isSectionCompleted
                                    ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-yellow-300 shadow-[0_0_50px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)]'
                                    : 'bg-[#1f2937] border-slate-800 pointer-events-none opacity-50'
                                }`}>

                            {isSectionCompleted && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-50"
                                />
                            )}

                            <Trophy className={`w-10 h-10 relative z-10 transition-all ${isClaiming ? 'animate-bounce' : ''} ${(isSectionCompleted || isCourseMastered) ? 'text-white drop-shadow-lg scale-110' : 'text-slate-700'}`} />

                            {(isSectionCompleted || isCourseMastered) && (
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter text-center leading-[0.8] mt-2 relative z-10 animate-pulse px-2">
                                    {isCourseMastered ? 'Course Mastered! 👑' : isSectionAlreadyMastered ? 'Section Mastered!' : isClaiming ? 'Claiming...' : 'Claim +100 XP'}
                                </span>
                            )}
                        </div>

                        {/* Connection Line to Trophy */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-slate-700/50 -translate-y-full" />
                    </motion.div>
                </div>
            </main>

            {/* RIGHT SIDEBAR: Stats, Journeys & Goals */}
            <aside className="hidden lg:flex w-[320px] fixed right-0 top-0 bottom-0 bg-[#0f172a] border-l border-white/5 flex-col p-6 gap-6 invisible-scrollbar overflow-y-auto z-40">

                {/* Header Stats Bar */}
                <div className="flex justify-between items-center bg-[#1f2937] p-3 rounded-2xl border border-white/5 shadow-lg relative min-h-[70px]">
                    {!user ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <StatItem value={user.xp || 0} type="xp" />
                            <div className="w-[1px] h-8 bg-white/5 mx-2" />
                            <StatItem value={user.streak || 0} type="streak" onClick={() => navigate('/streak')} />
                        </>
                    )}
                </div>

                {/* My Journeys Section - Restored to Sidebar */}
                <JourneysSection enrolledJourneys={user?.enrolledJourneys || []} currentCourseId={currentCourseId} />

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
                        <Target className="w-4 h-4 text-red-500" />
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

const PathNode = ({ node, index, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative z-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={node.status !== 'locked' ? onClick : undefined}
        >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center border-[6px] transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${node.status === 'current'
                ? 'bg-[#1e4e6e] border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.4)]'
                : node.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-[#1f2937] border-slate-800'
                }`}>

                {node.status === 'completed' ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                ) : node.status === 'current' ? (
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-inner group">
                        <Play className="w-6 h-6 md:w-7 h-7 text-white fill-current animate-pulse" />
                    </div>
                ) : (
                    <Lock className="w-6 h-6 md:w-7 h-7 text-slate-700" />
                )}
            </div>

            {/* Popover for Current Lesson - Hover Triggered Only to avoid overlap */}
            {node.status === 'current' && isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-[calc(100%+20px)] left-1/2 -translate-x-1/2 bg-[#1f2937] border border-blue-500/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[200px] z-[100] text-center"
                >
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Current Lesson</div>
                    <h4 className="text-white font-black italic uppercase text-sm mb-3 truncate px-2">{node.title}</h4>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-[10px] py-3 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                        Continue
                    </button>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1f2937] border-r border-b border-blue-500/30 rotate-45" />
                </motion.div>
            )}

            {/* Hover Tooltip for non-current/non-locked nodes */}
            {isHovered && node.status !== 'current' && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 bg-[#1f2937] border border-white/5 px-4 py-3 rounded-xl shadow-2xl z-50 text-left min-w-[150px]"
                >
                    <h4 className="text-white font-black italic uppercase text-[10px] mb-1">{node.title}</h4>
                    <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-tight">
                        {node.status === 'completed' ? 'Lesson Completed!' : 'Locked Challenge'}
                    </p>
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#1f2937] border-l border-b border-white/5 rotate-45" />
                </motion.div>
            )}
        </motion.div>
    );
};

const JourneysSection = ({ enrolledJourneys = [], currentCourseId }) => {
    const navigate = useNavigate();

    const handleCourseSwitch = async (courseId, sectionId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.patch('http://localhost:5000/api/auth/progress',
                    { currentCourse: courseId, currentSectionId: sectionId || 1 },
                    { headers: { 'x-auth-token': token } }
                );
                localStorage.setItem('selectedCourse', courseId);
                localStorage.setItem('selectedSectionId', sectionId || 1);
                window.location.reload();
            } catch (err) {
                console.error("Error switching course:", err);
            }
        }
    };

    return (
        <div className="bg-[#1f2937] rounded-2xl p-5 border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold italic uppercase tracking-tighter">My Journeys</h3>
                <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase">
                    {enrolledJourneys.length}
                </span>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto invisible-scrollbar pr-1">
                {enrolledJourneys.length > 0 ? enrolledJourneys.map((journey) => {
                    const courseInfo = courseData[journey.courseId] || { title: journey.courseId };
                    const isActive = journey.courseId === currentCourseId;
                    const totalLessons = courseInfo.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 10;
                    const progressPercent = Math.min(100, (journey.progress / totalLessons) * 100);

                    return (
                        <button
                            key={journey.courseId}
                            onClick={() => !isActive && handleCourseSwitch(journey.courseId, journey.currentSectionId)}
                            className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left relative
                                ${isActive
                                    ? 'bg-blue-600/10 border-blue-500/30'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm italic shadow-lg text-white shrink-0
                                ${journey.courseId === 'python' ? 'bg-blue-600' :
                                    journey.courseId === 'html' ? 'bg-orange-600' :
                                        journey.courseId === 'javascript' ? 'bg-yellow-600' : 'bg-slate-700'}
                            `}>
                                {journey.courseId.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold italic uppercase text-xs tracking-tight text-white truncate px-1">
                                        {courseInfo.title || journey.courseId}
                                    </span>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]" />}
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>
                        </button>
                    );
                }) : null}

                <button
                    onClick={() => navigate('/journeys')}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all text-left group/add text-slate-500 hover:text-white border border-dashed border-slate-700 hover:border-blue-500/50"
                >
                    <div className="w-8 h-8 border border-dashed border-slate-700 rounded-lg flex items-center justify-center group-hover/add:border-blue-500/50">
                        <Map className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs tracking-tight italic uppercase opacity-60 group-hover/add:opacity-100">Add</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
