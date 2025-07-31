import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentSection } from '@/components/dashboard/ContentSection';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  TrendingUp,
  Activity,
  Target,
  Star,
  Search,
  Bell,
  MessageCircle,
  Brain,
  Lightbulb,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboardData();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p>Debes iniciar sesión para acceder al dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400">
          <h2 className="text-xl font-bold mb-2">No hay datos</h2>
          <p>No se encontraron datos para mostrar.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="dashboard-theme min-h-screen">
      <DashboardLayout>
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-80 mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10" />
        
        {/* Left side - Logo and Text */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-green-400 text-sm font-medium">FORMAÇÃO NOCODE</h2>
              <h1 className="text-4xl font-bold text-white">SaaSIA</h1>
            </div>
          </div>
        </div>

        {/* Right side - Lightbulb with brain */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <Lightbulb className="w-24 h-24 text-yellow-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-purple-400" />
            </div>
            {/* Floating icons around lightbulb */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* ChatGPT logo */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">ChatGPT</span>
          </div>
        </div>
      </motion.div>

      {/* Comece aqui Section */}
      <ContentSection 
        title="Comece aqui" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(0, 2).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={course} 
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Fase 1 - Fundamentos Essenciais */}
      <ContentSection 
        title="Fase 1 - Fundamentos Essenciais" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(2, 5).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={course} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Fase 2 - Fundamentos de Ferramentas de IA */}
      <ContentSection 
        title="Fase 2 - Fundamentos de Ferramentas de Inteligência Artificial" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(5, 10).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={course} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Fase 3 - Fundamentos NoCode */}
      <ContentSection 
        title="Fase 3 - Fundamentos para desenvolvimento de Aplicativos NoCode" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(0, 5).map((course, index) => (
          <motion.div
            key={`nocode-${course.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={{
                ...course,
                title: [
                  'INTRODUÇÃO DA TRILHA MASTERCLASS NOCODE',
                  'FUNDAMENTOS MVPS NOCODE',
                  'FUNDAMENTOS AUTOMAÇÕES NOCODE',
                  'FUNDAMENTOS WEBSITES NOCODE',
                  'FUNDAMENTOS SAAS NOCODE'
                ][index] || course.title,
                description: [
                  'Introducción a la masterclass NoCode',
                  'Fundamentos de MVPs con NoCode',
                  'Fundamentos de automatizaciones NoCode',
                  'Fundamentos de websites NoCode',
                  'Fundamentos de SaaS NoCode'
                ][index] || course.description
              }} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Fase 4 - Cases Essenciais */}
      <ContentSection 
        title="Fase 4 - Cases Essenciais NoCode + IA" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(0, 5).map((course, index) => (
          <motion.div
            key={`cases-${course.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={{
                ...course,
                title: [
                  'AUTOMAÇÕES DE IA TURBINANDO QUALQUER PRODUTO EM MINUTOS',
                  'APIS DE IA MICROSAAS COM GPT VISION',
                  'CLONANDO O CHATGPT',
                  'FUNCTION CALLING CONSTRUINDO GPTS E ASSISTENTES COM ESTEROIDES',
                  'ASSISTANTS NA PRÁTICA CRIANDO SEU ASSISTENTE PARA WHATSAPP'
                ][index] || course.title,
                description: [
                  'Automatizaciones de IA potenciando cualquier producto en minutos',
                  'APIs de IA MicroSaaS con GPT Vision',
                  'Clonando ChatGPT',
                  'Function Calling construyendo GPTs y asistentes con esteroides',
                  'Asistentes en práctica creando tu asistente para WhatsApp'
                ][index] || course.description
              }} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Fase 5 - Do Zero ao SaaS */}
      <ContentSection 
        title="Fase 5 - Do Zero ao SaaS NoCodeIA" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(0, 5).map((course, index) => (
          <motion.div
            key={`saas-${course.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={{
                ...course,
                title: [
                  'PLANEJANDO SEU MICRO-SAAS',
                  'DO ZERO AO APP 01 MESTRE DO DESIGN RESPONSIVO',
                  'DO ZERO AO APP 02 INTELIGÊNCIA E BACKEND',
                  'CONECTANDO ASSISTENTE DE IA AOS DADOS DO APP',
                  'EXPANDINDO SEU SEU ASSISTENTE PARA O WHATSAPP'
                ][index] || course.title,
                description: [
                  'Planificando tu Micro-SaaS',
                  'Del cero al app 01 maestro del diseño responsivo',
                  'Del cero al app 02 inteligencia y backend',
                  'Conectando asistente de IA a los datos del app',
                  'Expandindo tu asistente para WhatsApp'
                ][index] || course.description
              }} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Masterclasses SaaS NoCode IA */}
      <ContentSection 
        title="Masterclasses SaaS NoCode IA" 
        onSettingsClick={() => console.log('Settings clicked')}
      >
        {data.courses.slice(0, 3).map((course, index) => (
          <motion.div
            key={`masterclass-${course.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CourseCard 
              course={{
                ...course,
                title: [
                  'FlowiseAI Criando um multiatendimento de IA com Flowise',
                  'microsaas MasterClass do Zero a R$10k com Micro-Saas de IA',
                  'zaia Criando Agentes de Atendimento e Vendas No Code'
                ][index] || course.title,
                description: [
                  'Creando un multiatendimiento de IA con Flowise',
                  'MasterClass del cero a R$10k con Micro-SaaS de IA',
                  'Creando agentes de atención y ventas No Code'
                ][index] || course.description
              }} 
              variant="compact"
              onClick={() => console.log('Course clicked:', course.id)}
            />
          </motion.div>
        ))}
      </ContentSection>

      {/* Bottom Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative h-64 mt-8 rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-orange-400 text-2xl font-bold mb-2">FORMAÇÃO GESTOR</h2>
            <h1 className="text-5xl font-bold text-white">AgentesIA</h1>
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-400 text-sm">Desenvolvido por No-Code Start-Up</p>
        </div>
      </motion.div>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    </DashboardLayout>
    </div>
  );
}