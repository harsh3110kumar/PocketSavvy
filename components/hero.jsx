"use client";

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { ArrowRight, CreditCard, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-28 h-28 bg-blue-400/15 rounded-full blur-2xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
          {/* Left Column - Split Layout */}
          <div className="space-y-8">
            {/* Top: Description Text */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                Track, manage, and understand your financial activities with ease. Log income and expenses, categorize transactions, and view smart summaries of your spending habits with interactive graphs and AI-powered receipt scanning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/transaction/create">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                  >
                    Add Transaction
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom: Illustration */}
            <div className="relative">
              <div className="hero-image-wrapper w-full max-w-sm">
                <div ref={imageRef} className="hero-image animate-float">
                  <div className="relative">
                    {/* Main Dashboard Image */}
                    <Image
                      src="/banner.png"
                      alt="PocketSavvy Dashboard"
                      width={350}
                      height={250}
                      className="rounded-2xl shadow-2xl border border-white/10 mx-auto card-hover w-full h-auto"
                      priority
                    />
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Title + Floating Elements */}
          <div className="flex items-center justify-center relative">
            <div className="text-center lg:text-left relative z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-title leading-tight">
                PocketSavvy
              </h1>
              <p className="text-xl md:text-2xl text-white/70 mt-4 font-light">
                Personal Finance Assistant
              </p>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Credit Card - Top Right */}
              <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '0s' }}>
                <div className="w-16 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg border border-white/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Dollar Coin - Top Left */}
              <div className="absolute top-16 left-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 bg-yellow-500 rounded-full shadow-lg border border-yellow-400/30 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white font-bold" />
                </div>
              </div>

              {/* Trending Chart - Bottom Right */}
              <div className="absolute bottom-20 right-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg border border-white/20 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>

              {/* Pie Chart - Bottom Left */}
              <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '3s' }}>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg shadow-lg border border-white/20 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Small Floating Dots */}
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
