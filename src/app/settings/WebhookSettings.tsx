"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [hubspotApiKey, setHubspotApiKey] = useState("");
  const [ghlApiKey, setGhlApiKey] = useState("");
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioFromNumber, setTwilioFromNumber] = useState("");
  const [sendgridApiKey, setSendgridApiKey] = useState("");
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const [browserlessEndpoint, setBrowserlessEndpoint] = useState("");
  const [awsAccessKeyId, setAwsAccessKeyId] = useState("");
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState("");
  const [awsRegion, setAwsRegion] = useState("");
  const [awsS3Bucket, setAwsS3Bucket] = useState("");
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
          setGhlApiKey(data.ghlApiKey || "");
          setTwilioAccountSid(data.twilioAccountSid || "");
          setTwilioAuthToken(data.twilioAuthToken || "");
          setTwilioFromNumber(data.twilioFromNumber || "");
          setSendgridApiKey(data.sendgridApiKey || "");
          setOpenAiApiKey(data.openAiApiKey || "");
          setBrowserlessEndpoint(data.browserlessEndpoint || "");
          setAwsAccessKeyId(data.awsAccessKeyId || "");
          setAwsSecretAccessKey(data.awsSecretAccessKey || "");
          setAwsRegion(data.awsRegion || "");
          setAwsS3Bucket(data.awsS3Bucket || "");
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
        body: JSON.stringify({
          webhookUrl, hubspotApiKey, ghlApiKey,
          twilioAccountSid, twilioAuthToken, twilioFromNumber, sendgridApiKey, openAiApiKey, browserlessEndpoint, awsAccessKeyId, awsSecretAccessKey, awsRegion, awsS3Bucket
        }),
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
                title="Enter your unique Zapier or Make.com catch hook URL here."
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
                title="Generate a Private App Token from your HubSpot developer portal with Contacts write access."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-1">GoHighLevel (Native Exporter)</p>
            <p className="text-xs text-gray-500 mb-3">
                Connect directly to GoHighLevel (GHL) Contacts API using a Location API Key.
            </p>
            <input
                type="password"
                value={ghlApiKey}
                onChange={(e) => setGhlApiKey(e.target.value)}
                placeholder="Enter GHL Location API Key"
                title="Find this in your GoHighLevel Location Settings under 'API Key'."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-1">Twilio (SMS integration)</p>
            <p className="text-xs text-gray-500 mb-3">
                Configure Twilio to send SMS to leads directly from the dashboard.
            </p>
            <div className="space-y-2">
                <input
                    type="text"
                    value={twilioAccountSid}
                    onChange={(e) => setTwilioAccountSid(e.target.value)}
                    placeholder="Account SID"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <input
                    type="password"
                    value={twilioAuthToken}
                    onChange={(e) => setTwilioAuthToken(e.target.value)}
                    placeholder="Auth Token"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <input
                    type="text"
                    value={twilioFromNumber}
                    onChange={(e) => setTwilioFromNumber(e.target.value)}
                    placeholder="From Number (e.g. +1234567890)"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-1">SendGrid (Email integration)</p>
            <p className="text-xs text-gray-500 mb-3">
                Configure SendGrid to send emails to leads directly from the dashboard.
            </p>
            <input
                type="password"
                value={sendgridApiKey}
                onChange={(e) => setSendgridApiKey(e.target.value)}
                placeholder="SendGrid API Key"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-1">OpenAI (LLM Parser integration)</p>
            <p className="text-xs text-gray-500 mb-3">
                Enable robust LLM parsing for complex HTML/PDF foreclosure notices.
            </p>
            <input
                type="password"
                value={openAiApiKey}
                onChange={(e) => setOpenAiApiKey(e.target.value)}
                placeholder="OpenAI API Key (sk-...)"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS S3 Access Key ID</label>
            <input
              type="text"
              value={awsAccessKeyId}
              onChange={(e) => setAwsAccessKeyId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="AKIA..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS S3 Secret Access Key</label>
            <input
              type="password"
              value={awsSecretAccessKey}
              onChange={(e) => setAwsSecretAccessKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Secret..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS S3 Region</label>
            <input
              type="text"
              value={awsRegion}
              onChange={(e) => setAwsRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="us-east-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS S3 Bucket Name</label>
            <input
              type="text"
              value={awsS3Bucket}
              onChange={(e) => setAwsS3Bucket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="my-crm-bucket"
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
