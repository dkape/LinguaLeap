'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Learning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Learn Languages</span>
                <br />
                <span className="text-foreground">The Fun Way</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-md">
                Master new languages with interactive exercises, AI-powered lessons, and a community of learners just like you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg"
                className="gap-2 transition-all duration-300 hover:translate-x-1 active:scale-95"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="transition-all duration-300 hover:bg-muted active:scale-95"
              >
                Learn More
              </Button>
            </div>

            {/* Stats or Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { label: 'Languages', value: '25+' },
                { label: 'Lessons', value: '1000+' },
                { label: 'Learners', value: '50K+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center animate-slide-up animation-delay-200">
            {/* Decorative SVG background with animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <svg
                className="w-full h-full max-w-md"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#grad)" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
                <circle cx="100" cy="100" r="75" fill="none" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.3" />
                <circle cx="100" cy="100" r="55" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.2" />
              </svg>
            </div>

            {/* Icon in center */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-32 h-32 rounded-3xl bg-card border border-border shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <img 
                  src="/icon.svg" 
                  alt="LinguaLeap Icon" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
