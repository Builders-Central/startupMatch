"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase";
import Comments from "@/components/Comments"
import ShareIdea from "@/components/ShareIdea"

interface StartupIdea {
  id: string;
  user_id: string;
  author_email: string;
  title: string;
  description: string;
  market_size: string;
  market_potential: string;
  technical_requirements: string[];
  financial_requirement: string;
  timeline: string;
  category: string;
  challenges: string[];
  metrics: {
    likes: number;
    passes: number;
    shares: number;
  };
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("startup_ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setIdeas(data);
      }
    } catch (error: any) {
      console.error('Error loading ideas:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentIdea = ideas[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    setDirection(direction);
    
    if (direction === "right" && currentIdea) {
      try {
        await supabase.rpc('increment_likes', { idea_id: currentIdea.id });
      } catch (error) {
        console.error('Failed to update likes:', error);
      }
    }

    if (direction === "left" && currentIdea) {
      try {
        await supabase.rpc('increment_passes', { idea_id: currentIdea.id });
      } catch (error) {
        console.error('Failed to update passes:', error);
      }
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ideas.length);
      setDirection(null);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <p>Loading ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No ideas available</p>
          <Button onClick={() => router.push("/submit")}>Submit an Idea</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold">StartupMatch</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push("/submit")}
              size="sm"
              className="text-sm sm:text-base"
            >
              Submit Idea
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/profile")}
              size="sm"
              className="text-sm sm:text-base"
            >
              My Profile
            </Button>
          </div>
        </div>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Discover your next startup idea
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentIdea && (
              <motion.div
                key={currentIdea.id}
                initial={{ x: 0, opacity: 1 }}
                animate={{
                  x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                  opacity: direction ? 0 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 sm:p-6 shadow-lg">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold mb-2">{currentIdea.title}</h2>
                          <p className="text-sm sm:text-base text-muted-foreground">{currentIdea.description}</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Posted by {currentIdea.author_email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(currentIdea.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-1">Market Size</h3>
                        <p className="text-sm text-muted-foreground">{currentIdea.market_size}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-1">Timeline</h3>
                        <p className="text-sm text-muted-foreground">{currentIdea.timeline}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">Technical Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentIdea.technical_requirements.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-secondary rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">Key Challenges</h3>
                      <ul className="list-disc pl-4 text-sm text-muted-foreground">
                        {currentIdea.challenges.map((challenge) => (
                          <li key={challenge}>{challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleSwipe("left")}
                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0"
                      >
                        <ThumbsDown className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setShowComments(!showComments)}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setShowShare(true)}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => handleSwipe("right")}
                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0"
                      >
                        <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </div>

                    {showComments && (
                      <div className="mt-4 border-t pt-4">
                        <h3 className="text-sm font-semibold mb-2">Comments</h3>
                        <Comments ideaId={currentIdea.id} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
            <p>Swipe right to save ideas you like</p>
            <p>Swipe left to pass on ideas that don't interest you</p>
          </div>
        </div>
      </main>

      <ShareIdea 
        idea={currentIdea}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}