"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/utils/supabase"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  user_email: string
  created_at: string
}

interface CommentsProps {
  ideaId: string
}

export default function Comments({ ideaId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ideaId) return;
    loadComments()
  }, [ideaId])

  const loadComments = async () => {
    try {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ideaId)) {
        console.warn('Invalid UUID format:', ideaId);
        return;
      }

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("idea_id", ideaId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error: any) {
      setError("Failed to load comments")
      console.error(error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ideaId)) {
        throw new Error('Invalid idea ID format');
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("comments").insert({
        idea_id: ideaId,
        user_id: user.id,
        user_email: user.email,
        content: newComment
      })

      if (error) throw error
      setNewComment("")
      loadComments()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!ideaId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitComment} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">{comment.user_email}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 