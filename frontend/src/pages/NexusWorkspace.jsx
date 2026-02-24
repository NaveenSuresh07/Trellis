import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    FileText,
    MessageCircle,
    ChevronLeft,
    Users,
    Sparkles,
    Loader2,
    Save,
    Plus,
    Paperclip,
    Image as ImageIcon,
    File as FileIcon,
    Video as VideoIcon
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../apiConfig';

const NexusWorkspace = () => {
    const { peerId } = useParams();
    const navigate = useNavigate();
    const [collaboration, setCollaboration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [note, setNote] = useState('');
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchCollaboration = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/collaboration/${peerId}`, {
                headers: { 'x-auth-token': token }
            });
            setCollaboration(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch Collaboration Error:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollaboration();
        const interval = setInterval(fetchCollaboration, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [peerId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [collaboration?.messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/collaboration/${peerId}/message`,
                { text: message },
                { headers: { 'x-auth-token': token } }
            );
            setMessage('');
            fetchCollaboration();
        } catch (err) {
            console.error('Send Message Error:', err);
        } finally {
            setSending(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (message.trim()) formData.append('text', message);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/collaboration/${peerId}/upload`, formData, {
                headers: {
                    'x-auth-token': token
                }
            });
            setMessage('');
            fetchCollaboration();
        } catch (err) {
            console.error('File Upload Error:', err);
            const errorMsg = err.response?.data?.msg || err.message || 'Error uploading file';
            alert(`Upload Failed: ${errorMsg}`);
        } finally {
            setUploading(false);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/collaboration/${peerId}/note`,
                { text: note },
                { headers: { 'x-auth-token': token } }
            );
            setNote('');
            fetchCollaboration();
        } catch (err) {
            console.error('Add Note Error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#0f172a] items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    const peer = collaboration?.participants.find(p => p._id === peerId);

    const renderMessageContent = (msg) => {
        if (!msg.fileUrl) return msg.text;

        const fullUrl = `${API_BASE_URL}${msg.fileUrl}`;

        return (
            <div className="flex flex-col gap-2">
                {msg.fileType === 'image' && (
                    <img src={fullUrl} alt="Attached" className="max-w-full rounded-lg border border-white/10 shadow-lg" />
                )}
                {msg.fileType === 'video' && (
                    <video src={fullUrl} controls className="max-w-full rounded-lg border border-white/10 shadow-lg" />
                )}
                {msg.fileType === 'pdf' && (
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group">
                        <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                            <FileIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-200">Open PDF Document</span>
                            <span className="text-[10px] text-slate-500">View in new tab</span>
                        </div>
                    </a>
                )}
                {msg.text && <p className="mt-1">{msg.text}</p>}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 font-['Inter',sans-serif] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 flex flex-col h-full">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#1e293b]/30 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/nexus')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-sm font-black shadow-lg">
                                {peer?.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold text-sm tracking-tight uppercase flex items-center gap-2">
                                    {peer?.username} <span className="text-[10px] text-slate-500 font-medium lowercase">({peer?.selectedTitle})</span>
                                </h2>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Collaboration</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Workspace Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

                    {/* LEFT PANEL: Chat Feed */}
                    <div className="flex flex-col border-r border-white/5 bg-[#1e293b]/10">
                        <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discussion</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 invisible-scrollbar">
                            {collaboration?.messages.map((msg, idx) => {
                                const isMe = msg.senderId !== peerId;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-[1.5rem] px-5 py-3 text-sm font-medium shadow-xl
                                            ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1e293b] text-slate-200 border border-white/5 rounded-bl-none'}
                                        `}>
                                            {renderMessageContent(msg)}
                                            <div className={`text-[8px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-[#0f172a] border-t border-white/5">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 bg-[#1e293b] hover:bg-white/5 rounded-xl border border-white/10 transition-all text-slate-400 hover:text-blue-400"
                                    disabled={uploading}
                                >
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                                </button>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={uploading ? "Uploading..." : "Type your message..."}
                                        className="w-full bg-[#1e293b]/50 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                    />
                                    <button
                                        disabled={sending || uploading}
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT PANEL: Shared Notes */}
                    <div className="flex flex-col bg-[#0f172a]">
                        <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaboration Notes</span>
                            </div>
                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 invisible-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1 sm:col-span-2 bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a new collaboration note..."
                                        className="bg-transparent text-sm text-slate-300 outline-none resize-none h-24 placeholder:text-slate-600"
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        className="self-end px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                                    >
                                        <Plus className="w-3 h-3" /> Add Note
                                    </button>
                                </div>

                                {collaboration?.notes.slice().reverse().map((n, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 shadow-xl hover:border-emerald-500/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold">
                                                {collaboration.participants.find(p => p._id === n.authorId)?.username[0].toUpperCase()}
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                                                {collaboration.participants.find(p => p._id === n.authorId)?.username}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                            {n.text}
                                        </p>
                                        <div className="mt-3 text-[8px] text-slate-600 font-bold uppercase tracking-widest">
                                            {new Date(n.timestamp).toLocaleDateString()}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default NexusWorkspace;
