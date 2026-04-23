import React, { } from 'react';
import { Sparkles, Star, Check, ChevronRight } from 'lucide-react';
import { Footer } from "@branda/ui/components/footer"
import { Header } from "@branda/ui/components/header"
import { Button } from "@branda/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@branda/ui/components/card";
import { Badge } from "@branda/ui/components/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@branda/ui/components/carousel";
import { cn } from "@branda/ui/lib/utils";
import Link from 'next/link';
import { PRICING_TIERS, TESTIMONIALS } from 'stores/consts';


export const LandingPage: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row min-h-[calc(100vh-73px)] overflow-hidden">
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-4xl mx-auto md:mx-0 z-10 bg-white">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 w-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering the next generation of founders
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Your entire business, <br />
            <span className="text-primary">Architected by AI.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            Stop juggling spreadsheets and guessing your next move. Branda builds your brand identity, marketing strategy, and operational SOPs in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <Button size="lg" className="" asChild>
              <Link href="/auth/sign-up">
                Start Building Free
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="" asChild>
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-20 duration-700 delay-400">
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">30s</p>
              <p className="text-sm text-slate-500">Generation time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1">2.4k+</p>
              <p className="text-sm text-slate-500">Businesses launched</p>
            </div>
            <div className="hidden md:block">
              <p className="text-3xl font-bold text-slate-900 mb-1">99%</p>
              <p className="text-sm text-slate-500">Positive feedback</p>
            </div>
          </div>
        </div>

        {/* Visual/Testimonial Carousel Section */}
        <div id="testimonials" className="hidden md:flex md:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center min-h-[800px] md:min-h-0">
          {/* Artistic Background Grid */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-slate-300"></div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-transparent to-slate-50/50 z-10"></div>

          <div className="relative z-20 w-full max-w-lg px-6">
            <Carousel
              setApi={setApi}
              opts={{ loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-white/80 backdrop-blur-md border-slate-100 shadow-xl min-h-[220px] flex flex-col justify-center transform rotate-1 hover:rotate-0 transition-transform duration-500 m-2">
                      <CardContent className="p-8 relative">
                        <div className="absolute -top-5 -left-2 text-6xl text-primary-200 opacity-50 font-serif">"</div>
                        <div className="flex items-center mb-4">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 text-lg", testimonial.color)}>
                            {testimonial.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">{testimonial.name}</p>
                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 mb-3">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-700 italic text-lg leading-relaxed">
                          {testimonial.text}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-slate-500">
              Choose the plan that's right for your business stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRICING_TIERS.map((tier, index) => (
              <Card
                key={index}
                className={cn(
                  "flex flex-col relative",
                  tier.highlight ? "border-primary-500 shadow-xl scale-105 z-10 bg-white" : "border-slate-200 bg-slate-50"
                )}
              >
                {tier.highlight && (
                  <Badge className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                    <span className="ml-1 text-slate-500 text-sm">{tier.price !== '$0' ? '/mo' : ''}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-primary-500 mr-2 shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={tier.highlight ? "default" : "outline"}
                    className="w-full py-6 font-bold"
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

