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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-center">
          <h1 className="text-3xl font-black mb-4 uppercase tracking-wide">ACCESO DENEGADO</h1>
          <p className="font-bold">DEBES INICIAR SESIÓN PARA ACCEDER AL DASHBOARD.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-black text-center">
            <div className="w-16 h-16 border-4 border-black mx-auto mb-4 animate-spin" style={{
              borderLeftColor: 'transparent'
            }}></div>
            <p className="font-black uppercase tracking-wide">CARGANDO DASHBOARD...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-wide">ERROR</h2>
          <p className="font-bold">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-wide">NO HAY DATOS</h2>
          <p className="font-bold">NO SE ENCONTRARON DATOS PARA MOSTRAR.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <DashboardLayout>
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-80 mb-8 overflow-hidden bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="absolute inset-0 bg-white opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m20 20 20 0 0-20-20 0z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Left side - Logo and Text */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white border-4 border-white flex items-center justify-center transform rotate-3">
              <Brain className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black uppercase tracking-wide mb-2 bg-black px-3 py-1 border-2 border-white transform -rotate-1">FORMAÇÃO NOCODE</h2>
              <h1 className="text-5xl font-black text-white uppercase tracking-tight">SAASIA</h1>
            </div>
          </div>
        </div>

        {/* Right side - Lightbulb with brain */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="relative bg-white p-4 border-4 border-white transform rotate-2">
            <Lightbulb className="w-20 h-20 text-black" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-10 h-10 text-black" />
            </div>
            {/* Floating icons around lightbulb */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border-2 border-white flex items-center justify-center transform rotate-12">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black border-2 border-white flex items-center justify-center transform -rotate-12">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* ChatGPT logo */}
        <div className="absolute top-4 right-4">
          <div className="bg-white border-4 border-white px-4 py-2 transform -rotate-2">
            <span className="text-black text-sm font-black uppercase tracking-wide">CHATGPT</span>
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
        className="relative h-64 mt-8 overflow-hidden bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="absolute inset-0 bg-white opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='15,0 30,30 0,30'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block bg-white text-black px-6 py-2 font-black uppercase tracking-wider mb-4 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform rotate-1">
              🎯 FORMAÇÃO GESTOR
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tight">AGENTESIA</h1>
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-white font-black uppercase tracking-wide text-sm bg-black px-4 py-2 border-2 border-white transform -rotate-1">DESENVOLVIDO POR NO-CODE START-UP</p>
        </div>
      </motion.div>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button className="w-16 h-16 bg-black border-4 border-black text-white flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-3 hover:rotate-6">
          <MessageCircle className="w-8 h-8" />
        </button>
      </motion.div>
    </DashboardLayout>
    </div>
  );
}