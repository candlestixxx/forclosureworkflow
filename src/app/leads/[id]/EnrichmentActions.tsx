"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddContactButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "Phone",
    value: "",
    confidence: "80",
    isPrimary: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...formData }),
      });
      setFormData({ type: "Phone", value: "", confidence: "80", isPrimary: false });
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center mt-3">
        <Plus className="w-4 h-4 mr-1" /> Add Contact Data
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 border border-gray-200 bg-gray-50 rounded-lg">
      <div className="flex space-x-2">
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
        >
          <option value="Phone">Phone</option>
          <option value="Email">Email</option>
        </select>
        <input
          required
          type="text"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          placeholder={formData.type === "Phone" ? "(555) 123-4567" : "email@example.com"}
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="text-xs text-gray-600 flex items-center">
          Confidence:
          <input type="number" min="0" max="100" value={formData.confidence} onChange={(e) => setFormData({...formData, confidence: e.target.value})} className="ml-2 w-16 p-1 border border-gray-300 rounded" />
          <span className="ml-1">%</span>
        </label>
        <label className="text-xs text-gray-700 flex items-center font-medium">
          <input type="checkbox" checked={formData.isPrimary} onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})} className="mr-2" />
          Make Primary
        </label>
      </div>
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
        <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}

export function AddRelativeButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/relatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...formData }),
      });
      setFormData({ name: "", relation: "", phone: "" });
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center mt-3">
        <Plus className="w-4 h-4 mr-1" /> Add Relative/Roommate
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 border border-gray-200 bg-gray-50 rounded-lg">
      <input
        required
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
        placeholder="Relative Name"
      />
      <div className="flex space-x-2">
        <input
          type="text"
          value={formData.relation}
          onChange={(e) => setFormData({...formData, relation: e.target.value})}
          className="w-1/2 p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          placeholder="Relation (e.g. Spouse)"
        />
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-1/2 p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          placeholder="Phone Number"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
        <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}

export function RunConnectorButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrich/connector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, connectorType: "MyPlusLeads" }),
      });
      const data = await res.json();

      if (data.success) {
        router.refresh();
      } else {
        alert("Enrichment run failed: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("System error running connector.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRun}
      disabled={loading}
      className="mt-3 w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading ? "Running MyPlus Leads Automation..." : "Run MyPlus Leads Automation"}
    </button>
  );
}
