"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PhoneCall, X } from "lucide-react";

interface CallStatus {
  callSid: string;
  callStatus: string;
  duration?: string;
}

export function ActiveCallsMonitor() {
  const [activeCalls, setActiveCalls] = useState<Record<string, CallStatus>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only connect if we are in browser
    if (typeof window !== "undefined") {
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("call-status-update", (data: CallStatus) => {
        setActiveCalls((prev) => {
          const next = { ...prev };
          if (data.callStatus === "completed" || data.callStatus === "failed" || data.callStatus === "busy" || data.callStatus === "no-answer" || data.callStatus === "canceled") {
            delete next[data.callSid];
          } else {
            next[data.callSid] = data;
          }
          return next;
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const callsArray = Object.values(activeCalls);

  if (callsArray.length === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-blue-200 shadow-2xl rounded-lg overflow-hidden z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
        <h3 className="font-semibold flex items-center text-sm">
          <PhoneCall className="w-4 h-4 mr-2 animate-pulse" />
          Active Calls ({callsArray.length})
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-blue-100 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto bg-gray-50">
        {callsArray.map((call) => (
          <div key={call.callSid} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors">
             <div className="flex justify-between items-start">
               <div>
                  <span className="text-xs font-mono text-gray-400 block mb-1">SID: {call.callSid.substring(0, 8)}...</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {call.callStatus}
                  </span>
               </div>
               {call.duration && (
                 <span className="text-xs text-gray-500">{call.duration}s</span>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
