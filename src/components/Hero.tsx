import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 hero-gradient">
      <div className="container mx-auto text-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Plataforma #1 para Creadores de Contenido
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crea y Monetiza tu
            <span className="text-gradient block">Comunidad Online</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            La plataforma definitiva que combina comunidades vibrantes con cursos premium. 
            Construye, enseña y genera ingresos recurrentes con herramientas profesionales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 shadow-elegant">
                Crear mi Comunidad
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
            >
              <Play className="mr-2 w-5 h-5" />
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
            <div className="text-muted-foreground">Creadores Activos</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">1M+</div>
            <div className="text-muted-foreground">Estudiantes Conectados</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">$10M+</div>
            <div className="text-muted-foreground">Generados por Creadores</div>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="aspect-video bg-muted rounded-2xl shadow-elegant overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                <Button size="lg" variant="secondary" className="shadow-glow">
                  <Play className="w-8 h-8 mr-3" />
                  Reproducir Demo
                </Button>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}