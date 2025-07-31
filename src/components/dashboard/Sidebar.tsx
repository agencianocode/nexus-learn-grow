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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900/95 to-gray-800/95">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border-b border-gray-800/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-white font-bold text-lg">no code-start up</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar cursos e aulas"
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 border-b border-gray-800/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">FS</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Fabian Segura</h3>
            <p className="text-gray-400 text-sm">Estudiante Premium</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
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
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 group ${
                  activeItem === item.id
                    ? 'bg-gradient-to-r from-vibrant-500/20 to-vibrant-600/20 border-r-2 border-vibrant-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-200 ${
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
        className="p-6 border-t border-gray-800/50"
      >
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </motion.div>
    </div>
  );
}; 