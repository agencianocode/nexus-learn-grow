import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Play, 
  Volume2, 
  Settings, 
  Square, 
  Maximize, 
  CheckCircle, 
  Star, 
  Menu,
  ChevronRight,
  ChevronDown,
  User,
  Search,
  MessageCircle,
  FileText,
  GraduationCap,
  MousePointer,
  Settings as SettingsIcon
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: number;
  total: number;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  instructors: string[];
  isCompleted: boolean;
  isCurrent: boolean;
}

export default function CourseLearn() {
  const [currentLesson, setCurrentLesson] = React.useState('3');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(67);
  const [volume, setVolume] = React.useState(50);

  const modules: Module[] = [
    {
      id: '1',
      title: 'Módulo 01 - O poderoso Desenvolvimento Pessoal',
      completed: 1,
      total: 2,
      lessons: [
        {
          id: '1',
          title: 'Aula 01 | Introdução',
          duration: '15:30',
          thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=60&fit=crop',
          instructors: ['Diego', 'Mauricio'],
          isCompleted: true,
          isCurrent: false
        },
        {
          id: '2',
          title: 'Aula 02 | Fundamentos',
          duration: '22:15',
          thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=60&fit=crop',
          instructors: ['Diego', 'Mauricio'],
          isCompleted: true,
          isCurrent: false
        }
      ]
    },
    {
      id: '2',
      title: 'Módulo 02 - O poderoso Desenvolvimento Pessoal',
      completed: 1,
      total: 1,
      lessons: [
        {
          id: '3',
          title: 'Aula 03 | EXEMPLO',
          duration: '3:47',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=60&fit=crop',
          instructors: ['Diego', 'Mauricio'],
          isCompleted: true,
          isCurrent: true
        }
      ]
    }
  ];

  const currentLessonData = modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === currentLesson);

  return (
    <div className="course-theme min-h-screen">
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Left Navigation Sidebar */}
      <div className="w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 flex-shrink-0">
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-white font-bold text-lg">ÁREA DE EXEMPLO ALPHALIFE ACADEMY</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar cursos e aulas..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Bruna</h3>
              <p className="text-gray-400 text-sm">Estudiante Premium</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Seu progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 py-4">
          <nav className="space-y-1">
            {[
              { icon: User, label: 'Home', active: false },
              { icon: User, label: 'Perfil', active: false },
              { icon: Search, label: 'Buscar', active: false },
              { icon: MessageCircle, label: 'Chat', active: false },
              { icon: FileText, label: 'Documentos', active: false },
              { icon: GraduationCap, label: 'Cursos', active: true },
              { icon: MousePointer, label: 'Herramientas', active: false },
              { icon: SettingsIcon, label: 'Configuración', active: false },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <button
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 group ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-r-2 border-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          <div className="relative w-full h-full">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop"
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-50"
              />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
                
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full w-0"></div>
                </div>
                
                <span className="text-white text-sm">0:00 / 3:47</span>
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Square className="w-5 h-5" />
                </button>
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Title */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 border-t border-gray-800/50">
          <h2 className="text-white text-lg font-semibold">
            {currentLessonData?.title}
          </h2>
          <p className="text-gray-400 text-sm">
            {currentLessonData?.instructors.join(', ')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              <span>✓ Concluído</span>
            </button>
            
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-4 h-4" />
              <span>5/5</span>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Menu className="w-4 h-4" />
              <span>Fechar Conteúdo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Course Content Sidebar */}
      <div className="w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50 flex-shrink-0">
        <div className="p-6">
          {/* Course Title & Progress */}
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg mb-2">
              O poderoso Desenvolvimento Pessoal
            </h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progresso total</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: moduleIndex * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">{module.title}</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  {module.completed}/{module.total} concluídos
                </p>
                
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        lesson.isCurrent
                          ? 'bg-blue-500/20 border-l-2 border-blue-500'
                          : 'hover:bg-gray-700/50'
                      }`}
                      onClick={() => setCurrentLesson(lesson.id)}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">
                          {lesson.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {lesson.instructors.join(', ')}
                        </p>
                      </div>
                      
                      {lesson.isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
            <span>Próxima Aula</span>
          </motion.button>
        </div>
      </div>
    </div>
    </div>
  );
}