'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface CallEvent {
  callSid: string;
  callStatus: string;
  duration?: string;
  from?: string;
  to?: string;
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-800',
  ringing: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-green-100 text-green-800',
  answered: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  failed: 'bg-red-100 text-red-800',
  busy: 'bg-orange-100 text-orange-800',
  'no-answer': 'bg-orange-100 text-orange-800',
};

export default function VoiceMonitorPanel() {
  const [calls, setCalls] = useState<CallEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    const s = io(process.env.NEXT_PUBLIC_APP_URL || window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      setConnected(true);
    });

    s.on('disconnect', () => {
      setConnected(false);
    });

    s.on('call-status-update', (event: CallEvent) => {
      setCalls((prev) => {
        const idx = prev.findIndex((c) => c.callSid === event.callSid);
        const updated = { ...event, timestamp: event.timestamp || new Date().toISOString() };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...updated };
          return next;
        }
        return [updated, ...prev].slice(0, 50);
      });
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [connectSocket]);

  const activeCalls = calls.filter(
    (c) => !['completed', 'failed', 'busy', 'no-answer'].includes(c.callStatus)
  );

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Call Monitor</h3>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-xs text-gray-500">{connected ? 'Connected' : 'Disconnected'}</span>
          <button
            onClick={() => {
              socket?.disconnect();
              connectSocket();
            }}
            className="text-xs text-blue-600 hover:underline ml-2"
          >
            Reconnect
          </button>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-sm text-gray-600">
          {activeCalls.length} active &middot; {calls.length} total
        </span>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No call events yet. Waiting for Twilio webhooks&hellip;</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-96 space-y-2">
          {calls.map((call) => (
            <div
              key={call.callSid}
              className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-500">{call.callSid.slice(0, 12)}&hellip;</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[call.callStatus] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {call.callStatus}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {call.from && <span>From: {call.from}</span>}
                  {call.to && <span className="ml-3">To: {call.to}</span>}
                  {call.duration && <span className="ml-3">Duration: {call.duration}s</span>}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(call.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
