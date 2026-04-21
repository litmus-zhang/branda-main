import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, Globe, PenTool, Star, Check, LogIn } from 'lucide-react';
import { Footer } from "@branda/ui/components/footer"
import { Button } from "@branda/ui/components/button";
import { Input } from "@branda/ui/components/input";
import { Textarea } from "@branda/ui/components/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@branda/ui/components/card";
import { Badge } from "@branda/ui/components/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@branda/ui/components/carousel";
import { cn } from "@branda/ui/lib/utils";
import { Logo } from '@branda/ui/components/logo';
import Link from 'next/link';
import { PRICING_TIERS, TESTIMONIALS } from 'stores/consts';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessGenerateSchema, type BusinessGenerateValues } from "@/lib/schemas";


interface LandingPageProps {
  onGenerate: (data: { niche: string; businessName: string; details: string; country: string }) => void;
  error: string | null;
}



export const LandingPage: React.FC<LandingPageProps> = ({ onGenerate, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessGenerateValues>({
    resolver: zodResolver(businessGenerateSchema),
    defaultValues: {
      niche: '',
      businessName: '',
      details: '',
      country: ''
    }
  });

  const onSubmit = (data: BusinessGenerateValues) => {
    onGenerate({
      ...data,
      businessName: data.businessName || ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 z-10 sticky top-0 shadow-sm">
        <Logo />
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#pricing" className="hover:text-primary-600">Pricing</a>
            <a href="#testimonials" className="hover:text-primary-600">Testimonials</a>
          </nav>
          <Link href="/auth/sign-in">
            <Button>
              <LogIn />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-3xl mx-auto md:mx-0 z-10 bg-white">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6 w-fit animate-fade-in-up">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Business Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Launch your dream business <span className="text-primary-600">in seconds.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            From brand identity and marketing strategy to operational systems.
            Tell us about your idea, and Branda will build your entire business toolkit instantly.
          </p>

          {/* Form */}
          <Card className="shadow-xl border-slate-100 p-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Business Niche</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        {...register("niche")}
                        placeholder="e.g. Coffee Shop, SaaS..."
                        className={cn("pl-9", errors.niche && "border-red-500 focus-visible:ring-red-500")}
                      />
                    </div>
                    {errors.niche && <p className="text-xs text-red-500">{errors.niche.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium ">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        {...register("country")}
                        placeholder="e.g. USA, UK..."
                        className={cn("pl-9", errors.country && "border-red-500 focus-visible:ring-red-500")}
                      />
                    </div>
                    {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium ">Business Name (Optional)</label>
                  <div className="relative">
                    <PenTool className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      {...register("businessName")}
                      placeholder="Have a name in mind?"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium ">Key Details</label>
                  <Textarea
                    {...register("details")}
                    rows={3}
                    placeholder="Describe your unique value proposition, target audience, or specific requirements..."
                    className={cn(errors.details && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.details && <p className="text-xs text-red-500">{errors.details.message}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                // disabled={ }
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate My Business
                </Button>
              </form>
            </CardContent>
          </Card>

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
            <Carousel className="w-full">
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

