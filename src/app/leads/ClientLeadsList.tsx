"use client";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function ClientLeadsList({ leads }: { leads: any[] }) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const router = useRouter();

  const toggleAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  const toggleLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(l => l !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleBulkAction = async (action: "status" | "tag", value: string) => {
    if (!value || selectedLeads.length === 0) return;
    setIsBulkLoading(true);

    try {
      await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedLeads, action, value })
      });
      setSelectedLeads([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Bulk action failed");
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <>
      {selectedLeads.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 p-3 px-6 flex flex-wrap gap-4 justify-between items-center">
          <span className="text-sm font-medium text-indigo-800">
            {selectedLeads.length} leads selected
          </span>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              disabled={isBulkLoading}
              onChange={(e) => {
                if (e.target.value) handleBulkAction("status", e.target.value);
                e.target.value = ""; // reset select
              }}
              className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100 focus:outline-none"
            >
              <option value="">Set Status...</option>
              <option value="New">New</option>
              <option value="Ready">Ready</option>
              <option value="Attempted">Attempted</option>
              <option value="Dead">Dead</option>
            </select>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("tagName") as HTMLInputElement;
                if (input.value) handleBulkAction("tag", input.value);
                input.value = "";
              }}
              className="flex items-center"
            >
              <input
                name="tagName"
                type="text"
                placeholder="# tag"
                disabled={isBulkLoading}
                className="w-24 px-2 py-1 text-xs border border-indigo-200 rounded-l focus:outline-none"
              />
              <button
                type="submit"
                disabled={isBulkLoading}
                className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-r hover:bg-indigo-700 disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedLeads.length > 0 && selectedLeads.length === leads.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-6 py-3 font-medium">Owner Name</th>
              <th className="px-6 py-3 font-medium">Property Address</th>
              <th className="px-6 py-3 font-medium">Sale Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No leads found. Create one or wait for the Friday intake.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-indigo-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLead(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.ownerName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.propertyAddress}<br/>
                    <span className="text-xs text-gray-400">{lead.city}, MI {lead.zip}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.saleDate ? format(new Date(lead.saleDate), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${lead.noticeStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.noticeStatus === 'Ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {lead.noticeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.bestPhone || <span className="text-gray-400 italic">Missing</span>}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
