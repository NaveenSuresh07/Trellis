import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronLeft,
    User,
    Mail,
    Globe2,
    Linkedin,
    Github,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Pencil,
    Calendar,
    EyeOff,
    LogOut,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    Bot,
    Code,
    Infinity,
    Flame,
    Cpu,
    FlaskRound,
    Sparkles,
    Search,
    Atom,
    Lock,
    X,
    Trash2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ALL_TITLES = [
    { name: "Yip's Recruit", icon: <Bot className="w-4 h-4" />, condition: "Member of Trellis" },
    { name: "Trellis Voyager", icon: <Code className="w-4 h-4" />, condition: "Earn 100 XP" },
    { name: "Consistency Vine", icon: <Infinity className="w-4 h-4" />, condition: "Reach a 2-day streak" },
    { name: "Yip's Archivist", icon: <Flame className="w-4 h-4" />, condition: "Generate 2 Summaries" },
    { name: "Trellis Master", icon: <Cpu className="w-4 h-4" />, condition: "Earn 500 XP" },
    { name: "Algorithm Arborist", icon: <FlaskRound className="w-4 h-4" />, condition: "Progress deep into a course" },
    { name: "Flash Bloomer", icon: <Sparkles className="w-4 h-4" />, condition: "Complete 3 exercises in a day" },
    { name: "Ancient Trellis Root", icon: <Search className="w-4 h-4" />, condition: "Reach a 7-day streak" },
    { name: "Celestial Trellis", icon: <Atom className="w-4 h-4" />, condition: "Earn 1000 XP" }
];

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [showTitleModal, setShowTitleModal] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        dob: '',
        isPrivate: false,
        selectedTitle: '',
        socialLinks: {
            linkedin: '',
            github: '',
            x: '',
            facebook: '',
            instagram: '',
            website: '',
            youtube: ''
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const res = await axios.get('http://127.0.0.1:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                const userData = res.data;
                setUser(userData);
                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    dob: userData.dob || '',
                    isPrivate: userData.isPrivate || false,
                    selectedTitle: userData.selectedTitle || "Bit Antroid's Apprentice",
                    socialLinks: {
                        linkedin: userData.socialLinks?.linkedin || '',
                        github: userData.socialLinks?.github || '',
                        x: userData.socialLinks?.x || '',
                        facebook: userData.socialLinks?.facebook || '',
                        instagram: userData.socialLinks?.instagram || '',
                        website: userData.socialLinks?.website || '',
                        youtube: userData.socialLinks?.youtube || ''
                    }
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Branding Migration Mapping
    const TITLE_MAPPING = {
        "Bit Antroid's Apprentice": "Yip's Recruit",
    };

    const handleSelectTitle = (titleName) => {
        if (!user?.unlockedTitles?.includes(titleName)) return;
        setFormData(prev => ({ ...prev, selectedTitle: titleName }));
        setShowTitleModal(false);
    };

    const handleClearTitle = () => {
        setFormData(prev => ({ ...prev, selectedTitle: '' }));
        setShowTitleModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setStatus({ type: null, message: '' });

        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://127.0.0.1:5000/api/auth/settings', formData, {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } catch (err) {
            console.error("Error updating settings:", err);
            setStatus({ type: 'error', message: err.response?.data?.msg || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#121212] items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#121212] text-white font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 p-6 md:p-10 lg:p-16 h-screen overflow-y-auto invisible-scrollbar">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Form Fields */}
                    <div className="lg:col-span-8 space-y-8 pb-32">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">Edit profile</h1>
                            <div className="text-sm text-slate-500">Title</div>
                            <button
                                type="button"
                                onClick={() => setShowTitleModal(true)}
                                className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors block text-left"
                            >
                                {formData.selectedTitle || 'Add title'}
                            </button>
                        </div>

                        {/* Avatar Block */}
                        <div className="space-y-4">
                            <div className="text-sm text-slate-500">Avatar</div>
                            <div className="relative w-full aspect-[21/9] bg-[#1e88e5] rounded-xl flex items-center justify-center overflow-hidden border border-white/5 shadow-inner group">
                                <div className="w-32 h-32 bg-[#121212]/20 rounded-full flex items-center justify-center">
                                    <User className="w-20 h-20 text-white/40" />
                                </div>
                                <button type="button" className="absolute bottom-4 right-4 w-10 h-10 bg-[#121212] rounded-full flex items-center justify-center hover:bg-[#1f1f1f] transition-colors border border-white/10 shadow-xl group-hover:scale-110">
                                    <Pencil className="w-4 h-4 text-white/70" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Email (Disabled) */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500">Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-[#1b1b1b] border border-white/5 rounded-lg py-4 px-4 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>

                            {/* Display Name */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500">Display Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    placeholder="Your full name"
                                    className="w-full bg-[#1b1b1b] border border-white/5 rounded-lg py-4 px-4 text-sm font-medium text-white focus:border-blue-500/50 focus:bg-[#1f1f1f] transition-all outline-none"
                                />
                            </div>

                            {/* Username with @ */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold select-none">@</span>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="w-full bg-[#1b1b1b] border border-white/5 rounded-lg py-4 pl-8 pr-4 text-sm font-medium text-white focus:border-blue-500/50 focus:bg-[#1f1f1f] transition-all outline-none"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed pl-1 italic opacity-80">
                                    Unique identifier (3-20 characters, letters and numbers only)<br />
                                    Username can only be changed once every 24 hours
                                </p>
                            </div>

                            {/* Bio / Description */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500">Short description about yourself</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleFormChange}
                                    rows={5}
                                    className="w-full bg-[#1b1b1b] border border-white/5 rounded-lg py-4 px-4 text-sm font-medium text-white focus:border-blue-500/50 focus:bg-[#1f1f1f] transition-all outline-none resize-none"
                                />
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4">
                                <label className="text-sm text-slate-500">Social network links</label>
                                <div className="flex flex-wrap gap-2">
                                    <SocialLinkIcon icon={<Linkedin className="w-5 h-5" />} placeholder="LinkedIn" />
                                    <SocialLinkIcon icon={<Github className="w-5 h-5" />} placeholder="GitHub" />
                                    <SocialLinkIcon icon={<Twitter className="w-5 h-5" />} placeholder="X" />
                                    <SocialLinkIcon icon={<Facebook className="w-5 h-5" />} placeholder="Facebook" />
                                    <SocialLinkIcon icon={<Instagram className="w-5 h-5" />} placeholder="Instagram" />
                                    <SocialLinkIcon icon={<Globe2 className="w-5 h-5" />} placeholder="Website" />
                                    <SocialLinkIcon icon={<Youtube className="w-5 h-5" />} placeholder="YouTube" />
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-500">Date of birth</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleFormChange}
                                        placeholder="dd-mm-yyyy"
                                        className="w-full bg-[#1b1b1b] border border-white/5 rounded-lg py-4 px-4 text-sm font-medium text-white focus:border-blue-500/50 outline-none"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                                <p className="text-[11px] text-slate-500 italic opacity-80 pl-1">
                                    This won't be visible to other users. We use it for birthday surprises and relevant updates.<br />
                                    Note: you can't change it later.
                                </p>
                            </div>

                            <hr className="border-white/5 my-8" />

                            {/* Profile Privacy */}
                            <div className="space-y-4 pb-10">
                                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Profile Privacy</div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="font-bold text-sm">Private profile</div>
                                        <div className="text-xs text-slate-500">When enabled, your profile will be hidden from other users</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                                        className={`w-12 h-6 rounded-full transition-all relative ${formData.isPrivate ? 'bg-blue-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${formData.isPrivate ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="fixed bottom-0 left-0 right-0 lg:left-24 bg-[#121212]/80 backdrop-blur-md border-t border-white/5 p-6 flex justify-center lg:justify-start lg:px-16 z-[100]">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full max-w-[690px] bg-[#1e3a4a] hover:bg-[#254a5e] text-[#4dd0e1] font-black uppercase text-xs tracking-widest py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 border border-[#4dd0e1]/30 shadow-2xl"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {saving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Navigation Menu */}
                    <div className="lg:col-span-4 space-y-6 pt-10">
                        <div className="bg-[#1b1b1b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <MenuTab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Edit profile" />
                            <MenuTab active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} label="Preferences" />
                            <MenuTab active={activeTab === 'social'} onClick={() => setActiveTab('social')} label="Social accounts" />
                            <MenuTab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} label="Progress" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-[#1b1b1b] border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:bg-[#222] transition-all group shadow-xl"
                        >
                            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                            <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">Logout</span>
                        </button>
                    </div>

                </div>
            </main>

            {/* Title Selection Modal */}
            <AnimatePresence>
                {showTitleModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTitleModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1b1b1b] w-full max-w-md rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative z-[301]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <button onClick={() => setShowTitleModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                                <button onClick={handleClearTitle} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
                                    Clear
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto invisible-scrollbar">
                                {ALL_TITLES.map((title) => {
                                    const isUnlocked = user?.unlockedTitles?.includes(title.name) || false;
                                    const isSelected = formData.selectedTitle === title.name;

                                    return (
                                        <button
                                            key={title.name}
                                            onClick={() => isUnlocked && handleSelectTitle(title.name)}
                                            className={`w-full flex items-center gap-4 p-5 text-left transition-all border-b border-white/5 relative group ${!isUnlocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-white/5'
                                                } ${isSelected ? 'bg-blue-500/5' : ''}`}
                                        >
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                {title.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-bold tracking-tight ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                                                    {title.name}
                                                </div>
                                                {!isUnlocked && (
                                                    <div className="text-[10px] font-medium text-slate-500 italic mt-0.5">
                                                        Unlock: {title.condition}
                                                    </div>
                                                )}
                                            </div>
                                            {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`fixed bottom-24 right-10 z-[200] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-500'
                            }`}
                    >
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-black italic uppercase text-xs tracking-tighter">{status.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SocialLinkIcon = ({ icon, placeholder }) => (
    <div className="w-10 h-10 bg-[#1b1b1b] border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all cursor-pointer group relative">
        {icon}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/5">
            {placeholder}
        </div>
    </div>
);

const MenuTab = ({ active, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-6 flex items-center justify-between group transition-all ${active ? 'bg-[#222]' : 'hover:bg-white/5'
            }`}
    >
        <span className={`text-sm font-bold tracking-tight transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {label}
        </span>
        {active && <ChevronRight className="w-4 h-4 text-blue-500" />}
    </button>
);

export default Settings;
