"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import ChatPilotBot with SSR disabled
const ChatPilotBot = dynamic(
  () =>
    import("@leocodeio/npm-chatpilot").then((mod) => ({
      default: mod.ChatPilotBot,
    })),
  {
    ssr: false,
    loading: () => null, // Don't show anything while loading
  }
);

export default function Pilot() {
  return (
    <Suspense fallback={null}>
      <ChatPilotBot
        apiKey={process.env.NEXT_PUBLIC_CHATPILOT_API_KEY || ""}
        xApiKey={process.env.NEXT_PUBLIC_CHATPILOT_X_API_KEY || ""}
      />
    </Suspense>
  );
}
