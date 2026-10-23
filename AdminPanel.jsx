import React, { useState } from 'react';
import { X, Plus, Trash2, Shield, Film, Check, ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram.js';

export function AdminPanel({ videos, onAddVideo, onDeleteVideo, onClose }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('02:30');
  const [tasksCount, setTasksCount] = useState(3);
  const [taskMode, setTaskMode] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    triggerHaptic('success');
    const newVid = {
      id: 'vid-' + Date.now(),
      title,
      subtitle: subtitle || 'নতুন ভিডিও',
      description: 'অ্যাডমিন প্যানেল থেকে যুক্ত করা কনটেন্ট।',
      category: 'Trending',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      videoUrl,
      duration,
      requiredTasksCount: parseInt(tasksCount, 10),
      taskMode
    };

    onAddVideo(newVid);
    setTitle('');
    setSubtitle('');
    setVideoUrl('');
    setThumbnailUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <h2 className="text-sm font-bold text-white">অ্যাডমিন কন্ট্রোল প্যানেল</h2>
          </div>
          <button 
            onClick={() => { triggerHaptic('light'); onClose(); }}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Video Form */}
        <form onSubmit={handleSubmit} className="my-4 space-y-3">
          <div className="text-xs font-bold text-slate-300">নতুন ভিডিও বা ড্রামা যোগ করুন:</div>
          <input
            type="text"
            placeholder="ভিডিওর শিরোনাম (Title)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
          <input
            type="text"
            placeholder="সাবটাইটেল / বর্ণনা (Subtitle)"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="url"
            placeholder="সরাসরি ভিডিও MP4 লিংক (Direct Video URL)"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
          <input
            type="url"
            placeholder="থাম্বনেইল ইমেজ লিংক (Thumbnail Image URL)"
            value={thumbnailUrl}
            onChange={e => setThumbnailUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">টাস্ক আনলক সংখ্যা:</label>
              <select
                value={tasksCount}
                onChange={e => setTasksCount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value={0}>সরাসরি আনলক (0 টাস্ক)</option>
                <option value={1}>১টি টাস্ক</option>
                <option value={2}>২টি টাস্ক</option>
                <option value={3}>৩টি টাস্ক</option>
                <option value={5}>৫টি টাস্ক</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400">টাস্কের ধরণ:</label>
              <select
                value={taskMode}
                onChange={e => setTaskMode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="normal">সাধারণ বিজ্ঞাপন কাউন্টডাউন</option>
                <option value="special">স্পেশাল চ্যানেল জয়েন</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> ভিডিও সংরক্ষণ করুন
          </button>
        </form>

        {/* Existing Videos List */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-2">বর্তমান ভিডিও তালিকা ({videos.length}):</div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {videos.map(v => (
              <div key={v.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="truncate max-w-[240px] text-slate-200">{v.title}</span>
                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    onDeleteVideo(v.id);
                  }}
                  className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}