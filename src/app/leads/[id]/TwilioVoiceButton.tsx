"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";

export function TwilioVoiceButton({ leadId, toPhone }: { leadId: string, toPhone: string }) {
  const [status, setStatus] = useState<"idle" | "calling" | "success" | "error">("idle");

  const handleCall = async () => {
    setStatus("calling");

    try {
      const res = await fetch(`/api/communications/voice?to=${encodeURIComponent(toPhone)}&leadId=${leadId}`);
      if (!res.ok) {
        throw new Error("Failed to call");
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleCall}
      disabled={status === "calling" || !toPhone}
      className={`px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center ${!toPhone ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!toPhone ? "No phone number available" : "Call via Twilio"}
    >
      {status === "calling" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
      {status === "calling" ? "Calling..." : status === "success" ? "Call Initiated" : status === "error" ? "Failed" : "Call"}
    </button>
  );
}
