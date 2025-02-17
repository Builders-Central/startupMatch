import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lightbulb, Users, Target } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to StartupMatch
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {session
                ? "Discover and collaborate on innovative startup ideas. Your next big opportunity awaits."
                : "Join our community of entrepreneurs and innovators. Find your next startup idea or co-founder."}
            </p>
            {!session && (
              <div className="space-x-4">
                <Link href="/auth">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Innovative Ideas</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {session
                  ? "Submit and explore curated startup ideas from our community."
                  : "Access a pool of validated startup ideas and opportunities."}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {session
                  ? "Connect with like-minded entrepreneurs and potential co-founders."
                  : "Join a network of entrepreneurs, developers, and innovators."}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Validation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {session
                  ? "Get feedback and validation from experienced entrepreneurs."
                  : "Test and validate your ideas with our community's feedback."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {session ? (
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">
                Ready to Start?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
                Share your startup idea or explore opportunities to collaborate.
              </p>
              <div className="space-x-4">
                <Link href="/submit">
                  <Button size="lg">
                    Submit Your Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg">
                    Explore Ideas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">Why Join Us?</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
                Get access to exclusive startup ideas, connect with potential
                co-founders, and be part of a growing entrepreneurial community.
              </p>
              <Link href="/auth">
                <Button size="lg">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
