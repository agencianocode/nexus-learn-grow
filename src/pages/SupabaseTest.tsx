import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Shield, 
  Upload,
  Users,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { SupabaseTester, SupabaseTestResult } from '@/utils/supabase-test';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TestResults {
  connection: SupabaseTestResult;
  auth: SupabaseTestResult;
  storage: SupabaseTestResult;
  database: SupabaseTestResult;
  overall: boolean;
}

export default function SupabaseTest() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResults = await SupabaseTester.runFullTest();
      setResults(testResults);
    } catch (error) {
      console.error('Error running test:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        ✅ Exitoso
      </Badge>
    ) : (
      <Badge variant="destructive">
        ❌ Error
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Configuración de Supabase</h1>
        <p className="text-muted-foreground">
          Verifica que todos los componentes de Supabase estén configurados correctamente
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">
            <Database className="w-4 h-4 mr-1" />
            Base de Datos
          </Badge>
          <Badge variant="outline">
            <Shield className="w-4 h-4 mr-1" />
            Autenticación
          </Badge>
          <Badge variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Storage
          </Badge>
          <Badge variant="outline">
            <Users className="w-4 h-4 mr-1" />
            Usuarios
          </Badge>
        </div>
      </div>

      {/* Botón de prueba */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Ejecutar Prueba de Configuración</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={runTest} 
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Ejecutando...' : 'Ejecutar Prueba'}</span>
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Última ejecución: {results ? new Date().toLocaleTimeString() : 'Nunca'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuario Autenticado</p>
              <p className="font-medium">
                {user ? user.email : authUser ? authUser.email : 'No autenticado'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={user || authUser ? "default" : "secondary"}>
                {user || authUser ? 'Autenticado' : 'No autenticado'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de la prueba */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultados de la Prueba</h2>
          
          {/* Estado general */}
          <Alert className={results.overall ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center space-x-2">
              {results.overall ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <AlertDescription className="font-medium">
                {results.overall 
                  ? '¡Configuración de Supabase correcta!' 
                  : 'Hay problemas en la configuración de Supabase'
                }
              </AlertDescription>
            </div>
          </Alert>

          {/* Resultados individuales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conexión */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Conexión</span>
                  </CardTitle>
                  {getStatusIcon(results.connection.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{results.connection.message}</p>
                  {getStatusBadge(results.connection.success)}
                  {results.connection.details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Ver detalles</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(results.connection.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Autenticación */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Autenticación</span>
                  </CardTitle>
                  {getStatusIcon(results.auth.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{results.auth.message}</p>
                  {getStatusBadge(results.auth.success)}
                  {results.auth.details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Ver detalles</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(results.auth.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Storage */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Storage</span>
                  </CardTitle>
                  {getStatusIcon(results.storage.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{results.storage.message}</p>
                  {getStatusBadge(results.storage.success)}
                  {results.storage.details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Ver detalles</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(results.storage.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Base de Datos */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Base de Datos</span>
                  </CardTitle>
                  {getStatusIcon(results.database.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{results.database.message}</p>
                  {getStatusBadge(results.database.success)}
                  {results.database.details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Ver detalles</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(results.database.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enlaces útiles */}
      <Card>
        <CardHeader>
          <CardTitle>Enlaces Útiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://supabase.com/dashboard/project/kcoqztwcdqjtvypgbbdo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Dashboard de Supabase</span>
            </a>
            
            <a 
              href="https://supabase.com/dashboard/project/kcoqztwcdqjtvypgbbdo/sql" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>SQL Editor</span>
            </a>
            
            <a 
              href="https://supabase.com/dashboard/project/kcoqztwcdqjtvypgbbdo/storage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Storage</span>
            </a>
            
            <a 
              href="https://supabase.com/dashboard/project/kcoqztwcdqjtvypgbbdo/auth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Authentication</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 