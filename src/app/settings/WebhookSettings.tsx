"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // For MVP, we use localStorage to hold the webhook config globally on the client side.
    const stored = localStorage.getItem("crm_webhook_url");
    if (stored) setWebhookUrl(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem("crm_webhook_url", webhookUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6 lg:col-span-2">
      <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">CRM Integration (Webhook)</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Configure a global Webhook Catch URL (e.g., from Zapier, Make.com, GoHighLevel) to instantly push fully enriched Leads from the database to your external CRM.
      </p>

      <div className="flex gap-3">
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://hooks.zapier.com/hooks/catch/..."
          className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
