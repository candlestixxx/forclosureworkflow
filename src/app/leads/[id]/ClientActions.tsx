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

export function CommsButtons({ leadId, defaultPhone, defaultEmail }: { leadId: string, defaultPhone?: string, defaultEmail?: string }) {
  const router = useRouter();

  // SMS State
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [smsTo, setSmsTo] = useState(defaultPhone || "");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Email State
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailTo, setEmailTo] = useState(defaultEmail || "");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmsStatus("sending");
    try {
      const res = await fetch("/api/communications/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, to: smsTo, message: smsMessage }),
      });
      if (!res.ok) throw new Error("SMS failed");
      setSmsStatus("success");
      setSmsMessage("");
      setTimeout(() => {
        setSmsStatus("idle");
        setIsSmsOpen(false);
      }, 2000);
      router.refresh();
    } catch (e) {
      console.error(e);
      setSmsStatus("error");
      setTimeout(() => setSmsStatus("idle"), 3000);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/communications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, to: emailTo, subject: emailSubject, body: emailBody }),
      });
      if (!res.ok) throw new Error("Email failed");
      setEmailStatus("success");
      setEmailSubject("");
      setEmailBody("");
      setTimeout(() => {
        setEmailStatus("idle");
        setIsEmailOpen(false);
      }, 2000);
      router.refresh();
    } catch (e) {
      console.error(e);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex gap-2">
      {/* SMS Container */}
      <div className="relative">
        <button
          onClick={() => { setIsSmsOpen(!isSmsOpen); setIsEmailOpen(false); }}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Send SMS
        </button>
        {isSmsOpen && (
          <form onSubmit={handleSendSms} className="absolute z-10 top-12 left-0 w-72 bg-white border border-gray-200 shadow-xl rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">Send SMS via Twilio</h4>
            <input
              required type="text" value={smsTo} onChange={e => setSmsTo(e.target.value)}
              placeholder="To: +1234567890"
              className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              required value={smsMessage} onChange={e => setSmsMessage(e.target.value)}
              placeholder="Message body..." rows={3}
              className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit" disabled={smsStatus === 'sending'}
              className={`w-full py-2 text-white text-sm font-medium rounded transition-colors
                ${smsStatus === 'success' ? 'bg-green-600' : smsStatus === 'error' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}
                disabled:opacity-50`}
            >
              {smsStatus === 'sending' ? 'Sending...' : smsStatus === 'success' ? 'Sent!' : smsStatus === 'error' ? 'Failed' : 'Send SMS'}
            </button>
          </form>
        )}
      </div>

      {/* Email Container */}
      <div className="relative">
        <button
          onClick={() => { setIsEmailOpen(!isEmailOpen); setIsSmsOpen(false); }}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Send Email
        </button>
        {isEmailOpen && (
          <form onSubmit={handleSendEmail} className="absolute z-10 top-12 right-0 md:left-0 w-80 bg-white border border-gray-200 shadow-xl rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">Send Email via SendGrid</h4>
            <input
              required type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)}
              placeholder="To: email@example.com"
              className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              required type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
              placeholder="Subject"
              className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              required value={emailBody} onChange={e => setEmailBody(e.target.value)}
              placeholder="Message body..." rows={4}
              className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit" disabled={emailStatus === 'sending'}
              className={`w-full py-2 text-white text-sm font-medium rounded transition-colors
                ${emailStatus === 'success' ? 'bg-green-600' : emailStatus === 'error' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}
                disabled:opacity-50`}
            >
              {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'success' ? 'Sent!' : emailStatus === 'error' ? 'Failed' : 'Send Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function PushToCrmButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handlePush = async () => {


    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/export/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
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

export function AddTagButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, name }),
      });
      setName("");
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
        <Plus className="w-4 h-4 mr-1" /> Add Tag
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2 w-full">
      <div className="relative flex-1">
        <span className="absolute left-2 top-1.5 text-gray-400 text-sm">#</span>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pl-6 pr-2 py-1.5 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="investor"
        />
      </div>
      <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      <button type="button" onClick={() => setIsOpen(false)} className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
    </form>
  );
}
