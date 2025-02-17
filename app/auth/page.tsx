"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Auth() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to StartupMatch
        </h1>
        <Button onClick={() => signIn("google")} className="w-full">
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
