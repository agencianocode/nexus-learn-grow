import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function StorageDebug() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStorage = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      console.log('🔍 Iniciando test de Storage...');
      
      // Test 1: listBuckets
      console.log('📊 Probando listBuckets...');
      const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('📊 Resultado listBuckets:', { bucketsData, bucketsError });
      
      // Test 2: Probar cada bucket individualmente
      const bucketTests = await Promise.all([
        testBucket('course-media'),
        testBucket('avatars'),
        testBucket('resources')
      ]);
      
      const result = {
        listBuckets: { data: bucketsData, error: bucketsError },
        bucketTests,
        timestamp: new Date().toISOString()
      };
      
      setResults(result);
      console.log('📊 Resultado completo:', result);
      
    } catch (error) {
      console.error('💥 Error en test:', error);
      setResults({ error: error.message, timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const testBucket = async (bucketName: string) => {
    try {
      console.log(`🔍 Probando bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
      console.log(`📊 Resultado ${bucketName}:`, { data, error });
      return { name: bucketName, accessible: !error, data, error };
    } catch (error) {
      console.log(`❌ Error en ${bucketName}:`, error);
      return { name: bucketName, accessible: false, error };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Debug de Storage</h1>
        <p className="text-muted-foreground">
          Prueba detallada del sistema de Storage de Supabase
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejecutar Test de Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testStorage} disabled={loading}>
            {loading ? 'Ejecutando...' : 'Ejecutar Test'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">listBuckets:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.listBuckets, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tests de Buckets Individuales:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.bucketTests, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Timestamp:</h3>
                <p className="text-sm">{results.timestamp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 