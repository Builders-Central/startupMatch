"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabase";
import { Trash2 } from "lucide-react";

interface IdeaFormData {
  title: string;
  description: string;
  market_size: string;
  market_potential: string;
  technical_requirements: string[];
  financial_requirement: string;
  timeline: string;
  category: string;
  challenges: string[];
}

export default function EditIdea({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    description: "",
    market_size: "",
    market_potential: "",
    technical_requirements: [""],
    financial_requirement: "",
    timeline: "",
    category: "",
    challenges: [""],
  });

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const { data: idea, error } = await supabase
          .from("startup_ideas")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        if (!idea) throw new Error("Idea not found");

        setFormData(idea);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdea();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate only title and description as required
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and description are required");
        setIsLoading(false);
        return;
      }

      // Make sure we're using the correct API endpoint path
      const response = await fetch(`/api/ideas/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          market_size: formData.market_size,
          market_potential: formData.market_potential,
          technical_requirements: formData.technical_requirements,
          financial_requirement: formData.financial_requirement,
          timeline: formData.timeline,
          category: formData.category,
          challenges: formData.challenges,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Server error: ${response.status}`,
        }));
        throw new Error(errorData.error || "Failed to update idea");
      }

      router.push("/profile");
    } catch (error: any) {
      console.error("Update error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrayInput = (
    index: number,
    value: string,
    field: "technical_requirements" | "challenges"
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: "technical_requirements" | "challenges") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (
    index: number,
    field: "technical_requirements" | "challenges"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Market Size</label>
          <Input
            value={formData.market_size}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, market_size: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Market Potential</label>
          <Input
            value={formData.market_potential}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                market_potential: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Technical Requirements</label>
          {formData.technical_requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={req}
                onChange={(e) =>
                  handleArrayInput(
                    index,
                    e.target.value,
                    "technical_requirements"
                  )
                }
              />
              <Button
                type="button"
                // variant="ghost"
                onClick={() =>
                  removeArrayField(index, "technical_requirements")
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("technical_requirements")}
          >
            Add Requirement
          </Button>
        </div>

        <div>
          <label className="block mb-2">Financial Requirement</label>
          <Input
            value={formData.financial_requirement}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                financial_requirement: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Timeline</label>
          <Input
            value={formData.timeline}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, timeline: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <Input
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-2">Challenges</label>
          {formData.challenges.map((challenge, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={challenge}
                onChange={(e) =>
                  handleArrayInput(index, e.target.value, "challenges")
                }
              />
              <Button
                type="button"
                // variant="ghost"
                onClick={() => removeArrayField(index, "challenges")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addArrayField("challenges")}>
            Add Challenge
          </Button>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
