import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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

interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    theme: 'light' | 'dark' | 'custom';
    customCSS?: string;
  };
  subscription: {
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    trialDays?: number;
  };
  settings: {
    isPrivate: boolean;
    requiresApproval: boolean;
    allowGuestPosts: boolean;
    enableCourses: boolean;
    enableEvents: boolean;
  };
  stats: {
    totalMembers: number;
    onlineMembers: number;
    coursesCount: number;
    eventsCount: number;
  };
}

interface DashboardData {
  courses: Course[];
  communities: Community[];
  userProgress: {
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    certificates: number;
  };
  recentActivity: any[];
  recommendations: Course[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data para formación NoCode con IA
        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'COMECE POR AQUI',
            description: 'Inicia tu formación en NoCode con IA',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            price: 0,
            duration: '2h 30m',
            level: 'Beginner',
            category: 'Fundamentos',
            enrolledCount: 15420,
            rating: 4.9,
            reviews: 234,
            status: 'published',
            requirements: ['Disposición para aprender'],
            learningObjectives: ['Introducción al NoCode', 'Conceptos básicos de IA'],
            progress: 100
          },
          {
            id: '2',
            title: 'Materiais da Formação IA',
            description: 'Com Link dos Projetos',
            thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
            price: 0,
            duration: '1h 45m',
            level: 'Beginner',
            category: 'Recursos',
            enrolledCount: 15420,
            rating: 4.8,
            reviews: 189,
            status: 'published',
            requirements: ['Acceso al curso'],
            learningObjectives: ['Materiales de apoyo', 'Proyectos prácticos'],
            progress: 75
          },
          {
            id: '3',
            title: 'FUNDAMENTOS DE DESENVOLVIMENTO DE PRODUTOS',
            description: 'Aprende los fundamentos del desarrollo de productos',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            price: 0,
            duration: '4h 15m',
            level: 'Beginner',
            category: 'Fase 1',
            enrolledCount: 12450,
            rating: 4.7,
            reviews: 156,
            status: 'published',
            requirements: ['Conocimientos básicos'],
            learningObjectives: ['Desarrollo de productos', 'Metodologías ágiles'],
            progress: 60
          },
          {
            id: '4',
            title: 'FUNDAMENTOS DE DESENVOLVIMENTO DE SOFTWARES',
            description: 'Fundamentos del desarrollo de software',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
            price: 0,
            duration: '5h 30m',
            level: 'Intermediate',
            category: 'Fase 1',
            enrolledCount: 11890,
            rating: 4.6,
            reviews: 134,
            status: 'published',
            requirements: ['Lógica de programación'],
            learningObjectives: ['Arquitectura de software', 'Patrones de diseño'],
            progress: 45
          },
          {
            id: '5',
            title: 'FUNDAMENTOS DE INTELIGÊNCIA ARTIFICIAL',
            description: 'Introducción a la inteligencia artificial',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
            price: 0,
            duration: '6h 45m',
            level: 'Beginner',
            category: 'Fase 1',
            enrolledCount: 13200,
            rating: 4.8,
            reviews: 178,
            status: 'published',
            requirements: ['Matemáticas básicas'],
            learningObjectives: ['Machine Learning', 'Deep Learning'],
            progress: 30
          },
          {
            id: '6',
            title: 'INTRODUÇÃO DA TRILHA MASTERCLASS IA & ENGENHARIA DE PROMPT',
            description: 'Masterclass en IA y ingeniería de prompts',
            thumbnail: 'https://images.unsplash.com/photo-1676299251956-41540bfd4589?w=400&h=300&fit=crop',
            price: 0,
            duration: '8h 20m',
            level: 'Advanced',
            category: 'Fase 2',
            enrolledCount: 9870,
            rating: 4.9,
            reviews: 245,
            status: 'published',
            requirements: ['Conocimientos de IA'],
            learningObjectives: ['Prompt Engineering', 'Optimización de IA'],
            progress: 20
          },
          {
            id: '7',
            title: 'IAS PARA TEXTO E AGENTES',
            description: 'IAs para texto y agentes inteligentes',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
            price: 0,
            duration: '7h 15m',
            level: 'Intermediate',
            category: 'Fase 2',
            enrolledCount: 8760,
            rating: 4.7,
            reviews: 167,
            status: 'published',
            requirements: ['Fundamentos de IA'],
            learningObjectives: ['Procesamiento de texto', 'Agentes conversacionales'],
            progress: 15
          },
          {
            id: '8',
            title: 'IA PARA GERAÇÃO DE IMAGEM',
            description: 'Generación de imágenes con IA',
            thumbnail: 'https://images.unsplash.com/photo-1686191128892-3e8d9a49c7b3?w=400&h=300&fit=crop',
            price: 0,
            duration: '6h 30m',
            level: 'Intermediate',
            category: 'Fase 2',
            enrolledCount: 7650,
            rating: 4.6,
            reviews: 143,
            status: 'published',
            requirements: ['Conocimientos básicos de IA'],
            learningObjectives: ['Generación de imágenes', 'DALL-E, Midjourney'],
            progress: 10
          },
          {
            id: '9',
            title: 'IA PARA GERAÇÃO DE ÁUDIO',
            description: 'Generación de audio con IA',
            thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=300&fit=crop',
            price: 0,
            duration: '5h 45m',
            level: 'Intermediate',
            category: 'Fase 2',
            enrolledCount: 6540,
            rating: 4.5,
            reviews: 128,
            status: 'published',
            requirements: ['Fundamentos de audio'],
            learningObjectives: ['Síntesis de voz', 'Generación de música'],
            progress: 5
          },
          {
            id: '10',
            title: 'IA PARA GERAÇÃO DE VÍDEO',
            description: 'Generación de video con IA',
            thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
            price: 0,
            duration: '7h 00m',
            level: 'Advanced',
            category: 'Fase 2',
            enrolledCount: 5430,
            rating: 4.4,
            reviews: 98,
            status: 'published',
            requirements: ['Conocimientos de video'],
            learningObjectives: ['Generación de video', 'Sora, Runway'],
            progress: 0
          }
        ];

        const mockCommunities: Community[] = [
          {
            id: '1',
            name: 'NoCode Community',
            description: 'Comunidad de desarrolladores NoCode',
            slug: 'nocode-community',
            branding: {
              logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=50&h=50&fit=crop',
              primaryColor: '#10B981',
              secondaryColor: '#064E3B',
              theme: 'dark'
            },
            subscription: {
              price: 9.99,
              interval: 'monthly',
              features: ['Acceso a eventos', 'Mentorías', 'Recursos exclusivos']
            },
            settings: {
              isPrivate: false,
              requiresApproval: true,
              allowGuestPosts: false,
              enableCourses: true,
              enableEvents: true
            },
            stats: {
              totalMembers: 15420,
              onlineMembers: 234,
              coursesCount: 45,
              eventsCount: 12
            }
          }
        ];

        const dashboardData: DashboardData = {
          courses: mockCourses,
          communities: mockCommunities,
          userProgress: {
            totalCourses: 25,
            completedCourses: 8,
            totalHours: 156,
            certificates: 6
          },
          recentActivity: [],
          recommendations: mockCourses.slice(0, 3)
        };

        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { data, loading, error };
}; 