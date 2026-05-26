"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [hubspotApiKey, setHubspotApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setWebhookUrl(data.webhookUrl || "");
          setHubspotApiKey(data.hubspotApiKey || "");
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
        body: JSON.stringify({ webhookUrl, hubspotApiKey }),
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
        <h2 className="text-xl font-semibold text-gray-800">CRM Integrations</h2>
      </div>

      <div className="space-y-6">
        <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Generic Webhook Target</p>
            <p className="text-xs text-gray-500 mb-3">
                Push fully enriched JSON payloads to Zapier, Make.com, or custom endpoints.
            </p>
            <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-1">HubSpot (Native Exporter)</p>
            <p className="text-xs text-gray-500 mb-3">
                Connect directly to the HubSpot Contacts API using a Private App Access Token.
            </p>
            <input
                type="password"
                value={hubspotApiKey}
                onChange={(e) => setHubspotApiKey(e.target.value)}
                placeholder="pat-na1-xxxx-xxxx-xxxx-xxxx"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div className="flex justify-end pt-4">
            <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center transition-colors disabled:opacity-50"
            >
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Saved Integrations!" : "Save Integrations"}
            </button>
        </div>
      </div>
    </div>
  );
}
