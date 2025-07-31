import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 hero-gradient">
      <div className="container mx-auto text-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-brand-muted rounded-full text-sm font-medium text-brand mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Plataforma #1 para Creadores de Contenido
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crea y Monetiza tu
            <span className="text-brand-gradient block">Comunidad Online</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            La plataforma definitiva que combina comunidades vibrantes con cursos premium. 
            Construye, enseña y genera ingresos recurrentes con herramientas profesionales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 shadow-brand btn-brand">
                Crear mi Comunidad
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 hover:bg-brand-muted hover:text-brand transition-smooth"
            >
              <Play className="mr-2 w-5 h-5" />
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-3xl font-bold mb-2">10,000+</h3>
            <p className="text-muted-foreground">Creadores Activos</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-3xl font-bold mb-2">50,000+</h3>
            <p className="text-muted-foreground">Cursos Publicados</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-3xl font-bold mb-2">$2M+</h3>
            <p className="text-muted-foreground">Ingresos Generados</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4">Confían en nosotros:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-muted-foreground font-semibold">TechStart</div>
            <div className="text-muted-foreground font-semibold">EduPro</div>
            <div className="text-muted-foreground font-semibold">LearnHub</div>
            <div className="text-muted-foreground font-semibold">SkillMaster</div>
          </div>
        </div>
      </div>
    </section>
  );
}