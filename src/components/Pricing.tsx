import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 'Gratis',
    description: 'Perfect para empezar tu primera comunidad',
    features: [
      'Hasta 100 miembros',
      'Feed social básico',
      '3 cursos incluidos',
      'Analytics básicos',
      'Soporte por email'
    ],
    cta: 'Comenzar Gratis',
    popular: false
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$49',
    period: '/mes',
    description: 'Para creadores que quieren hacer crecer su audiencia',
    features: [
      'Miembros ilimitados',
      'Feed social avanzado',
      'Cursos ilimitados',
      'Live streaming',
      'Analytics profundos',
      'Branding personalizable',
      'Monetización completa',
      'Soporte prioritario'
    ],
    cta: 'Comenzar Prueba Gratuita',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Rocket,
    price: '$149',
    period: '/mes',
    description: 'Para organizaciones y creadores establecidos',
    features: [
      'Todo de Pro incluido',
      'White-label completo',
      'API personalizada',
      'Integraciones avanzadas',
      'Manager dedicado',
      'SLA garantizado',
      'Onboarding personalizado',
      'Soporte 24/7'
    ],
    cta: 'Contactar Ventas',
    popular: false
  }
];

export function Pricing() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-brand-muted rounded-full text-sm font-medium text-brand mb-6">
            <Crown className="w-4 h-4 mr-2" />
            Planes y Precios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Elige el plan perfecto
            <span className="text-brand-gradient block">para tu comunidad</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comienza gratis y escala conforme crece tu audiencia. 
            Todos los planes incluyen 14 días de prueba gratuita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-6 ${
                plan.popular 
                  ? 'border-2 border-brand shadow-brand scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-brand text-brand-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Más Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-brand text-brand-foreground' : 'bg-brand-muted text-brand'
                }`}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-brand mb-2">
                  {plan.price}
                  {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-brand mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'btn-brand' 
                        : 'hover:bg-brand-muted hover:text-brand transition-smooth'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas algo diferente? Contáctanos para un plan personalizado.
          </p>
          <Button variant="ghost" className="hover:bg-brand-muted hover:text-brand transition-smooth">
            Hablar con Ventas
          </Button>
        </div>
      </div>
    </section>
  );
}