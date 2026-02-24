import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Map,
    Trophy,
    BookOpen,
    Target,
    Settings,
    Sparkles,
    Users,
    LayoutGrid
} from 'lucide-react';
import YipHead from '../assets/Yip_head.png';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-16 md:w-24 fixed left-0 top-0 bottom-0 bg-[#1f2937] border-r border-white/5 flex flex-col items-center py-6 z-50">
            <div className="mb-8 px-2 transition-transform hover:scale-110 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <img src={YipHead} alt="Yip" className="w-full h-auto drop-shadow-[0_4px_15px_rgba(74,144,226,0.5)]" />
            </div>

            <nav className="flex flex-col gap-6">
                <NavItem
                    icon={<Map className="w-6 h-6" />}
                    active={isActive('/dashboard')}
                    onClick={() => navigate('/dashboard')}
                />
                <NavItem
                    icon={<Sparkles className="w-6 h-6" />}
                    active={isActive('/summarizer')}
                    onClick={() => navigate('/summarizer')}
                />
                <NavItem
                    icon={<Trophy className="w-6 h-6" />}
                    active={isActive('/leaderboard')}
                    onClick={() => navigate('/leaderboard')}
                />
                <NavItem
                    icon={<Users className="w-6 h-6" />}
                    active={isActive('/nexus')}
                    onClick={() => navigate('/nexus')}
                />
                <NavItem
                    icon={<BookOpen className="w-6 h-6" />}
                    active={isActive('/sections')}
                    onClick={() => navigate('/sections')}
                />
                <NavItem
                    icon={<LayoutGrid className="w-6 h-6" />}
                    active={isActive('/community')}
                    onClick={() => navigate('/community')}
                />
                <NavItem
                    icon={<Target className="w-6 h-6" />}
                    active={isActive('/streak')}
                    onClick={() => navigate('/streak')}
                />
            </nav>

            <div className="mt-auto">
                <NavItem icon={<Settings className="w-7 h-7" />} active={isActive('/settings')} onClick={() => navigate('/settings')} />
            </div>
        </aside>
    );
};

const NavItem = ({ icon, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
        {icon}
    </button>
);

export default Sidebar;
