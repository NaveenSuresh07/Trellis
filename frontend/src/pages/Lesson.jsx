import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    X, ChevronRight, ChevronLeft, Zap, Trophy,
    Flame, Target, Play, Lightbulb, CheckCircle2,
    RotateCcw, MessageSquare, Terminal, Eye
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup'; // for HTML
import 'prismjs/themes/prism-tomorrow.css';
import { courseData } from '../data/courses';
import axios from 'axios';

const Lesson = () => {
    const { courseId, sectionId, lessonId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [showSolution, setShowSolution] = useState(false);
    const [activeTab, setActiveTab] = useState('console'); // 'console' or 'testcases'
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [showOnboarding, setShowOnboarding] = useState(parseInt(lessonId) === 1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDetailsHidden, setIsDetailsHidden] = useState(false);
    const [quizSelectedOption, setQuizSelectedOption] = useState(null);
    const [blankAnswers, setBlankAnswers] = useState([]);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    // Get current lesson data
    const course = courseData[courseId] || courseData.html;
    const section = course.sections.find(s => s.id === parseInt(sectionId));
    const lesson = section.lessons.find(l => l.id === parseInt(lessonId));

    useEffect(() => {
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
        if (lesson) {
            setCode(lesson.initialCode || '');
            setBlankAnswers(lesson.type === 'blank' ? new Array(lesson.correctAnswers.length).fill('') : []);
            setQuizSelectedOption(null);
            setIsSuccess(false);
            setOutput('');
            setShowSolution(false);
        }
    }, [lessonId]); // Use lessonId as dependency to trigger on nav

    const handleRunCode = () => {
        let success = false;
        let resultOutput = "";

        if (lesson.type === 'coding') {
            resultOutput = `Executing ${course.language} code...\n> ${lesson.expectedOutput}`;
            if (code.trim() === lesson.solution.trim()) {
                success = true;
            }
        } else if (lesson.type === 'quiz') {
            if (quizSelectedOption === lesson.correctAnswer) {
                success = true;
                resultOutput = lesson.expectedOutput;
            } else {
                resultOutput = "Incorrect. Try again!";
            }
        } else if (lesson.type === 'blank') {
            const allCorrect = blankAnswers.every((ans, i) => ans.trim().toLowerCase() === lesson.correctAnswers[i].toLowerCase());
            if (allCorrect) {
                success = true;
                resultOutput = lesson.expectedOutput;
            } else {
                resultOutput = "Some answers are incorrect. Check again!";
            }
        }

        setOutput(resultOutput);
        if (success) {
            setIsSuccess(true);
            handleCompleteLesson();
        } else if (lesson.type === 'coding') {
            setOutput(prev => prev + "\n\n[ERROR] Output does not match expected result. Try again!");
        }
    };

    const handleCompleteLesson = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Find current course progress
        const courseJourney = user?.enrolledJourneys?.find(j => j.courseId === courseId);
        const currentProgress = courseJourney?.progress || 0;
        const currentLessonIndex = section.lessons.findIndex(l => l.id === parseInt(lessonId));

        // Only increment if we are completing the "current" lesson (not re-playing old ones)
        const newProgress = currentLessonIndex === currentProgress ? currentProgress + 1 : currentProgress;

        try {
            const isFirstClick = output === ""; // Simple heuristic: if output was empty, it was the first run
            const res = await axios.patch('http://127.0.0.1:5000/api/auth/progress', {
                xpIncrement: 20,
                currentCourse: courseId,
                progress: newProgress,
                isFirstTry: isFirstClick
            }, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch (err) {
            console.error("Error updating progress:", err);
        }
    };

    const handleResetCode = () => {
        if (lesson) {
            setCode(lesson.initialCode || '');
            setBlankAnswers(lesson.type === 'blank' ? new Array(lesson.correctAnswers.length).fill('') : []);
            setQuizSelectedOption(null);
            setOutput('');
            setIsSuccess(false);
        }
    };

    const handleContinueJourney = () => {
        const currentLessonIndex = section.lessons.findIndex(l => l.id === parseInt(lessonId));
        const nextLesson = section.lessons[currentLessonIndex + 1];

        if (nextLesson) {
            navigate(`/lesson/${courseId}/${sectionId}/${nextLesson.id}`);
            setIsSuccess(false);
            // window.location.reload(); // Removed refresh as useEffect handles lessonId change
        } else {
            navigate('/dashboard');
        }
    };

    const handleAskAI = (purpose = "general") => {
        let prompt = "";
        if (purpose === "challenge") {
            prompt = `I'm stuck on the "${lesson.title}" challenge in the ${course.title} course. The challenge is: "${lesson.challenge}". Can you explain it simply without giving me the answer?`;
        } else {
            prompt = `I'm learning about "${lesson.title}" in ${course.title}. Can you help me understand this better? Here is the context: ${lesson.content}`;
        }

        window.dispatchEvent(new CustomEvent('yip:open', {
            detail: { message: prompt, autoSend: true }
        }));
    };

    const handleTLDR = async () => {
        if (!lesson.content) return;
        setIsSummarizing(true);
        setShowSummaryModal(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://127.0.0.1:5000/api/summarize', {
                text: lesson.content,
                length: 'Short',
                format: 'Bullets'
            }, {
                headers: { 'x-auth-token': token }
            });
            setSummary(res.data.summary);
        } catch (err) {
            console.error("TL;DR Error:", err);
            setSummary("Oops! I couldn't summarize this right now. Please try again later!");
        } finally {
            setIsSummarizing(false);
        }
    };

    const onboardingSteps = [
        { title: "Welcome to the lesson environment!", text: "Here you'll learn by doing. Let's take a quick tour." },
        { title: "Learn a short lesson", text: "Read the concepts and the challenge instructions on the left." },
        { title: "Experiment with code", text: "Write your solution in the editor on the right." },
        { title: "When you are ready, run the code!", text: "Click the Run button to verify your answer." },
        { title: "Happy Coding!", text: "You're all set. Good luck!" }
    ];

    const nextOnboarding = () => {
        if (onboardingStep < onboardingSteps.length) {
            setOnboardingStep(prev => prev + 1);
        } else {
            setShowOnboarding(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-['Inter',sans-serif]">

            {/* TOP NAVIGATION BAR */}
            <header className="h-16 bg-[#1e293b] border-b border-white/5 px-6 flex items-center justify-between z-40">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">{course.title}</span>
                        <h1 className="text-lg font-black italic uppercase tracking-tighter leading-tight">{lesson.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <header className="flex items-center gap-4 bg-[#0f172a]/50 px-4 py-2 rounded-2xl border border-white/5">
                        <StatIcon value={user?.xp || 0} icon={<Shield className="w-4 h-4 text-blue-400" />} />
                        <StatIcon value={user?.streak || 0} icon={<Flame className="w-4 h-4 text-orange-500" />} />
                    </header>
                    <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white/10 shadow-lg" />
                </div>
            </header>

            {/* MAIN CONTENT SPLIT PANE */}
            <main className="flex flex-1 overflow-hidden">

                {/* LEFT CONTENT AREA */}
                <div className="w-[40%] bg-[#0f172a] border-r border-white/5 overflow-y-auto invisible-scrollbar flex flex-col">
                    {!lesson || !lesson.content ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Lesson Coming Soon</h2>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    We're still crafting this lesson for you. Check back shortly to continue your journey!
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-xs rounded-xl shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 space-y-8">

                            {/* Intro Section */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">{lesson.title}</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleTLDR}
                                            className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors"
                                        >
                                            TL;DR
                                        </button>
                                        <button
                                            onClick={() => setIsDetailsHidden(!isDetailsHidden)}
                                            className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 transition-all"
                                        >
                                            {isDetailsHidden ? 'Show Theory' : 'Hide Theory'}
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {!isDetailsHidden && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="text-slate-400 leading-relaxed font-medium overflow-hidden"
                                        >
                                            {lesson.content}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </section>

                            {/* Challenge & Solution always visible or in their own section */}
                            <section className="space-y-8">
                                {/* Challenge Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                            <Lightbulb className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Challenge</h3>
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md">Beginner</span>
                                    </div>

                                    <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-white/5 space-y-4 shadow-xl">
                                        <p className="text-slate-300 font-bold leading-relaxed">
                                            {lesson.challenge}
                                        </p>
                                        {lesson.instructions && (
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">What to do:</h4>
                                                <ul className="space-y-3">
                                                    {lesson.instructions.map((inst, i) => (
                                                        <li key={i} className="flex gap-3 text-sm text-slate-400 font-medium">
                                                            <span className="text-blue-500 font-black">{i + 1}.</span>
                                                            <span>{inst}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleAskAI("challenge")}
                                            className="flex items-center gap-2 text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Explain challenge
                                        </button>
                                    </div>
                                </section>

                                {/* Solution Section */}
                                {lesson.solution && (
                                    <section>
                                        <button
                                            onClick={() => setShowSolution(!showSolution)}
                                            className="w-full flex items-center justify-between p-5 bg-[#1e293b]/30 hover:bg-[#1e293b]/50 border border-white/5 rounded-2xl transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Target className="w-5 h-5 text-emerald-500" />
                                                <span className="text-sm font-black uppercase tracking-widest text-white">Solution</span>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${showSolution ? 'rotate-90' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showSolution && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 mt-2 bg-[#111827] rounded-2xl border border-white/5">
                                                        <pre className="text-sm font-mono text-emerald-400">{lesson.solution}</pre>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </section>
                                )}
                            </section>
                        </div>
                    )}

                    {/* Footer Nav */}
                    <div className="mt-auto p-4 border-t border-white/5 bg-[#1e293b]/20 flex justify-between items-center">
                        <div className="flex gap-2">
                            <NavButton icon={<ChevronLeft className="w-5 h-5" />} label="Prev" disabled={parseInt(lessonId) <= 1} onClick={() => navigate(`/lesson/${courseId}/${sectionId}/${parseInt(lessonId) - 1}`)} />
                            <NavButton icon={<ChevronRight className="w-5 h-5" />} label="Next" labelRight disabled={!section.lessons.find(l => l.id === parseInt(lessonId) + 1)} onClick={() => navigate(`/lesson/${courseId}/${sectionId}/${parseInt(lessonId) + 1}`)} />
                        </div>
                        <button
                            onClick={handleResetCode}
                            className="p-3 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* RIGHT EXERCISE AREA */}
                <div className="flex-1 bg-[#111827] flex flex-col relative overflow-hidden">

                    {/* Exercise Header */}
                    <div className="h-12 bg-[#1e293b] border-b border-white/5 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#0f172a] rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
                                {lesson.type?.toUpperCase() || 'EXERCISE'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetCode}
                                className="p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Exercise Content */}
                    <div className="flex-1 bg-[#0f172a] p-6 overflow-auto custom-editor">
                        {lesson.type === 'coding' && (
                            <CodingView
                                code={code}
                                setCode={setCode}
                                language={course.language}
                            />
                        )}
                        {lesson.type === 'quiz' && (
                            <QuizView
                                challenge={lesson.challenge}
                                options={lesson.options}
                                selectedOption={quizSelectedOption}
                                setSelectedOption={setQuizSelectedOption}
                            />
                        )}
                        {lesson.type === 'blank' && (
                            <BlankView
                                template={lesson.template}
                                answers={blankAnswers}
                                setAnswers={setBlankAnswers}
                            />
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="absolute right-8 bottom-48 flex flex-col gap-4 z-20">
                        <button
                            onClick={() => handleAskAI("general")}
                            className="bg-[#1e293b] hover:bg-[#334155] text-slate-300 font-bold text-xs px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl transition-all"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Ask AI
                        </button>
                        <button
                            onClick={handleRunCode}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-sm px-10 py-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            {lesson.type === 'coding' ? 'Run Code' : 'Check Answer'}
                        </button>
                    </div>

                    {/* Bottom Console/TestCases Pane */}
                    <div className="h-40 bg-[#1e293b] border-t border-white/10 flex flex-col">
                        <div className="flex border-b border-white/5">
                            <button
                                onClick={() => setActiveTab('testcases')}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'testcases' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Test Cases
                            </button>
                            <button
                                onClick={() => setActiveTab('console')}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'console' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Console
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                            {activeTab === 'console' ? (
                                <pre className="text-slate-400 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                                        <span>Check if output matches "{lesson.expectedOutput}"</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main >

            {/* ONBOARDING OVERLAY */}
            < AnimatePresence >
                {showOnboarding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#1e293b] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16" />

                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 relative z-10">
                                {onboardingSteps[onboardingStep - 1].title}
                            </h2>
                            <p className="text-slate-400 font-medium leading-relaxed mb-8 relative z-10">
                                {onboardingSteps[onboardingStep - 1].text}
                            </p>

                            <div className="flex items-center justify-between relative z-10">
                                <button
                                    onClick={() => setShowOnboarding(false)}
                                    className="text-slate-500 font-bold text-sm hover:text-white transition-colors"
                                >
                                    Skip
                                </button>
                                <div className="flex gap-4">
                                    {onboardingStep > 1 && (
                                        <button
                                            onClick={() => setOnboardingStep(prev => prev - 1)}
                                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-black italic uppercase text-xs rounded-xl transition-all"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={nextOnboarding}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-xs rounded-xl shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                                    >
                                        {onboardingStep === onboardingSteps.length ? 'Done' : `Next (${onboardingStep}/${onboardingSteps.length})`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* SUCCESS MODAL */}
            < AnimatePresence >
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-blue-600/20 backdrop-blur-md z-[110] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#1e293b] border border-blue-500/30 p-10 rounded-[3rem] max-w-sm w-full shadow-[0_30px_100px_rgba(0,0,0,0.8)] text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Excellence!</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lesson Completed</p>
                            </div>
                            <div className="flex justify-center gap-4 py-2">
                                <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-400 font-black italic">
                                        +{output === "" ? 30 : 20} XP
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleContinueJourney}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-base rounded-[1.5rem] shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                            >
                                Continue Journey
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* TL;DR SUMMARY MODAL */}
            <AnimatePresence>
                {showSummaryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#1e293b] border border-blue-500/20 p-8 rounded-[2.5rem] max-w-lg w-full shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <Lightbulb className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">TL;DR Summary</h2>
                                </div>
                                <button
                                    onClick={() => setShowSummaryModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 min-h-[150px] flex items-center justify-center">
                                {isSummarizing ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">YIP is reading...</p>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                                            {summary}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase text-xs rounded-xl shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
};

const StatIcon = ({ value, icon }) => (
    <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-black italic text-white leading-none">{value}</span>
    </div>
);

const NavButton = ({ icon, label, labelRight, disabled, onClick }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/5 transition-all
            ${disabled ? 'opacity-20 cursor-not-allowed bg-slate-800/10' : 'bg-white/5 hover:bg-white/10 text-white'}
        `}
    >
        {!labelRight && icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        {labelRight && icon}
    </button>
);

const CodingView = ({ code, setCode, language }) => (
    <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages[language === 'python' ? 'python' : 'javascript'] || languages.markup)}
        padding={20}
        style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 16,
            minHeight: '100%',
        }}
        className="focus:outline-none"
    />
);

const QuizView = ({ challenge, options, selectedOption, setSelectedOption }) => (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
        <h3 className="text-2xl font-black text-white italic text-center max-w-lg leading-tight uppercase tracking-tighter">
            {challenge}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
            {options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group
                        ${selectedOption === idx
                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                            : 'bg-[#1e293b]/50 border-white/5 hover:border-white/20 hover:bg-[#1e293b]'
                        }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs
                        ${selectedOption === idx ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}
                    `}>
                        {idx + 1}
                    </div>
                    <span className={`font-bold transition-colors ${selectedOption === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {option}
                    </span>
                </button>
            ))}
        </div>
    </div>
);

const BlankView = ({ template, answers, setAnswers }) => (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-12">
        <h3 className="text-2xl font-black text-white italic text-center max-w-lg leading-tight uppercase tracking-tighter">
            Fill in the Blanks
        </h3>
        <div className="bg-[#1e293b]/30 p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
            <div className="relative z-10 font-mono text-xl md:text-2xl text-slate-300 flex flex-wrap items-center justify-center gap-x-4 gap-y-6 leading-loose">
                {template.split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && (
                            <input
                                type="text"
                                value={answers[i] || ''}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[i] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                className="bg-[#0f172a] border-b-4 border-blue-500/50 focus:border-blue-500 text-blue-400 px-4 py-1 outline-none min-w-[120px] text-center transition-all rounded-t-xl"
                                placeholder="..."
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </div>
);

export default Lesson;
