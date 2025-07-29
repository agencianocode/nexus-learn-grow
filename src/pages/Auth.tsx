import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Navigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Por favor ingresa tu nombre completo",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Error al registrarse",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Registro exitoso!",
            description: "Por favor revisa tu email para confirmar tu cuenta",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error al iniciar sesión",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Bienvenido de vuelta!",
            description: "Has iniciado sesión exitosamente",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-2xl">E</span>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? 'Crear tu cuenta' : 'Bienvenido de vuelta'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Únete a miles de creadores exitosos' 
                : 'Inicia sesión en tu cuenta de EduCommunity'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
              </p>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="p-0 h-auto font-semibold text-primary"
              >
                {isSignUp ? 'Iniciar sesión' : 'Crear cuenta gratis'}
              </Button>
            </div>

            {isSignUp && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                Al crear una cuenta, aceptas nuestros{' '}
                <Link to="/terms" className="underline hover:text-foreground">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link to="/privacy" className="underline hover:text-foreground">
                  Política de Privacidad
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}