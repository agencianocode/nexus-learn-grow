import { supabase } from '@/integrations/supabase/client';

export interface SupabaseTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export class SupabaseTester {
  static async testConnection(): Promise<SupabaseTestResult> {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        return {
          success: false,
          message: 'Error de conexión a Supabase',
          details: error
        };
      }
      
      return {
        success: true,
        message: '✅ Conexión a Supabase exitosa'
      };
    } catch (error) {
      return {
        success: false,
        message: '❌ Error de conexión',
        details: error
      };
    }
  }

  static async testAuth(): Promise<SupabaseTestResult> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          message: 'Error en autenticación',
          details: error
        };
      }
      
      return {
        success: true,
        message: session ? '✅ Usuario autenticado' : 'ℹ️ Usuario no autenticado',
        details: { hasSession: !!session }
      };
    } catch (error) {
      return {
        success: false,
        message: '❌ Error en autenticación',
        details: error
      };
    }
  }

  static async testStorage(): Promise<SupabaseTestResult> {
    try {
      console.log('🔍 Iniciando test de Storage...');
      
      // Método 1: listBuckets
      const { data, error } = await supabase.storage.listBuckets();
      
      console.log('📊 Resultado de listBuckets:', { data, error });
      
      // Si hay error O si listBuckets devuelve array vacío, usar método alternativo
      if (error || !data || data.length === 0) {
        console.log('🔄 listBuckets no funcionó, usando método alternativo...');
        
        // Método 2: Probar buckets individualmente
        const bucketTests = await Promise.all([
          this.testBucketAccess('course-media'),
          this.testBucketAccess('avatars'),
          this.testBucketAccess('resources')
        ]);
        
        const accessibleBuckets = bucketTests.filter(test => test.accessible).map(test => test.name);
        const requiredBuckets = ['course-media', 'avatars', 'resources'];
        const missingBuckets = requiredBuckets.filter(bucket => !accessibleBuckets.includes(bucket));
        
        console.log('📁 Buckets accesibles:', accessibleBuckets);
        console.log('❌ Buckets faltantes:', missingBuckets);
        
        if (missingBuckets.length > 0) {
          return {
            success: false,
            message: `Buckets faltantes: ${missingBuckets.join(', ')}`,
            details: { 
              buckets: accessibleBuckets, 
              missingBuckets, 
              bucketTests,
              originalError: error,
              listBucketsData: data 
            }
          };
        } else {
          return {
            success: true,
            message: '✅ Storage configurado correctamente',
            details: { buckets: accessibleBuckets, bucketTests }
          };
        }
      }
      
      // Si listBuckets funcionó, usar ese método
      const buckets = data?.map(bucket => bucket.name) || [];
      console.log('📁 Buckets encontrados:', buckets);
      
      const requiredBuckets = ['course-media', 'avatars', 'resources'];
      const missingBuckets = requiredBuckets.filter(bucket => !buckets.includes(bucket));
      
      console.log('🔍 Buckets requeridos:', requiredBuckets);
      console.log('❌ Buckets faltantes:', missingBuckets);
      
      if (missingBuckets.length > 0) {
        return {
          success: false,
          message: `Buckets faltantes: ${missingBuckets.join(', ')}`,
          details: { buckets, missingBuckets, allBuckets: data }
        };
      }
      
      return {
        success: true,
        message: '✅ Storage configurado correctamente',
        details: { buckets, allBuckets: data }
      };
    } catch (error) {
      console.log('💥 Excepción en testStorage:', error);
      return {
        success: false,
        message: '❌ Error en Storage',
        details: error
      };
    }
  }

  // Método auxiliar para probar acceso a buckets individuales
  private static async testBucketAccess(bucketName: string): Promise<{ name: string; accessible: boolean; error?: any }> {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
      return { name: bucketName, accessible: !error, error };
    } catch (error) {
      return { name: bucketName, accessible: false, error };
    }
  }

  static async testDatabaseTables(): Promise<SupabaseTestResult> {
    try {
      // Solo verificar las tablas que sabemos que existen en los tipos
      const testQueries = [
        { table: 'profiles', query: () => supabase.from('profiles').select('count').limit(1) },
        { table: 'communities', query: () => supabase.from('communities').select('count').limit(1) },
        { table: 'community_members', query: () => supabase.from('community_members').select('count').limit(1) },
        { table: 'posts', query: () => supabase.from('posts').select('count').limit(1) },
        { table: 'courses', query: () => supabase.from('courses').select('count').limit(1) },
        { table: 'modules', query: () => supabase.from('modules').select('count').limit(1) },
        { table: 'lessons', query: () => supabase.from('lessons').select('count').limit(1) },
        { table: 'lesson_resources', query: () => supabase.from('lesson_resources').select('count').limit(1) }
      ];
      
      const results = await Promise.all(
        testQueries.map(async ({ table, query }) => {
          try {
            const { error } = await query();
            return { table, exists: !error };
          } catch {
            return { table, exists: false };
          }
        })
      );
      
      const missingTables = results.filter(r => !r.exists).map(r => r.table);
      
      if (missingTables.length > 0) {
        return {
          success: false,
          message: `Tablas faltantes: ${missingTables.join(', ')}`,
          details: { results, missingTables }
        };
      }
      
      return {
        success: true,
        message: '✅ Todas las tablas principales existen',
        details: { tables: testQueries.map(t => t.table) }
      };
    } catch (error) {
      return {
        success: false,
        message: '❌ Error verificando tablas',
        details: error
      };
    }
  }

  static async runFullTest(): Promise<{
    connection: SupabaseTestResult;
    auth: SupabaseTestResult;
    storage: SupabaseTestResult;
    database: SupabaseTestResult;
    overall: boolean;
  }> {
    const connection = await this.testConnection();
    const auth = await this.testAuth();
    const storage = await this.testStorage();
    const database = await this.testDatabaseTables();
    
    const overall = connection.success && storage.success && database.success;
    
    return {
      connection,
      auth,
      storage,
      database,
      overall
    };
  }
}

// Función de utilidad para mostrar resultados en consola
export const logSupabaseTest = async () => {
  console.log('🔍 Iniciando prueba de configuración de Supabase...');
  
  const results = await SupabaseTester.runFullTest();
  
  console.log('\n📊 Resultados de la Prueba:');
  console.log('─'.repeat(50));
  
  console.log(`🔗 Conexión: ${results.connection.message}`);
  console.log(`🔐 Autenticación: ${results.auth.message}`);
  console.log(`📁 Storage: ${results.storage.message}`);
  console.log(`🗄️ Base de Datos: ${results.database.message}`);
  
  console.log('\n' + '─'.repeat(50));
  
  if (results.overall) {
    console.log('✅ ¡Configuración de Supabase correcta!');
  } else {
    console.log('❌ Hay problemas en la configuración de Supabase');
    console.log('\n📋 Detalles:');
    
    if (!results.connection.success) {
      console.log('🔗 Problema de conexión:', results.connection.details);
    }
    if (!results.storage.success) {
      console.log('📁 Problema de storage:', results.storage.details);
    }
    if (!results.database.success) {
      console.log('🗄️ Problema de base de datos:', results.database.details);
    }
  }
  
  return results;
}; 