import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  Play, 
  Volume2, 
  Settings, 
  Square, 
  Maximize,
  Heart,
  MessageCircle,
  Share,
  User,
  Bell,
  FileText,
  Users,
  Briefcase,
  Lightbulb,
  Bot,
  Zap,
  BookOpen,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  Bell as BellIcon,
  MessageSquare as MessageSquareIcon,
  Users as UsersIcon,
  Settings as SettingsIcon
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    badge: string;
  };
  date: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function Community() {
  const [activeCategory, setActiveCategory] = React.useState('feed');

  const categories = [
    {
      id: 'welcome',
      title: 'Bienvenido',
      items: [
        { id: 'welcome', label: 'Bienvenido', icon: User },
        { id: 'start-here', label: 'Empieza aqui', icon: User },
        { id: 'announcements', label: 'Anuncios', icon: Bell },
        { id: 'introduce', label: 'Preséntate', icon: User },
        { id: 'lives', label: 'Vidas y Encuentros', icon: Users },
      ]
    },
    {
      id: 'networks',
      title: 'Redes',
      items: [
        { id: 'share-project', label: 'Comparte tu Proyecto/Tr...', icon: Share },
        { id: 'chat-networks', label: 'Redes de chat', icon: MessageCircle },
        { id: 'vacancies', label: 'Vacantes y oportunidades', icon: Briefcase },
        { id: 'tips', label: 'Consejos y noticias', icon: Lightbulb },
      ]
    },
    {
      id: 'market',
      title: 'Mercado y negocios',
      items: [
        { id: 'marketing', label: 'Marketing y ventas', icon: Briefcase },
      ]
    },
    {
      id: 'answers',
      title: 'Obtenga respuestas a sus ...',
      items: [
        { id: 'ai-agents', label: 'Agentes de IA', icon: Bot },
        { id: 'automations', label: 'Automatizaciones', icon: Zap },
        { id: 'software', label: 'Software y aplicaciones', icon: Settings },
        { id: 'nocode-als', label: 'NoCode.Als', icon: FileText },
      ]
    },
    {
      id: 'in',
      title: 'En',
      items: [
        { id: 'class-materials', label: 'Materiales de clase', icon: BookOpen },
        { id: 'faq', label: 'Preguntas frecuentes', icon: HelpCircle },
      ]
    },
    {
      id: 'study-field',
      title: 'Campo de golf',
      items: [
        { id: 'class-access', label: 'Acceso a clases', icon: GraduationCap },
        { id: 'whatsapp-support', label: 'Soporte de WhatsApp', icon: MessageSquare },
        { id: 'notifications', label: 'Canal de notificaciones', icon: BellIcon },
        { id: 'feedback', label: 'Comentarios y sugerenc...', icon: MessageSquareIcon },
        { id: 'work-with-us', label: 'Trabaja con nosotros', icon: UsersIcon },
      ]
    }
  ];

  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Jhonatan Gomes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
        role: 'Administrador',
        badge: 'Experto'
      },
      date: '16 de mayo',
      title: 'Cómo crear credenciales de Google Drive - N8N',
      description: 'Para que usa n8n hospedado é assim que se cria credencial do google',
      type: 'video',
      videoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 10,
      comments: 24,
      shares: 5
    },
    {
      id: '2',
      author: {
        name: 'Jhonatan Gomes',
        avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop',
        role: 'Administrador',
        badge: 'Experto'
      },
      date: '23 de junio',
      title: 'Intervención humana en las automatizaciones',
      description: 'Descubre cómo integrar la intervención humana en tus automatizaciones para mayor control y flexibilidad.',
      type: 'text',
      likes: 15,
      comments: 8,
      shares: 3
    }
  ];

  return (
    <div className="community-theme min-h-screen">
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 flex-shrink-0">
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-white font-bold text-lg">no code-start up</h1>
          </div>
          
          {/* Active Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <span className="text-white font-medium">Alimentar</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 py-4 overflow-y-auto">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.05 }}
              className="mb-6"
            >
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-6 mb-3">
                {category.title}
              </h3>
              <nav className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.05) + (itemIndex * 0.02) }}
                  >
                    <button
                      onClick={() => setActiveCategory(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-2 text-left transition-all duration-200 group ${
                        activeCategory === item.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-r-2 border-blue-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Para buscar"
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Acceso
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg text-white">
                <span className="text-sm">Popular</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Section Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white mb-6"
          >
            Alimentar
          </motion.h1>

          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-white text-lg font-medium mb-2">3 ANOS DA no code start up</h2>
                <h1 className="text-white text-3xl font-bold mb-4">
                  VEM AI: A MAIOR OFERTA DE ANIVERSÁRIO DA NOCODE STARTUP
                </h1>
                <p className="text-white/80 text-lg mb-6">DATA: 05/08, ÀS 19H30</p>
                <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  CADASTRE-SE E RECEBA A CONDIÇÃO ESPECIAL EM PRIMEIRA MÃO
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src={`https://images.unsplash.com/photo-${1507003211169 + i}?w=50&h=50&fit=crop`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{post.author.name}</h3>
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                            {post.author.role}
                          </span>
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            {post.author.badge}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">Para compartir</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h4 className="text-white font-bold text-lg mb-2">{post.title}</h4>
                  <p className="text-gray-400 mb-4">{post.description}</p>

                  {/* Video Player */}
                  {post.type === 'video' && post.videoUrl && (
                    <div className="relative mb-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <img
                          src={post.videoUrl}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-4">
                          <button className="text-white hover:text-gray-300 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="text-white hover:text-gray-300 transition-colors">
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full w-0"></div>
                          </div>
                          <span className="text-white text-sm">00:00</span>
                          <button className="text-white hover:text-gray-300 transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="text-white hover:text-gray-300 transition-colors">
                            <Square className="w-4 h-4" />
                          </button>
                          <button className="text-white hover:text-gray-300 transition-colors">
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes} me gusta</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments} comentarios</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
} 