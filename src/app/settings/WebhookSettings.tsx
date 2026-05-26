"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setWebhookUrl(data.webhookUrl || "");
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
