"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy, Twitter, Linkedin, Facebook } from "lucide-react"
import { supabase } from "@/utils/supabase"

interface ShareIdeaProps {
  idea: {
    id: string
    title: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function ShareIdea({ idea, isOpen, onClose }: ShareIdeaProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  
  useEffect(() => {
    // Set the share URL only on the client side
    setShareUrl(`${window.location.origin}/idea/${idea.id}`)
  }, [idea.id])
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Update share count
    try {
      await supabase.rpc('increment_shares', { idea_id: idea.id })
    } catch (error) {
      console.error('Failed to update share count:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    let url = ''
    const text = `Check out this startup idea: ${idea.title}`
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
    }
    
    window.open(url, '_blank')
    
    // Update share count
    try {
      supabase.rpc('increment_shares', { idea_id: idea.id })
    } catch (error) {
      console.error('Failed to update share count:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this idea</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly />
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare('twitter')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare('linkedin')}
            >
            <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSocialShare('facebook')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 