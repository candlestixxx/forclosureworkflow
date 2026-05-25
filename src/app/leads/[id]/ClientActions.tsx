"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function AddNoteButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, content }),
      });
      setContent("");
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
        <Plus className="w-4 h-4 mr-1" /> Add Note
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 border border-blue-100 bg-blue-50 rounded-lg">
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Type note details here..."
        rows={3}
      />
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}

export function AddTaskButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, title, dueDate: dueDate || null }),
      });
      setTitle("");
      setDueDate("");
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
        <Plus className="w-4 h-4 mr-1" /> Add
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 border border-blue-100 bg-blue-50 rounded-lg">
      <input
        required
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Task title (e.g. Call owner)"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}

export function LookupHelper({ ownerName, propertyAddress, zip }: { ownerName: string, propertyAddress: string, zip: string | null }) {
  const formatForCyber = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  // CyberBackgroundChecks routing format roughly: /name/john-doe or /address/123-main-st/city/mi/12345
  const nameQuery = formatForCyber(ownerName);
  const cyberNameLink = `https://www.cyberbackgroundchecks.com/name/${nameQuery}`;

  const googleLink = `https://www.google.com/search?q=${encodeURIComponent(`${ownerName} "${propertyAddress}" ${zip || ""}`)}`;

  return (
    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
      <h3 className="text-sm font-semibold text-indigo-900 mb-2">Enrichment Lookup Helpers</h3>
      <p className="text-xs text-indigo-700 mb-3">Quickly search public records to find missing phone numbers, emails, and relatives.</p>
      <div className="flex gap-2">
        <a href={cyberNameLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-white text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors">
          CyberBackgroundChecks (Name)
        </a>
        <a href={googleLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-white text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors">
          Google Search
        </a>
      </div>
    </div>
  );
}

export function PushToCrmButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handlePush = async () => {
    const targetUrl = localStorage.getItem("crm_webhook_url");

    if (!targetUrl) {
      alert("Please configure a Webhook URL in the Settings tab first.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/export/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, targetUrl })
      });

      if (!res.ok) throw new Error("Push failed");

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      router.refresh();
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePush}
      disabled={loading}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium border
        ${status === 'success' ? 'bg-green-600 text-white border-green-700' :
          status === 'error' ? 'bg-red-600 text-white border-red-700' :
          'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'}
        disabled:opacity-50`}
    >
      {loading ? "Pushing..." :
       status === 'success' ? "Synced!" :
       status === 'error' ? "Failed" :
       "Push to CRM"}
    </button>
  );
}
