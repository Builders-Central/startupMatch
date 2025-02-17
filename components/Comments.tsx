"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";

interface Comment {
  id: string;
  content: string;
  user_email: string;
  created_at: string;
}

export default function Comments({ ideaId }: { ideaId: string }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch comments when component mounts or ideaId changes
  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("idea_id", ideaId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaId,
          content: comment,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Add new comment to the list
      setComments([data, ...comments]);
      setComment("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Display comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-3 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium">{comment.user_email}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
