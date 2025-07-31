import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  BookOpen, 
  Zap,
  Star,
  Play,
  ChevronRight
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: BookOpen,
      title: "Cursos Especializados",
      description: "Aprende NoCode e IA con expertos del sector"
    },
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Conecta con otros desarrolladores y emprendedores"
    },
    {
      icon: Zap,
      title: "Proyectos Prácticos",
      description: "Construye aplicaciones reales desde el primer día"
    },
    {
      icon: Star,
      title: "Certificaciones",
      description: "Obtén certificados reconocidos en la industria"
    }
  ];

  const testimonials = [
    {
      name: "María García",
      role: "Desarrolladora NoCode",
      content: "EduCommunity transformó mi carrera. Ahora puedo crear aplicaciones sin código.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
    },
    {
      name: "Carlos Rodríguez",
      role: "Emprendedor",
      content: "La comunidad es increíble. Siempre encuentro ayuda cuando la necesito.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Ana López",
      role: "Product Manager",
      content: "Los cursos de IA me ayudaron a automatizar procesos en mi empresa.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center transform rotate-3">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight">EduCommunity</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-black font-bold hover:bg-black hover:text-white px-3 py-2 transition-all transform hover:-translate-y-1">CARACTERÍSTICAS</a>
              <a href="#testimonials" className="text-black font-bold hover:bg-black hover:text-white px-3 py-2 transition-all transform hover:-translate-y-1">TESTIMONIOS</a>
              <a href="#pricing" className="text-black font-bold hover:bg-black hover:text-white px-3 py-2 transition-all transform hover:-translate-y-1">PRECIOS</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/auth" 
                className="text-black font-bold hover:underline decoration-4 underline-offset-4"
              >
                INICIAR SESIÓN
              </Link>
              <Link 
                to="/auth" 
                className="bg-black text-white px-6 py-3 font-black uppercase tracking-wide border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                REGISTRARSE
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-black/5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase tracking-wider mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              ⚡ PLATAFORMA #1
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-black mb-8 leading-none uppercase tracking-tight">
              APRENDE<br/>
              <span className="bg-black text-white px-4 inline-block transform -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">NOCODE</span><br/>
              E <span className="bg-white text-black border-4 border-black px-4 inline-block transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">IA</span>
            </h1>
            
            <p className="text-xl font-bold text-black mb-12 max-w-3xl mx-auto uppercase tracking-wide">
              ÚNETE A LA COMUNIDAD MÁS GRANDE DE DESARROLLADORES NOCODE E IA.<br/>
              CONSTRUYE APLICACIONES SIN CÓDIGO Y AUTOMATIZA PROCESOS.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/auth" 
                className="bg-black text-white px-12 py-6 font-black text-xl uppercase tracking-wide border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all inline-flex items-center gap-3"
              >
                COMENZAR GRATIS
                <ArrowRight className="w-6 h-6" />
              </Link>
              <button className="bg-white text-black px-12 py-6 font-black text-xl uppercase tracking-wide border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all inline-flex items-center gap-3">
                <Play className="w-6 h-6" />
                VER DEMO
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black text-white relative">
        <div className="absolute inset-0 bg-white opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m20 20 20 0 0-20-20 0z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-white text-black px-6 py-2 font-black uppercase tracking-wider mb-8 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform -rotate-1">
              💪 CARACTERÍSTICAS
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
              ¿POR QUÉ ELEGIR<br/>
              <span className="bg-white text-black px-4 inline-block transform rotate-2 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">EDUCOMMUNITY?</span>
            </h2>
            <p className="text-xl font-bold text-white max-w-2xl mx-auto uppercase tracking-wide">
              OFRECEMOS LA MEJOR EXPERIENCIA DE APRENDIZAJE CON TECNOLOGÍA DE VANGUARDIA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white text-black p-8 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-center hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform hover:rotate-1"
              >
                <div className="w-16 h-16 bg-black text-white border-4 border-black flex items-center justify-center mx-auto mb-6 transform rotate-3">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-black font-bold">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-black opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase tracking-wider mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              🚀 ÚLTIMA OPORTUNIDAD
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-black mb-8 uppercase tracking-tight">
              ¿LISTO PARA<br/>
              <span className="bg-black text-white px-4 inline-block transform -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">TRANSFORMAR</span><br/>
              TU CARRERA?
            </h2>
            
            <p className="text-xl font-bold text-black mb-12 max-w-2xl mx-auto uppercase tracking-wide">
              ÚNETE A MILES DE DESARROLLADORES QUE YA ESTÁN CONSTRUYENDO EL FUTURO
            </p>
            
            <Link 
              to="/auth" 
              className="bg-black text-white px-16 py-8 font-black text-2xl uppercase tracking-wide border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all inline-flex items-center gap-4 transform hover:rotate-1"
            >
              COMENZAR AHORA
              <ChevronRight className="w-8 h-8" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-black text-white relative">
        <div className="absolute inset-0 bg-white opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='15,0 30,30 0,30'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-white text-black px-6 py-2 font-black uppercase tracking-wider mb-8 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform -rotate-1">
              ⭐ TESTIMONIOS
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
              LO QUE DICEN<br/>
              <span className="bg-white text-black px-4 inline-block transform rotate-2 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">NUESTROS</span><br/>
              ESTUDIANTES
            </h2>
            
            <p className="text-xl font-bold text-white max-w-2xl mx-auto uppercase tracking-wide">
              DESCUBRE CÓMO EDUCOMMUNITY ESTÁ TRANSFORMANDO CARRERAS
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white text-black p-8 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform hover:rotate-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 object-cover border-4 border-black transform rotate-3"
                  />
                  <div>
                    <h4 className="font-black text-black uppercase tracking-wide">{testimonial.name}</h4>
                    <p className="text-sm font-bold text-black">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-black font-bold text-lg">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center transform rotate-3">
                  <span className="text-white font-black text-xl">E</span>
                </div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">EduCommunity</h3>
              </div>
              <p className="text-black font-bold uppercase tracking-wide">
                LA PLATAFORMA LÍDER EN APRENDIZAJE DE NOCODE E IA
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-black mb-6 uppercase tracking-wide text-lg">PRODUCTO</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">CURSOS</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">COMUNIDAD</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">CERTIFICACIONES</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-black mb-6 uppercase tracking-wide text-lg">RECURSOS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">BLOG</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">DOCUMENTACIÓN</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">SOPORTE</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-black mb-6 uppercase tracking-wide text-lg">EMPRESA</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">ACERCA DE</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">CONTACTO</a></li>
                <li><a href="#" className="text-black font-bold hover:bg-black hover:text-white px-2 py-1 transition-all transform hover:-translate-y-1">PRIVACIDAD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-4 border-black mt-12 pt-8 text-center">
            <p className="text-black font-black uppercase tracking-wider">&copy; 2024 EDUCOMMUNITY. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
