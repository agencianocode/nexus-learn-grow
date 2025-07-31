import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  GraduationCap, 
  DollarSign, 
  BarChart3, 
  Palette, 
  Zap,
  Users,
  Video,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Feed Social Avanzado',
    description: 'Posts multimedia, reacciones, comentarios anidados y polls interactivos para maximizar el engagement.'
  },
  {
    icon: GraduationCap,
    title: 'Cursos Premium',
    description: 'Video player avanzado con notas, transcripciones, certificaciones automáticas y tracking de progreso.'
  },
  {
    icon: DollarSign,
    title: 'Monetización Flexible',
    description: 'Múltiples modelos de revenue: suscripciones, cursos individuales, coaching 1-on-1 y productos digitales.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Profundos',
    description: 'Insights detallados sobre engagement, retención, ingresos y comportamiento de tus miembros.'
  },
  {
    icon: Palette,
    title: 'Branding Personalizable',
    description: 'Diseña tu comunidad con colores, logos y temas únicos que reflejen tu marca personal.'
  },
  {
    icon: Zap,
    title: 'Gamificación',
    description: 'Sistema de XP, badges, leaderboards y challenges para mantener a tus miembros motivados.'
  },
  {
    icon: Users,
    title: 'Networking IA',
    description: 'Matching inteligente entre miembros, grupos de estudio automáticos y programa de mentorías.'
  },
  {
    icon: Video,
    title: 'Live Streaming',
    description: 'Transmisiones en vivo integradas con chat, Q&A y grabación automática para tu biblioteca.'
  },
  {
    icon: Shield,
    title: 'Moderación Inteligente',
    description: 'Herramientas avanzadas de moderación con IA para mantener un ambiente seguro y productivo.'
  }
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-brand-muted rounded-full text-sm font-medium text-brand mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Características Avanzadas
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Todo lo que necesitas para
            <span className="text-brand-gradient block">hacer crecer tu comunidad</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas profesionales diseñadas específicamente para creadores que quieren 
            construir comunidades prósperas y generar ingresos sostenibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-brand transition-smooth border-0 card-gradient"
            >
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-brand-muted rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}