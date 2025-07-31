import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  showControls?: boolean;
  onSettingsClick?: () => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  children,
  showControls = true,
  onSettingsClick
}) => {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-black text-black uppercase tracking-tight border-4 border-black bg-white px-6 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1"
        >
          {title}
        </motion.h2>

        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {/* Scroll Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-3 border-4 border-black transition-all ${
                  canScrollLeft
                    ? 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-3 border-4 border-black transition-all ${
                  canScrollRight
                    ? 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Button */}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-3 border-4 border-black bg-white text-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Content Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {children}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}; 