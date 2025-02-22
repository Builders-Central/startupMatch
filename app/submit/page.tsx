"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";

interface IdeaFormData {
  title: string; // Required
  description: string; // Required
  marketSize: string[]; // Required
  marketPotential: string[]; // Required
  technicalRequirements: string[]; // Required but can be empty
  financialRequirement: string[]; // Required
  timeline: string[]; // Required
  category: string[]; // Required
  challenges: string[]; // Required but can be empty
}

export default function SubmitIdea() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    description: "",
    marketSize: [""],
    marketPotential: [""],
    technicalRequirements: [""],
    financialRequirement: [""],
    timeline: [""],
    category: [""],
    challenges: [""],
  });

  const handleTechnicalRequirementChange = (index: number, value: string) => {
    const newTechnicalRequirements = [...formData.technicalRequirements];
    newTechnicalRequirements[index] = value;
    setFormData({
      ...formData,
      technicalRequirements: newTechnicalRequirements,
    });
  };

  const addTechnicalRequirement = () => {
    setFormData({
      ...formData,
      technicalRequirements: [...formData.technicalRequirements, ""],
    });
  };

  const removeTechnicalRequirement = (index: number) => {
    const newTechnicalRequirements = formData.technicalRequirements.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      technicalRequirements: newTechnicalRequirements,
    });
  };

  const handleChallengeChange = (index: number, value: string) => {
    const newChallenges = [...formData.challenges];
    newChallenges[index] = value;
    setFormData({ ...formData, challenges: newChallenges });
  };

  const addChallenge = () => {
    setFormData({
      ...formData,
      challenges: [...formData.challenges, ""],
    });
  };

  const removeChallenge = (index: number) => {
    const newChallenges = formData.challenges.filter((_, i) => i !== index);
    setFormData({ ...formData, challenges: newChallenges });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!session || !session.user?.email) {
        throw new Error("Not authenticated");
      }

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error("Title and description are required");
      }

      const newIdea = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        market_size: formData.marketSize[0]?.trim() || null,
        market_potential: formData.marketPotential[0]?.trim() || null,
        technical_requirements: formData.technicalRequirements.filter(Boolean),
        financial_requirement: formData.financialRequirement[0]?.trim() || null,
        timeline: formData.timeline[0]?.trim() || null,
        category: formData.category[0]?.trim() || null,
        challenges: formData.challenges.filter(Boolean),
        metrics: {
          likes: 0,
          passes: 0,
          shares: 0,
        },
      };

      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIdea),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit idea");
      }

      router.push("/explore");
    } catch (error: any) {
      console.error("Submit error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Submit Your Startup Idea
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Market Size
              </label>
              <Input
                value={formData.marketSize}
                onChange={(e) =>
                  setFormData({ ...formData, marketSize: [e.target.value] })
                }
                placeholder="e.g., $50B+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Market Potential
              </label>
              <Input
                value={formData.marketPotential}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marketPotential: [e.target.value],
                  })
                }
                placeholder="e.g., High growth potential"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Technical Requirements
            </label>
            {formData.technicalRequirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={req}
                  onChange={(e) =>
                    handleTechnicalRequirementChange(index, e.target.value)
                  }
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
              <label className="block text-sm font-medium mb-1">
                Financial Requirement
              </label>
              <Input
                value={formData.financialRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financialRequirement: [e.target.value],
                  })
                }
                placeholder="e.g., $500K initial investment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timeline</label>
              <Input
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({ ...formData, timeline: [e.target.value] })
                }
                placeholder="e.g., 12 months to MVP"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: [e.target.value] })
              }
              placeholder="e.g., E-commerce"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Key Challenges
            </label>
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
