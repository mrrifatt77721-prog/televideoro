import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ExternalLink, Sparkles, Clock } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram.js';

export function TaskUnlockModal({ video, onSuccess, onClose }) {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'অফিশিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন', link: video.botUrl || '#', completed: false },
    { id: 't2', title: 'স্পনসর টেলিগ্রাম বটে স্টার্ট দিন', link: 'https://t.me/SpiderMinerBot', completed: false },
    { id: 't3', title: 'অফিশিয়াল পেজ ভিজিট করুন ও ৫ সেকেন্ড থাকুন', link: '#visit', completed: false },
  ]);
  const [verifyingId, setVerifyingId] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (verifyingId && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (verifyingId && timer === 0) {
      triggerHaptic('success');
      setTasks(prev => {
        const next = prev.map(item => item.id === verifyingId ? { ...item, completed: true } : item);
        const allDone = next.every(item => item.completed);
        if (allDone) {
          setTimeout(() => onSuccess(video.id), 500);
        }
        return next;
      });
      setVerifyingId(null);
    }
    return () => clearInterval(interval);
  }, [verifyingId, timer]);

  const handleStartTask = (task) => {
    triggerHaptic('medium');
    if (task.link && task.link !== '#visit') {
      window.open(task.link, '_blank');
    }
    setVerifyingId(task.id);
    setTimer(4); // 4-second verification
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">ভিডিও আনলক টাস্ক</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 text-center">
          <h4 className="text-xs font-bold text-white line-clamp-1">{video.title}</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            ভিডিওটি সম্পূর্ণ দেখার জন্য নিচের {tasks.length}টি টাস্ক সম্পন্ন করুন:
          </p>
        </div>

        <div className="space-y-2 my-4">
          {tasks.map((task, i) => (
            <div key={task.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-200 line-clamp-1">{task.title}</span>
              </div>

              {task.completed ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" /> সম্পন্ন
                </span>
              ) : verifyingId === task.id ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                  <Clock className="w-3 h-3 animate-spin" /> {timer}s
                </span>
              ) : (
                <button
                  onClick={() => handleStartTask(task)}
                  disabled={verifyingId !== null}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
                >
                  শুরু <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] text-slate-400">
          প্রগ্রেস: <span className="text-cyan-400 font-bold">{completedCount} / {tasks.length}</span> সম্পন্ন হয়েছে
        </div>
      </div>
    </div>
  );
}