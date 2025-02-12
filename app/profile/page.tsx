"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, LogOut, MessageCircle } from "lucide-react"
import { supabase } from "@/utils/supabase"

interface Comment {
  id: string
  content: string
  user_email: string
  created_at: string
}

interface StartupIdea {
  id: string
  title: string
  description: string
  market_size: string
  market_potential: string
  technical_requirements: string[]
  financial_requirement: string
  timeline: string
  category: string
  challenges: string[]
  created_at: string
  metrics: {
    likes: number
    passes: number
    shares: number
  }
  comments?: Comment[]
}

export default function Profile() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<StartupIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth")
          return
        }

        setUserEmail(user.email || null)

        // Fetch user's submitted ideas with comments
        const { data: ideasData, error: ideasError } = await supabase
          .from("startup_ideas")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ideasError) throw ideasError

        // Fetch comments for each idea
        const ideasWithComments = await Promise.all(
          (ideasData || []).map(async (idea) => {
            const { data: comments, error: commentsError } = await supabase
              .from("comments")
              .select("*")
              .eq("idea_id", idea.id)
              .order("created_at", { ascending: false })

            if (commentsError) throw commentsError

            return {
              ...idea,
              comments: comments || []
            }
          })
        )

        setIdeas(ideasWithComments)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const handleDelete = async (ideaId: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return

    try {
      const { error } = await supabase
        .from("startup_ideas")
        .delete()
        .eq("id", ideaId)

      if (error) throw error
      setIdeas(ideas.filter(idea => idea.id !== ideaId))
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/auth")
    } catch (error: any) {
      setError(error.message)
    }
  }

  const toggleComments = (ideaId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Submitted Ideas</h2>
            <Button onClick={() => router.push("/submit")}>
              Submit New Idea
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {ideas.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                You haven&apos;t submitted any ideas yet.
              </p>
            </Card>
          ) : (
            ideas.map((idea) => (
              <Card key={idea.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{idea.title}</h3>
                      <p className="text-muted-foreground">{idea.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/edit/${idea.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(idea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Market Size</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.market_size}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Timeline</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.timeline}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Engagement</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.metrics.likes} likes • {idea.metrics.shares} shares • {idea.comments?.length || 0} comments
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Technical Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.technical_requirements.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-secondary rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComments(idea.id)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {expandedComments[idea.id] ? 'Hide Comments' : 'Show Comments'}
                      <span className="text-muted-foreground">({idea.comments?.length || 0})</span>
                    </Button>

                    {expandedComments[idea.id] && idea.comments && (
                      <div className="mt-4 space-y-4">
                        {idea.comments.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No comments yet</p>
                        ) : (
                          idea.comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-3 last:border-0">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium">{comment.user_email}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 