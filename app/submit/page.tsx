"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/utils/supabase"
import { X } from "lucide-react"

export default function SubmitIdea() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    marketSize: "",
    marketPotential: "",
    technicalRequirements: [""],
    financialRequirement: "",
    timeline: "",
    category: "",
    challenges: [""],
  })

  const handleTechnicalRequirementChange = (index: number, value: string) => {
    const newTechnicalRequirements = [...formData.technicalRequirements]
    newTechnicalRequirements[index] = value
    setFormData({ ...formData, technicalRequirements: newTechnicalRequirements })
  }

  const addTechnicalRequirement = () => {
    setFormData({
      ...formData,
      technicalRequirements: [...formData.technicalRequirements, ""],
    })
  }

  const removeTechnicalRequirement = (index: number) => {
    const newTechnicalRequirements = formData.technicalRequirements.filter(
      (_, i) => i !== index
    )
    setFormData({ ...formData, technicalRequirements: newTechnicalRequirements })
  }

  const handleChallengeChange = (index: number, value: string) => {
    const newChallenges = [...formData.challenges]
    newChallenges[index] = value
    setFormData({ ...formData, challenges: newChallenges })
  }

  const addChallenge = () => {
    setFormData({
      ...formData,
      challenges: [...formData.challenges, ""],
    })
  }

  const removeChallenge = (index: number) => {
    const newChallenges = formData.challenges.filter((_, i) => i !== index)
    setFormData({ ...formData, challenges: newChallenges })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) throw new Error("Not authenticated")

      const { error } = await supabase.from("startup_ideas").insert({
        user_id: user.id,
        author_email: user.email,
        title: formData.title,
        description: formData.description,
        market_size: formData.marketSize,
        market_potential: formData.marketPotential,
        technical_requirements: formData.technicalRequirements.filter(Boolean),
        financial_requirement: formData.financialRequirement,
        timeline: formData.timeline,
        category: formData.category,
        challenges: formData.challenges.filter(Boolean),
        metrics: {
          likes: 0,
          passes: 0,
          shares: 0
        }
      })

      if (error) {
        console.error('Submission error:', error)
        throw error
      }
      
      router.push("/")
    } catch (error: any) {
      setError(error.message)
      console.error('Submit error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Submit Your Startup Idea</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Market Size</label>
              <Input
                value={formData.marketSize}
                onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                required
                placeholder="e.g., $50B+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Market Potential</label>
              <Input
                value={formData.marketPotential}
                onChange={(e) => setFormData({ ...formData, marketPotential: e.target.value })}
                required
                placeholder="e.g., High growth potential"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Technical Requirements</label>
            {formData.technicalRequirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={req}
                  onChange={(e) => handleTechnicalRequirementChange(index, e.target.value)}
                  placeholder="e.g., Mobile Development"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeTechnicalRequirement(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTechnicalRequirement}
              className="w-full"
            >
              Add Technical Requirement
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Financial Requirement</label>
              <Input
                value={formData.financialRequirement}
                onChange={(e) => setFormData({ ...formData, financialRequirement: e.target.value })}
                required
                placeholder="e.g., $500K initial investment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timeline</label>
              <Input
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                required
                placeholder="e.g., 12 months to MVP"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="e.g., E-commerce"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Key Challenges</label>
            {formData.challenges.map((challenge, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={challenge}
                  onChange={(e) => handleChallengeChange(index, e.target.value)}
                  placeholder="e.g., User adoption"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeChallenge(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addChallenge}
              className="w-full"
            >
              Add Challenge
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 