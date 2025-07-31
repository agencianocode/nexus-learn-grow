import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Users, 
  HelpCircle, 
  ChevronRight,
  Search,
  Monitor,
  Calendar,
  Trophy,
  Info,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Monitor, href: '/dashboard' },
  { id: 'community', label: 'Comunidade', icon: Users, href: '/community' },
  { id: 'classroom', label: 'Classroom', icon: Monitor, href: '/classroom' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
  { id: 'members', label: 'Members', icon: Users, href: '/members' },
  { id: 'leaderboards', label: 'Leaderboards', icon: Trophy, href: '/leaderboards' },
  { id: 'about', label: 'About', icon: Info, href: '/about' },
  { id: 'support', label: 'Suporte', icon: HelpCircle, href: '/support' },
];

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeItem, setActiveItem] = React.useState('home');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border-b-4 border-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white border-2 border-white flex items-center justify-center transform rotate-3">
            <span className="text-black font-black text-sm">N</span>
          </div>
          <h1 className="text-white font-black text-lg uppercase tracking-wide">NO CODE-START UP</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
          <input
            type="text"
            placeholder="PESQUISAR CURSOS E AULAS"
            className="w-full pl-10 pr-4 py-3 bg-white border-4 border-white text-black placeholder-black font-bold uppercase tracking-wide focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
          />
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 border-b-4 border-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white border-4 border-white flex items-center justify-center transform -rotate-2">
            <span className="text-black font-black text-lg">FS</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-black uppercase tracking-wide">FABIAN SEGURA</h3>
            <p className="text-white font-bold text-sm bg-black px-2 py-1 border-2 border-white transform rotate-1 inline-block">ESTUDIANTE PREMIUM</p>
          </div>
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 py-4"
      >
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all group ${
                  activeItem === item.id
                    ? 'bg-white text-black border-l-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                    : 'text-white hover:text-black hover:bg-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wide">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-black text-white text-xs px-3 py-1 border-2 border-white transform rotate-2 font-black">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${
                  activeItem === item.id ? 'rotate-90' : 'group-hover:translate-x-1'
                }`} />
              </button>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 border-t-4 border-white"
      >
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-6 py-4 text-white hover:text-black hover:bg-white transition-all group font-bold uppercase tracking-wide border-2 border-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="font-black">CERRAR SESIÓN</span>
        </button>
      </motion.div>
    </div>
  );
}; 