import React, { useState, useEffect } from 'react';
import { Target, Shield, BookOpen, Zap, Trophy, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOAL_POOL = [
    { id: 'xp_100', title: 'Earn 100 XP', total: 100, key: 'xpToday', icon: <Shield className="w-5 h-5 text-blue-400" /> },
    { id: 'xp_250', title: 'Earn 250 XP', total: 250, key: 'xpToday', icon: <Shield className="w-5 h-5 text-blue-500" /> },
    { id: 'xp_500', title: 'Earn 500 XP', total: 500, key: 'xpToday', icon: <Shield className="w-5 h-5 text-indigo-400" /> },
    { id: 'exe_3', title: 'Complete 3 Exercises', total: 3, key: 'exercisesCompletedToday', icon: <BookOpen className="w-5 h-5 text-emerald-400" /> },
    { id: 'exe_5', title: 'Complete 5 Exercises', total: 5, key: 'exercisesCompletedToday', icon: <BookOpen className="w-5 h-5 text-emerald-500" /> },
    { id: 'first_2', title: '2 First-Try Solves', total: 2, key: 'firstTrySolves', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { id: 'first_5', title: '5 First-Try Solves', total: 5, key: 'firstTrySolves', icon: <Zap className="w-5 h-5 text-yellow-500" /> },
    { id: 'sum_2', title: 'Generate 2 Summaries', total: 2, key: 'summariesToday', icon: <Trophy className="w-5 h-5 text-purple-400" /> },
    { id: 'streak_1', title: 'Maintain your Streak', total: 1, key: 'streak', icon: <Flame className="w-5 h-5 text-orange-500" /> },
    { id: 'master_1', title: 'Master a Section', total: 1, key: 'sectionsMasteredToday', icon: <Trophy className="w-5 h-5 text-yellow-400" /> },
];

const DailyGoals = ({ user }) => {
    const [activeGoalIds, setActiveGoalIds] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);

    useEffect(() => {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('goalsDate');
        let storedActive = JSON.parse(localStorage.getItem('activeGoalIds') || '[]');
        let storedCompleted = JSON.parse(localStorage.getItem('completedGoalIds') || '[]');

        if (storedDate !== today) {
            localStorage.setItem('goalsDate', today);
            storedActive = [];
            storedCompleted = [];
            localStorage.setItem('completedGoalIds', '[]');
            localStorage.setItem('activeGoalIds', '[]');
        }

        if (storedActive.length === 0) {
            const shuffled = [...GOAL_POOL].sort(() => 0.5 - Math.random());
            storedActive = shuffled.slice(0, 3).map(g => g.id);
            localStorage.setItem('activeGoalIds', JSON.stringify(storedActive));
        }

        setActiveGoalIds(storedActive);
        setCompletedIds(storedCompleted);
    }, []);

    const handleGoalComplete = (goalId) => {
        if (completedIds.includes(goalId)) return;

        const newCompleted = [...completedIds, goalId];
        setCompletedIds(newCompleted);
        localStorage.setItem('completedGoalIds', JSON.stringify(newCompleted));

        // Delay replacement to let user see success
        setTimeout(() => {
            replaceGoal(goalId, newCompleted);
        }, 4000);
    };

    const replaceGoal = (oldId, currentCompleted) => {
        const currentActive = JSON.parse(localStorage.getItem('activeGoalIds') || '[]');

        const remainingPool = GOAL_POOL.filter(g =>
            !currentActive.includes(g.id) &&
            !currentCompleted.includes(g.id)
        );

        if (remainingPool.length === 0) return;

        const nextGoal = remainingPool[Math.floor(Math.random() * remainingPool.length)];
        const newActive = currentActive.map(id => id === oldId ? nextGoal.id : id);

        setActiveGoalIds(newActive);
        localStorage.setItem('activeGoalIds', JSON.stringify(newActive));
    };

    const activeGoals = activeGoalIds.map(id => GOAL_POOL.find(g => g.id === id)).filter(Boolean);

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {activeGoals.map((goal) => {
                    const currentVal = user?.[goal.key] || 0;
                    const isDone = currentVal >= goal.total;

                    if (isDone && !completedIds.includes(goal.id)) {
                        handleGoalComplete(goal.id);
                    }

                    return (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${isDone ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#111827]/50 border-white/5 hover:bg-white/5'}`}
                        >
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all ${isDone ? 'bg-emerald-500/20 scale-110' : 'bg-slate-800/50'}`}>
                                        {goal.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black uppercase tracking-tight ${isDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {goal.title}
                                        </span>
                                        {isDone && (
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                                Completed! + Bonus XP
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black ${isDone ? 'text-emerald-500' : 'text-slate-500'}`}>
                                    {Math.min(goal.total, currentVal)}/{goal.total}
                                </span>
                            </div>

                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden relative z-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (currentVal / goal.total) * 100)}%` }}
                                    className={`h-full rounded-full transition-all duration-1000 ${isDone ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-600'}`}
                                />
                            </div>

                            {/* Background decoration for completed state */}
                            {isDone && (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default DailyGoals;
