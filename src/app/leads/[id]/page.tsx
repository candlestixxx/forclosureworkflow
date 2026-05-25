import { AddNoteButton, AddTaskButton } from "./ClientActions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, User, MapPin, Phone, Mail, FileText, Calendar, Edit, Plus, AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: resolvedParams.id },
    include: {
      contacts: true,
      notes: { orderBy: { createdAt: 'desc' } },
      tasks: { orderBy: { dueDate: 'asc' } },
      tags: true,
    }
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/leads" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{lead.ownerName}</h1>
          <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
            <span>Lead ID: {lead.id}</span>
            <span>•</span>
            <span>Added {format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border
            ${lead.noticeStatus === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              lead.noticeStatus === 'Ready' ? 'bg-green-50 text-green-700 border-green-200' :
              'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {lead.noticeStatus}
          </span>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </button>
        </div>
      </div>

      {lead.needsAddressMatch && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This lead needs address matching. The current address might only be a legal description.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              Property & Notice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Property Address</p>
                <p className="text-gray-900">{lead.propertyAddress}</p>
                <p className="text-gray-600">{lead.city || 'Unknown City'}, MI {lead.zip}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Sale Date</p>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {lead.saleDate ? format(new Date(lead.saleDate), 'MMMM d, yyyy') : 'Not Scheduled'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Source</p>
                <p className="text-gray-900">{lead.source || 'Manual Entry'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Lead Score</p>
                <p className="text-gray-900">{lead.leadScore} / 100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Notes
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Note
              </button>
            </div>
            {lead.notes.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No notes yet.</p>
            ) : (
              <div className="space-y-4">
                {lead.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-400" />
              Raw Notice Text
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-64 overflow-y-auto font-mono text-sm text-gray-700">
              {lead.rawNoticeText ? lead.rawNoticeText : <span className="italic text-gray-400">No raw notice text stored.</span>}
            </div>
          </div>
        </div>

        {/* Right Column: Contacts & Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Contact Info
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Enrich</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.bestPhone || 'No primary phone'}</p>
                  <p className="text-xs text-gray-500">Primary Phone</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.email || 'No primary email'}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
            </div>

            {lead.contacts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-3">Other Contacts</p>
                <div className="space-y-3">
                  {lead.contacts.map((contact) => (
                    <div key={contact.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-800">{contact.value}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{contact.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                Tasks
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            {lead.tasks.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No upcoming tasks.</p>
            ) : (
              <div className="space-y-3">
                {lead.tasks.map((task) => (
                  <div key={task.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <input type="checkbox" className="mt-1 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
             <div className="flex flex-wrap gap-2">
                {lead.tags.map(tag => (
                  <span key={tag.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                    #{tag.name}
                  </span>
                ))}
                {lead.tags.length === 0 && <span className="text-sm text-gray-500 italic">No tags</span>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
