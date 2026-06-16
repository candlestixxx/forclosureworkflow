"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function IntakeTester() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notices: [rawText], source: "Manual UI Test" })
      });
      const data = await res.json();
      setResult(data.results);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
      <p className="text-sm font-medium text-blue-900 mb-2">Test Notice Parser</p>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full p-3 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
        rows={4}
        placeholder="Paste raw legal notice text here (e.g. 'Notice is given that a mortgage made by John Doe... will be sold on Friday, May 29, 2026...')"
      />
      <div className="flex justify-between items-center">
        <button
          onClick={handleTest}
          disabled={loading || !rawText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium flex items-center"
        >
          <Play className="w-4 h-4 mr-2" />
          {loading ? "Processing..." : "Run Intake Test"}
        </button>
        {result && (
          <span className="text-sm text-green-700 font-medium">
            Created: {result.created} | Duplicates: {result.duplicates}
          </span>
        )}
      </div>
    </div>
  );
}

export function DatabaseResetButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you absolutely sure? This will delete ALL leads, tasks, notes, and integration settings. This cannot be undone.")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/settings/reset", {
        method: "POST"
      });
      if (res.ok) {
        alert("Database has been reset to factory defaults.");
        router.refresh();
      } else {
        alert("Failed to reset database.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg">
      <h3 className="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
      <p className="text-xs text-red-700 mb-3">Wipe all data from the system. Useful for resetting the sandbox after testing.</p>
      <button
        onClick={handleReset}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 text-sm font-medium transition-colors"
      >
        {loading ? "Resetting..." : "Factory Reset Database"}
      </button>
    </div>
  );
}
