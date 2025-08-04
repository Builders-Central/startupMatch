"use client";

import { ChatPilotBot } from "@leocodeio/npm-chatpilot";

export default function Pilot() {
  return (
    <ChatPilotBot
      apiKey={process.env.NEXT_PUBLIC_CHATPILOT_API_KEY || ""}
      xApiKey={process.env.NEXT_PUBLIC_CHATPILOT_X_API_KEY || ""}
    />
  );
}
