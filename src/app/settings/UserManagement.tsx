"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Trash2 } from "lucide-react";

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ email: "", name: "", password: "", role: "Agent" });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(await res.text());
      setIsCreating(false);
      setFormData({ email: "", name: "", password: "", role: "Agent" });
      fetchUsers();
    } catch (e) {
      alert("Failed to create user. Ensure email is unique and you are an Admin.");
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Team Management</h2>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-md flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add User
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500" />
            <input required type="password" placeholder="Password (min 6)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500" />
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded">Create User</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
               <tr><td colSpan={4} className="p-4 text-center text-gray-500">No database users found. System running on environmental admin bootstrap.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
