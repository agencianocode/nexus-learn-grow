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
    <div className="home-theme min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">EduCommunity</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors">Características</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-neutral-900 transition-colors">Testimonios</a>
              <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors">Precios</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/auth" 
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/auth" 
                className="btn-home px-6 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-neutral">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Aprende <span className="text-gradient-brand">NoCode</span> e <span className="text-gradient-brand">IA</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Únete a la comunidad más grande de desarrolladores NoCode e IA. 
              Construye aplicaciones sin código y automatiza procesos con inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="btn-home px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:scale-105 transition-all duration-200"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border-2 border-neutral-300 text-neutral-700 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition-all duration-200 inline-flex items-center gap-2">
                <Play className="w-5 h-5" />
                Ver Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              ¿Por qué elegir EduCommunity?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de aprendizaje con tecnología de vanguardia
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
                className="card-home p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-brand">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para transformar tu carrera?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Únete a miles de desarrolladores que ya están construyendo el futuro
            </p>
            <Link 
              to="/auth" 
              className="bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:bg-neutral-50 transition-all duration-200"
            >
              Comenzar Ahora
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Descubre cómo EduCommunity está transformando carreras
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
                className="card-home p-6 rounded-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-700">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <h3 className="text-xl font-bold">EduCommunity</h3>
              </div>
              <p className="text-neutral-400">
                La plataforma líder en aprendizaje de NoCode e IA
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Cursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificaciones</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 EduCommunity. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
