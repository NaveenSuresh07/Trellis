import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Upload,
    Clipboard,
    FileText,
    Loader2,
    ChevronDown,
    CheckCircle2,
    X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Summarizer = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({
        language: 'Auto',
        length: 'Medium',
        format: 'Paragraph'
    });

    const [copied, setCopied] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setText('');
            setError('');
        }
    };

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
            setFile(null);
            setError('');
        } catch (err) {
            setError('Failed to read from clipboard');
        }
    };

    const handleSummarize = async () => {
        if (!text && !file) {
            setError('Please provide text or upload a file');
            return;
        }

        setLoading(true);
        setError('');
        setSummary('');

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('text', text);
        }

        // Add settings to the request
        formData.append('length', settings.length);
        formData.append('format', settings.format);
        formData.append('language', settings.language);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/summarize`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSummary(res.data.summary);
        } catch (err) {
            const msg = err.response?.data?.msg || err.response?.data?.error || 'Failed to generate summary';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const updateSetting = (name, value) => {
        setSettings(prev => ({ ...prev, [name]: value }));
        setActiveDropdown(null);
    };

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-['Inter',sans-serif] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 p-6 lg:p-12 overflow-y-auto invisible-scrollbar" onClick={() => setActiveDropdown(null)}>
                <div className="max-w-4xl mx-auto space-y-10 py-6">

                    {/* Header */}
                    <header className="space-y-4">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                                <Sparkles className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">AI Notes Summarizer</h1>
                                <p className="text-slate-400 font-bold text-sm">Condense your study materials into key points instantly.</p>
                            </div>
                        </motion.div>
                    </header>

                    {/* Main Interaction Area */}
                    <div className="grid grid-cols-1 gap-8">

                        {/* Settings Bar */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap items-center gap-4 bg-[#1e293b]/50 p-4 rounded-2xl border border-white/5 shadow-xl relative z-50"
                        >
                            <SettingDropdown
                                label="Language"
                                value={settings.language}
                                options={['Auto', 'English', 'Spanish', 'French']}
                                isOpen={activeDropdown === 'language'}
                                onToggle={(e) => { e.stopPropagation(); toggleDropdown('language'); }}
                                onSelect={(val) => updateSetting('language', val)}
                            />
                            <SettingDropdown
                                label="Length"
                                value={settings.length}
                                options={['Short', 'Medium', 'Long']}
                                isOpen={activeDropdown === 'length'}
                                onToggle={(e) => { e.stopPropagation(); toggleDropdown('length'); }}
                                onSelect={(val) => updateSetting('length', val)}
                            />
                            <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/5">
                                <FormatToggle
                                    active={settings.format === 'Paragraph'}
                                    onClick={() => setSettings({ ...settings, format: 'Paragraph' })}
                                    label="Paragraph"
                                />
                                <FormatToggle
                                    active={settings.format === 'Bullets'}
                                    onClick={() => setSettings({ ...settings, format: 'Bullets' })}
                                    label="Bullet Points"
                                />
                            </div>
                        </motion.div>

                        {/* Input Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative group bg-[#1e293b] rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-blue-600/10" />

                            <div className="relative p-8 space-y-6">
                                <div className="min-h-[300px] bg-[#0f172a]/50 rounded-3xl border border-white/5 p-6 focus-within:border-blue-500/50 transition-all flex flex-col">
                                    <textarea
                                        value={text}
                                        onChange={(e) => { setText(e.target.value); setFile(null); }}
                                        placeholder="Enter or paste your text here..."
                                        className="w-full flex-1 bg-transparent text-slate-300 font-medium placeholder:text-slate-600 outline-none resize-none leading-relaxed"
                                    />

                                    <div className="pt-6 flex items-center justify-between border-t border-white/5">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handlePaste}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 border border-white/5 transition-all active:scale-95"
                                            >
                                                <Clipboard className="w-4 h-4" />
                                                Paste
                                            </button>
                                            <label className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer active:scale-95">
                                                <Upload className="w-4 h-4" />
                                                Upload PDF/PPT
                                                <input type="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={handleFileUpload} />
                                            </label>
                                        </div>

                                        {file && (
                                            <div className="flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-xl border border-blue-500/20">
                                                <FileText className="w-4 h-4 text-blue-400" />
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-blue-400 truncate max-w-[150px]">{file.name}</span>
                                                <X className="w-3 h-3 text-blue-400/50 hover:text-blue-400 cursor-pointer" onClick={() => { setFile(null); setText(''); }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        {text.length} characters
                                    </div>
                                    <button
                                        onClick={handleSummarize}
                                        disabled={loading || (!text && !file)}
                                        className="px-12 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black italic uppercase text-sm rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Summarize'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3"
                                >
                                    <X className="w-5 h-5" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {summary && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Summary Ready</h3>
                                    </div>

                                    <div className="bg-[#1e293b]/30 p-8 rounded-[2rem] border border-blue-500/20 relative group">
                                        <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                                            <Sparkles className="w-12 h-12" />
                                        </div>
                                        <div className="prose prose-invert max-w-none text-slate-300 leading-loose font-medium whitespace-pre-wrap">
                                            {summary}
                                        </div>

                                        <div className="mt-8 flex gap-4">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(summary);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${copied
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                                                    }`}
                                            >
                                                {copied ? 'Copied!' : 'Copy Summary'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SettingDropdown = ({ label, value, options, isOpen, onToggle, onSelect }) => (
    <div className="relative">
        <div
            onClick={onToggle}
            className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-xl border border-white/5 group cursor-pointer hover:border-blue-500/30 transition-all min-w-[140px]"
        >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}:</span>
            <span className="text-xs font-black text-white italic truncate flex-1">{value}</span>
            <ChevronDown className={`w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-all ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
                >
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={(e) => { e.stopPropagation(); onSelect(option); }}
                            className="px-4 py-2 text-xs font-bold text-slate-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                        >
                            {option}
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FormatToggle = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
            ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}
        `}
    >
        {label}
    </button>
);

export default Summarizer;
