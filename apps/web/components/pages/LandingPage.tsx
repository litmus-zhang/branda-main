import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, Globe, PenTool, Star, Check, Facebook, Twitter, Instagram, Linkedin, LogIn } from 'lucide-react';

import { Button } from "@branda/ui/components/button";
import { Input } from "@branda/ui/components/input";
import { Textarea } from "@branda/ui/components/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@branda/ui/components/card";
import { Badge } from "@branda/ui/components/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@branda/ui/components/carousel";
import { cn } from "@branda/ui/lib/utils";
import { Logo } from '@branda/ui/components/logo';
import Link from 'next/link';


interface LandingPageProps {
  onGenerate: (data: { niche: string; businessName: string; details: string; country: string }) => void;
  error: string | null;
}

const TESTIMONIALS = [
  { name: "John B.", role: "Founder, EcoWear", text: "Branda saved me weeks of planning. I went from idea to full brand strategy in 2 minutes.", initials: "JB", color: "bg-indigo-100 text-indigo-600" },
  { name: "Sarah L.", role: "CEO, TechFlow", text: "The marketing strategy generated was spot on. We launched our campaign the next day.", initials: "SL", color: "bg-emerald-100 text-emerald-600" },
  { name: "Mike T.", role: "Owner, BrewHaven", text: "I didn't know where to start with SOPs. Branda built my entire operations manual.", initials: "MT", color: "bg-amber-100 text-amber-600" },
  { name: "Elena R.", role: "Freelance Designer", text: "The logo concepts gave me a perfect starting point. Incredible AI tool.", initials: "ER", color: "bg-pink-100 text-pink-600" },
  { name: "David K.", role: "Founder, RapidSaaS", text: "It's like having a co-founder who works 24/7. Highly recommended.", initials: "DK", color: "bg-blue-100 text-blue-600" },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for testing your business idea.",
    features: ["Brand Identity Generator", "Logo Concepts & SVG", "Social Media Assets", "Basic Brand Guide"],
    buttonText: "Get Started",
    highlight: false
  },
  {
    name: "Starter",
    price: "$11.99",
    period: "per month",
    description: "For solopreneurs ready to launch.",
    features: ["Everything in Free", "Marketing Strategy", "Content Ideas", "Basic Systems & SOPs", "Email Support"],
    buttonText: "Choose Starter",
    highlight: false
  },
  {
    name: "Growth",
    price: "$24.99",
    period: "per month",
    description: "Scale your operations and sales.",
    features: ["Everything in Starter", "Full CRM & Pipeline", "Advanced Systems", "Integrations", "Priority Support"],
    buttonText: "Choose Growth",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "$59.99",
    period: "per month",
    description: "For agencies and large teams.",
    features: ["Everything in Growth", "Unlimited Workspaces", "Team Collaboration", "White Labeling", "Dedicated Account Manager"],
    buttonText: "Contact Sales",
    highlight: false
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGenerate, error }) => {
  const [formData, setFormData] = useState({
    niche: '',
    businessName: '',
    details: '',
    country: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Business Niche</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        required
                        name="niche"
                        value={formData.niche}
                        onChange={handleChange}
                        placeholder="e.g. Coffee Shop, SaaS..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                      <Input
                        required
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. USA, UK..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Business Name (Optional)</label>
                  <div className="relative">
                    <PenTool className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Have a name in mind?"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Key Details</label>
                  <Textarea
                    required
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your unique value proposition, target audience, or specific requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
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
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Logo />
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering entrepreneurs to build, launch, and scale their dream businesses with the power of Artificial Intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Branda Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};