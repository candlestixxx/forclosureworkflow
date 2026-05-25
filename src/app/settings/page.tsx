import { IntakeTester } from "./ClientTester";
import { Upload, Download, Database, Settings as SettingsIcon, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings & Integrations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import / Export Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Import Leads (CSV)</p>
                <p className="text-sm text-gray-500">Upload bulk leads from other sources.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm font-medium transition-colors">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Export Leads (CSV)</p>
                <p className="text-sm text-gray-500">Download your database for external use.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm font-medium transition-colors">
                <Download className="w-4 h-4 mr-2" /> Download
              </button>
            </div>
          </div>
        </div>

        {/* County Source Configuration Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
            <SettingsIcon className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Intake Configuration</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">Configure automated weekly foreclosure intake sources.</p>

            <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg flex items-start">
               <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-blue-900">Macomb County (Active)</p>
                 <p className="text-xs text-blue-700 mt-1">Scheduled: Every Friday @ 12:00 PM</p>
               </div>
               <button className="ml-auto text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-md hover:bg-blue-200">Configure</button>
            </div>

            <IntakeTester />

            <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-colors text-sm font-medium">
              + Add New County Source
            </button>
          </div>
        </div>

        {/* Automation Rules Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
            <SettingsIcon className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Automation Rules</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 font-medium rounded-tl-lg">Trigger</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium rounded-tr-lg">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-900 font-medium">Friday 12:00 PM</td>
                  <td className="px-4 py-3 text-gray-600">Run Macomb County foreclosure intake workflow</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span></td>
                  <td className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Edit</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900 font-medium">New Lead Created</td>
                  <td className="px-4 py-3 text-gray-600">Tag with #new and #needsenrichment</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span></td>
                  <td className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
