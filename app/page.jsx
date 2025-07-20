import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData } from "@/data/landing";
import Link from "next/link";
import { ArrowRight, BarChart3, Receipt, PieChart, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-title mb-4">
              Simple & Smart Finance Management
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Track your finances with ease using PocketSavvy's core features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold gradient-title mb-4">
              Ready to Start Managing Your Finances?
            </h2>
            <p className="text-white/70 mb-8">
              Join PocketSavvy and take control of your financial journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Add Transaction
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
