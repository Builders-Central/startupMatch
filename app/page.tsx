"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Users, Lock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Discover Your Next{" "}
          <span className="text-primary">Startup Opportunity</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with innovative startup ideas and find your perfect match in
          the world of entrepreneurship.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/auth")}
            className="text-lg px-8 py-6 rounded-full"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={() => router.push("/app")}
            variant="outline"
            className="text-lg px-8 py-6 rounded-full"
          >
            Browse Ideas
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Discover Innovative Ideas
            </h3>
            <p className="text-muted-foreground">
              Browse through carefully curated startup ideas across various
              industries and sectors.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Connect with Founders
            </h3>
            <p className="text-muted-foreground">
              Engage with idea creators through comments and direct
              interactions.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-muted-foreground">
              Your ideas and interactions are protected with enterprise-grade
              security.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our community of innovators and entrepreneurs today. Your next
          big opportunity awaits.
        </p>
        <Button
          onClick={() => router.push("/auth")}
          className="text-lg px-8 py-6 rounded-full"
        >
          Sign Up Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
