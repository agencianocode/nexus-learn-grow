import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Users, BookOpen, Eye } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  enrolledCount: number;
  rating: number;
  reviews: number;
  status: 'draft' | 'published';
  requirements: string[];
  learningObjectives: string[];
  progress?: number;
  isCompleted?: boolean;
}

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClick,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500 text-white';
      case 'Intermediate':
        return 'bg-yellow-500 text-white';
      case 'Advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'Principiante';
      case 'Intermediate':
        return 'Intermedio';
      case 'Advanced':
        return 'Avanzado';
      default:
        return level;
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="w-64 cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-green-500/50 transition-all duration-200">
          {/* Thumbnail */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play Button Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
                                    <div className="w-12 h-12 bg-vibrant-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
            </motion.div>

            {/* Progress Bar */}
            {course.progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-vibrant-500 to-vibrant-600"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Level Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {getLevelText(course.level)}
              </span>
              {course.price === 0 && (
                <span className="text-green-400 text-sm font-medium">Gratis</span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-400 transition-colors duration-200">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {course.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{course.enrolledCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="w-80 cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-green-500/50 transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </motion.div>

          {/* Progress Bar */}
          {course.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 to-teal-500"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Level Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
              {getLevelText(course.level)}
            </span>
            {course.price === 0 && (
              <span className="text-green-400 text-sm font-medium">Gratis</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-green-400 transition-colors duration-200">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{course.enrolledCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-green-400 text-sm font-medium">{course.category}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200"
            >
              {course.progress === 100 ? 'Completado' : 'Continuar'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 