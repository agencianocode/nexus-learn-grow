import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-brand-gradient">EduCommunity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-smooth">
              Cursos
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-smooth">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="hover:bg-brand-muted hover:text-brand transition-smooth">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="hover:bg-brand-muted hover:text-brand transition-smooth">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="btn-brand">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-brand-muted hover:text-brand transition-smooth"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/courses" 
                className="block text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link 
                to="/features" 
                className="block text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="block text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="block text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full justify-start hover:bg-brand-muted hover:text-brand transition-smooth">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth">
                      <Button variant="outline" className="w-full justify-start hover:bg-brand-muted hover:text-brand transition-smooth">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="w-full justify-start btn-brand">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}