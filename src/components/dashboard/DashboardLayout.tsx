import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-80 bg-black border-r-4 border-black flex-shrink-0"
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 overflow-y-auto bg-white"
      >
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
}; 