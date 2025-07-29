import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      
      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gradient">EduCommunity</span>
              </div>
              <p className="text-muted-foreground text-sm">
                La plataforma definitiva para crear y monetizar comunidades de aprendizaje online.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Características</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Precios</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Casos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Testimonios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Guías</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentación</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Compañía</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Carreras</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contacto</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EduCommunity. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
