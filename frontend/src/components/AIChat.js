import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, MinusCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import mascot from '../assets/Yip_head.png';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hi! I'm YIP. Ready to crush some study goals today? How can I help?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleOpenChat = (event) => {
            const { message, autoSend } = event.detail || {};
            setIsOpen(true);
            if (message) {
                if (autoSend) {
                    handleSendMessage(null, message);
                } else {
                    setInput(message);
                }
            }
        };

        window.addEventListener('yip:open', handleOpenChat);
        return () => window.removeEventListener('yip:open', handleOpenChat);
    }, [messages]); // messages as dependency for handleSendMessage

    const handleSendMessage = async (e, directMessage = null) => {
        if (e) e.preventDefault();
        const messageText = directMessage || input.trim();
        if (!messageText || loading) return;

        const userMessage = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: userMessage.content,
                history: messages
            }, {
                headers: { 'x-auth-token': token }
            });

            if (res.data?.reply) {
                setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
            }
        } catch (err) {
            console.error('Chat Error:', err);
            setMessages(prev => [...prev, {
                role: 'model',
                content: "Oops! I hit a bit of a brain freeze. Could you try saying that again?"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-['Inter',sans-serif]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#1e293b] border border-blue-500/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={mascot} alt="Mascot" className="w-10 h-10 rounded-full bg-blue-500/10 p-1 border border-blue-500/30 shadow-lg shadow-blue-500/20" />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1e293b]" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                                        YIP <Sparkles className="w-3 h-3" />
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Your AI Study Buddy</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
                            >
                                <MinusCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 invisible-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-[#0f172a]/50 border-t border-white/5">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all border-4 ${isOpen
                    ? 'bg-rose-500 border-rose-600/50'
                    : 'bg-blue-600 border-blue-500/50 animate-bounce-slow'
                    }`}
            >
                {isOpen ? (
                    <X className="w-8 h-8 text-white" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="w-8 h-8 text-white fill-current opacity-20 absolute top-0 left-0" />
                        <img src={mascot} alt="AI" className="w-10 h-10 relative z-10" />
                    </div>
                )}
            </motion.button>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .invisible-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .invisible-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default AIChat;
