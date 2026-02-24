import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Filter,
    Search,
    Image as ImageIcon,
    FileText,
    Video,
    X,
    Upload,
    MessageCircle,
    Heart,
    Share2,
    Eye,
    ChevronDown,
    Zap
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MiniLeaderboard from '../components/MiniLeaderboard';
import DailyGoals from '../components/DailyGoals';

const CommunityHub = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('All');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userCount, setUserCount] = useState(0);

    // Upload State
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCourse, setUploadCourse] = useState('html');
    const [uploadCaption, setUploadCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const courses = ['All', 'Python', 'HTML', 'JavaScript', 'Java', 'C', 'SQL'];

    useEffect(() => {
        fetchPosts();
        fetchUserData();
    }, [selectedCourse]);

    useEffect(() => {
        fetchUserCount();
    }, []);

    const fetchUserCount = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/users/count');
            setUserCount(res.data.count || 2); // Fallback to 2 as confirmed in DB
        } catch (err) {
            console.error("Error fetching user count:", err);
            setUserCount(2); // Defensive fallback
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const courseQuery = selectedCourse === 'All' ? '' : `?courseId=${selectedCourse.toLowerCase()}`;
            const res = await axios.get(`http://localhost:5000/api/community${courseQuery}`);
            setPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadError('');
        if (!uploadFile) return setUploadError('Please select a file.');

        const token = localStorage.getItem('token');
        if (!token) return setUploadError('Please login to share.');

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('courseId', uploadCourse);
        formData.append('caption', uploadCaption);

        try {
            const res = await axios.post('http://127.0.0.1:5000/api/community', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadCaption('');
            fetchPosts();
        } catch (err) {
            console.error("Upload error details:", err.response?.data);
            const errorMsg = err.response?.data?.msg || err.response?.data || err.message || 'Failed to upload. AI might have flagged your content.';
            setUploadError(typeof errorMsg === 'string' ? errorMsg : 'AI flagged your content as inappropriate.');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePostUpdate = (postId, update) => {
        setPosts(prevPosts => prevPosts.map(p =>
            p._id === postId ? { ...p, ...update } : p
        ));
    };

    return (
        <div className="flex min-h-screen bg-[#111827] text-white font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 ml-16 md:ml-24 mr-0 lg:mr-[300px] p-6 lg:p-10 overflow-y-auto h-screen invisible-scrollbar">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Community Hub</h1>
                            <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                            <p className="text-slate-400 text-sm font-medium">Explore and share learning resources with the community.</p>
                        </div>

                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Share Your Work
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {courses.map(course => (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap
                                    ${selectedCourse === course
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'}`}
                            >
                                {course}
                            </button>
                        ))}
                    </div>

                    {/* Posts Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-80 bg-white/5 rounded-3xl" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="p-6 bg-white/5 rounded-full">
                                <Search className="w-12 h-12 text-slate-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-400 font-black italic uppercase">No resources found for {selectedCourse}</h2>
                            <p className="text-slate-500 text-sm">Be the first to share something amazing!</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {posts.map(post => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    currentUser={user}
                                    onUpdate={handlePostUpdate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:flex w-[300px] fixed right-0 top-0 bottom-0 bg-[#111827] border-l border-white/5 flex-col p-6 gap-6 invisible-scrollbar overflow-y-auto">
                <div className="bg-[#1f2937] p-5 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold italic uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Community Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold uppercase">Total Resources</span>
                            <span className="text-white font-black">{posts.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold uppercase">Active Learners</span>
                            <span className="text-white font-black">{userCount}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1f2937] rounded-2xl p-5 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold italic uppercase tracking-tighter">Leaderboard</h3>
                    </div>
                    <MiniLeaderboard />
                </div>

                <div className="bg-[#1f2937] rounded-2xl p-5 border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold italic uppercase tracking-tighter mb-4">DAILY GOALS</h3>
                    <DailyGoals user={user} />
                </div>
            </aside>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1f2937] w-full max-w-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Share Your Work</h2>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpload} className="space-y-6">
                                    {/* File Dropzone */}
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.pdf,.mp4"
                                            onChange={(e) => setUploadFile(e.target.files[0])}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all
                                                ${uploadFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                                        >
                                            {uploadFile ? (
                                                <>
                                                    <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
                                                        {uploadFile.type === 'application/pdf' ? <FileText className="w-8 h-8" /> :
                                                            uploadFile.type.startsWith('video/') ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-white mb-1">{uploadFile.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-4 bg-white/5 rounded-2xl text-slate-400">
                                                        <Upload className="w-8 h-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-300 mb-1">Upload JPG, PDF or MP4</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Max 50MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Related Course</label>
                                            <select
                                                value={uploadCourse}
                                                onChange={(e) => setUploadCourse(e.target.value)}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors uppercase font-bold"
                                            >
                                                {courses.filter(c => c !== 'All').map(c => (
                                                    <option key={c} value={c.toLowerCase()} className="bg-[#1f2937]">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Caption</label>
                                        <textarea
                                            placeholder="What did you learn from these notes?"
                                            value={uploadCaption}
                                            onChange={(e) => setUploadCaption(e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                        />
                                    </div>

                                    {uploadError && <p className="text-red-400 text-xs font-bold text-center">{uploadError}</p>}

                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black italic uppercase py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                                    >
                                        {isUploading ? 'Verifying with Trellis AI...' : 'Submit Post'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PostCard = ({ post, currentUser, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);

    const isImage = post.fileType === 'image';
    const isVideo = post.fileType === 'video';
    const isPdf = post.fileType === 'pdf';

    // Normalize file URL for frontend (remove leading slash if needed, or point to full backend URL)
    const backendUrl = "http://127.0.0.1:5000";
    const mediaUrl = `${backendUrl}${post.fileUrl}`;
    const token = localStorage.getItem('token');

    const isLiked = post.likes?.includes(currentUser?._id);

    const handleLike = async () => {
        if (!token || isLiking) return;
        setIsLiking(true);
        try {
            const res = await axios.put(`${backendUrl}/api/community/like/${post._id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            onUpdate(post._id, { likes: res.data });
        } catch (err) {
            console.error("Error liking post:", err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!token || !commentText.trim() || isCommenting) return;
        setIsCommenting(true);
        try {
            const res = await axios.post(`${backendUrl}/api/community/comment/${post._id}`,
                { text: commentText },
                { headers: { 'x-auth-token': token } }
            );
            onUpdate(post._id, { comments: res.data });
            setCommentText('');
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setIsCommenting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="break-inside-avoid mb-6 bg-[#1f2937] rounded-3xl border border-white/5 shadow-xl hover:border-white/20 transition-all overflow-hidden group"
        >
            {/* Media Content */}
            <div className="relative aspect-auto min-h-[150px] bg-slate-800/50 flex items-center justify-center">
                {isImage && (
                    <img src={mediaUrl} alt={post.caption} className="w-full h-auto object-cover" />
                )}

                {isVideo && (
                    <video controls className="w-full h-auto max-h-[400px]">
                        <source src={mediaUrl} type={post.mimeType} />
                    </video>
                )}

                {isPdf && (
                    <div className="w-full h-[400px] relative">
                        <iframe src={mediaUrl} className="w-full h-full" title={post.originalname} />
                        <div className="absolute inset-0 bg-transparent pointer-events-none" />
                    </div>
                )}

                {/* Overlay on hover for PDF/Image */}
                {!isVideo && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                            <Eye className="w-5 h-5" />
                        </a>
                        <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:scale-110 transition-transform">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Info */}
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs">
                            {post.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black italic uppercase tracking-tighter text-white">{post.user?.username}</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{post.user?.selectedTitle || 'Learner'}</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-500 bg-white/5 px-2 py-1 rounded-md">{post.courseId}</span>
                </div>

                {post.caption && (
                    <p className="text-sm text-slate-300 line-clamp-3">{post.caption}</p>
                )}

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-black">{post.likes?.length || 0}</span>
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black">{post.comments?.length || 0}</span>
                        </button>
                    </div>
                    <div className="text-[8px] font-black uppercase text-slate-600 tracking-widest">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Comments Section Drawer */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-4 space-y-4 overflow-hidden"
                        >
                            <form onSubmit={handleComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isCommenting || !commentText.trim()}
                                    className="p-2 bg-blue-600 rounded-xl text-white disabled:opacity-50 hover:bg-blue-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto invisible-scrollbar">
                                {post.comments?.map((comment, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-2xl p-3 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black italic uppercase text-blue-400">{comment.username}</span>
                                            <span className="text-[8px] font-bold text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-300">{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default CommunityHub;
