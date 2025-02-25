"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MessageCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase";
import Comments from "@/components/Comments";
import ShareIdea from "@/components/ShareIdea";
import { useSwipeable } from "react-swipeable";
import { useSession } from "next-auth/react";
import HeartAnimation from "@/components/HeartAnimation";

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
  const [showHeart, setShowHeart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const { data: session } = useSession();

  const loadIdeas = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!session?.user?.email) {
        router.push("/auth");
        return;
      }

      // First, get all viewed idea IDs for the user
      const { data: viewedIdeasData, error: viewedIdeasError } = await supabase
        .from("viewed_ideas")
        .select("idea_id")
        .eq("user_email", session.user.email);

      if (viewedIdeasError) {
        console.error(viewedIdeasError.message);
        setIsLoading(false);
        return;
      }

      const viewedIdeaIds = viewedIdeasData?.map((idea) => idea.idea_id) || [];

      // Get all ideas except those created by the current user
      const { data: allIdeas, error: allIdeasError } = await supabase
        .from("startup_ideas")
        .select("*")
        .neq("author_email", session.user.email) // Filter out user's own ideas
        .order("created_at", { ascending: false });

      if (allIdeasError) {
        console.error(allIdeasError.message);
        setIsLoading(false);
        return;
      }

      // Filter out ideas that the user has already viewed
      const unseenIdeas = allIdeas.filter(
        (idea) => !viewedIdeaIds.includes(idea.id)
      );

      if (unseenIdeas.length === 0) {
        setIdeas([]);
      } else {
        setIdeas(unseenIdeas);
        setCurrentIndex(0);
      }
    } catch (error: any) {
      console.error("Error loading ideas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, session]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const currentIdea = ideas[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    setDirection(direction);

    if (currentIdea && session?.user?.email) {
      try {
        // Show heart animation immediately for right swipes (likes)
        if (direction === "right") {
          setShowHeart(true);
          setTimeout(() => setShowHeart(false), 1000);
        }

        // Record that the user has viewed this idea
        await supabase.from("viewed_ideas").insert([
          {
            idea_id: currentIdea.id,
            user_email: session.user.email,
            action: direction, // optionally store whether they liked or passed
          },
        ]);

        if (direction === "right") {
          // Check if the user has already liked the idea
          const { data: existingLike } = await supabase
            .from("likes")
            .select("*")
            .eq("idea_id", currentIdea.id)
            .eq("user_email", session.user.email)
            .single();

          if (!existingLike) {
            await supabase.rpc("increment_likes", { idea_id: currentIdea.id });
            await supabase
              .from("likes")
              .insert([
                { idea_id: currentIdea.id, user_email: session.user.email },
              ]);
          }
        } else if (direction === "left") {
          await supabase.rpc("increment_passes", { idea_id: currentIdea.id });
        }

        // If this was the last idea, show the message box
        if (currentIndex === ideas.length - 1) {
          setShowMessage(true);
          return;
        }

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % ideas.length);
          setDirection(null);
        }, 500);
      } catch (error) {
        console.error("Failed to record action:", error);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventScrollOnSwipe: true,
    trackMouse: false,
    delta: 50,
    swipeDuration: 500,
  });

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
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
        <div className="bg-card border rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center">
              <RefreshCw className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">All caught up!</h2>

          <p className="text-muted-foreground mb-6">
            You've seen all available ideas. Check back later for new
            submissions or create your own!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/submit")}
              className="w-full sm:w-auto"
              size="lg"
            >
              Submit an Idea
            </Button>
            <Button
              onClick={() => loadIdeas()}
              variant="outline"
              className="w-full sm:w-auto"
              size="lg"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Message Box */}
      {showMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="max-w-md mx-auto bg-card border rounded-lg shadow-lg p-4 flex flex-col items-center transition-all">
            <div className="mb-2 flex justify-center">
              <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-primary animate-spin-slow" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">All caught up!</h3>
            <p className="text-muted-foreground text-center mb-3">
              You've seen all available ideas. Check back later for new
              submissions.
            </p>
            <Button
              onClick={() => setShowMessage(false)}
              variant="outline"
              size="sm"
              className="px-6 transition-all duration-200 hover:scale-105"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <HeartAnimation isVisible={showHeart} />

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary">
        {/* <header className="max-w-7xl mx-auto px-4 py-6">
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
        </header> */}

        <main className="flex-grow flex items-center justify-center py-4 sm:py-8">
          <div className="w-full max-w-2xl mx-auto px-4">
            <AnimatePresence mode="wait">
              {currentIdea && (
                <motion.div
                  key={currentIdea.id}
                  initial={{ x: 0, opacity: 1 }}
                  animate={{
                    x:
                      direction === "left"
                        ? -300
                        : direction === "right"
                        ? 300
                        : 0,
                    opacity: direction ? 0 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 sm:p-6 shadow-lg relative">
                    <div className="space-y-4 sm:space-y-6">
                      <div {...handlers} className="relative">
                        <div
                          className={`absolute inset-0 bg-green-500/10 transition-opacity duration-200 rounded-lg ${
                            direction === "right" ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 bg-red-500/10 transition-opacity duration-200 rounded-lg ${
                            direction === "left" ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        <div className="relative z-20">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                                {currentIdea.title}
                              </h2>
                              <p className="text-sm sm:text-base text-muted-foreground">
                                {currentIdea.description}
                              </p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Posted by {currentIdea.author_email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  currentIdea.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-semibold mb-1">
                                Market Size
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {currentIdea.market_size}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold mb-1">
                                Timeline
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {currentIdea.timeline}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold mb-2">
                              Technical Requirements
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {currentIdea.technical_requirements.map(
                                (tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-secondary rounded-full text-xs"
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold mb-2">
                              Key Challenges
                            </h3>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground">
                              {currentIdea.challenges.map((challenge) => (
                                <li key={challenge}>{challenge}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 relative z-30">
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
                        <div className="mt-4 border-t pt-4 relative z-30">
                          <h3 className="text-sm font-semibold mb-2">
                            Comments
                          </h3>
                          <Comments ideaId={currentIdea.id} />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
              <p>
                Swipe right or tap <ThumbsUp className="inline h-4 w-4" /> to
                save ideas you like
              </p>
              <p>
                Swipe left or tap <ThumbsDown className="inline h-4 w-4" /> to
                pass on ideas that don&apos;t interest you
              </p>
            </div>
          </div>
        </main>

        <ShareIdea
          idea={currentIdea}
          isOpen={showShare}
          onClose={() => setShowShare(false)}
        />

        {/* Floating Action Button */}
        <Button
          onClick={() => router.push("/submit")}
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
