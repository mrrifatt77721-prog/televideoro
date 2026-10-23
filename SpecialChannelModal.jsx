import React, { useState } from 'react';
import { X, Send, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { triggerHaptic, openTelegramLink } from '../utils/telegram.js';

export function SpecialChannelModal({ video, onSuccess, onClose }) {
  const channels = video.specialChannels || [
    { id: 'ch-1', name: 'অফিশিয়াল টেলিগ্রাম চ্যানেল', url: video.botUrl || 'https://t.me/example' },
    { id: 'ch-2', name: 'ভিআইপি ব্যাকআপ চ্যানেল', url: video.botUrl || 'https://t.me/example' }
  ];

  const [completedIds, setCompletedIds] = useState([]);
  const [verifyingId, setVerifyingId] = useState(null);

  const handleJoin = (channel) => {
    triggerHaptic('medium');
    openTelegramLink(channel.url);
    setVerifyingId(channel.id);
    setTimeout(() => {
      triggerHaptic('success');
      const updated = [...completedIds, channel.id];
      setCompletedIds(updated);
      setVerifyingId(null);
      if (updated.length >= channels.length) {
        onSuccess(video.id);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">স্পেশাল চ্যানেল আনলকার</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 my-3 text-center">
          ভিডিও দেখতে নিচের স্পেশাল চ্যানেলগুলোতে জয়েন করুন:
        </p>

        <div className="space-y-2.5 my-3">
          {channels.map((ch, idx) => {
            const isDone = completedIds.includes(ch.id);
            const isCurrent = verifyingId === ch.id;

            return (
              <div key={ch.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{ch.name}</div>
                  <div className="text-[10px] text-slate-400">Step {idx + 1} of {channels.length}</div>
                </div>

                {isDone ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoin(ch)}
                    disabled={isCurrent}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition active:scale-95 disabled:opacity-60"
                  >
                    {isCurrent ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    <span>{isCurrent ? 'যাচাই হচ্ছে...' : 'জয়েন করুন'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}