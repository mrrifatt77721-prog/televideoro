import React, { useState, useEffect } from 'react';
import { 
  Play, Lock, Unlock, Calendar, Shield, Sparkles, Film, 
  ExternalLink, Search, Bell, User, Download, Coins, Flame 
} from 'lucide-react';

import { VideoPlayerModal } from './components/VideoPlayerModal.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import { TaskUnlockModal } from './components/TaskUnlockModal.jsx';
import { SpecialChannelModal } from './components/SpecialChannelModal.jsx';
import { triggerHaptic, openTelegramLink } from './utils/telegram.js';

// Default initial video items
const initialVideos = [
  {
    id: 'vid-1',
    title: 'নতুন ভাইরাল নাটক ও ভিডিও রিলিজ 🔥',
    subtitle: 'সম্পূর্ণ এইচডি কোয়ালিটিতে দেখুন',
    description: 'টেলিগ্রাম চ্যানেলে জয়েন করে ও টাস্ক সম্পন্ন করে ভিডিও আনলক করুন।',
    category: 'Trending',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    botUrl: 'https://t.me/${botUsername || 'TeleVideoBot'}',
    duration: '02:15',
    requiredTasksCount: 3,
    taskMode: 'normal'
  },
  {
    id: 'vid-2',
    title: 'স্পেশাল চ্যানেল আনলক ভিডিও 🚀',
    subtitle: 'চ্যানেলে জয়েন করে সরাসরি আনলক',
    description: 'স্পনসর টেলিগ্রাম চ্যানেল ও অফিশিয়াল গ্রুপে জয়েন করে এক ক্লিকে লিংক নিন।',
    category: 'Special',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    botUrl: 'https://t.me/${botUsername || 'TeleVideoBot'}',
    duration: '03:40',
    requiredTasksCount: 2,
    taskMode: 'special',
    specialChannels: [
      { id: 'ch-1', name: 'Official VIP Channel', url: 'https://t.me/${botUsername || 'TeleVideoBot'}' },
      { id: 'ch-2', name: 'Partner Community', url: 'https://t.me/${botUsername || 'TeleVideoBot'}' }
    ]
  }
];

export default function App() {
  const [tgUser, setTgUser] = useState(null);
  const [videos, setVideos] = useState(initialVideos);
  const [tokens, setTokens] = useState(10);
  const [unlockedVideoIds, setUnlockedVideoIds] = useState(['vid-1']);
  
  // Modals
  const [activeVideo, setActiveVideo] = useState(null);
  const [taskModalVideo, setTaskModalVideo] = useState(null);
  const [specialModalVideo, setSpecialModalVideo] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
      }
    }
  }, []);

  const handleOpenVideo = (video) => {
    triggerHaptic('light');
    if (unlockedVideoIds.includes(video.id) || video.requiredTasksCount === 0) {
      setActiveVideo(video);
    } else {
      if (video.taskMode === 'special') {
        setSpecialModalVideo(video);
      } else {
        setTaskModalVideo(video);
      }
    }
  };

  const unlockVideo = (id) => {
    if (!unlockedVideoIds.includes(id)) {
      setUnlockedVideoIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 p-4 font-sans select-none pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-4 shadow">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {tgUser?.first_name ? tgUser.first_name[0] : <User className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}` : '${appTitle}'}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {tgUser?.username ? `@${tgUser.username}` : 'Connected to Telegram'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> {tokens}
          </span>
          <button
            onClick={() => setShowAdmin(true)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition"
            title="Admin Panel"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center my-4">
        <h1 className="text-xl font-black text-white tracking-tight">${appTitle}</h1>
        <p className="text-slate-400 text-xs mt-1">${description}</p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        {videos.map(video => {
          const isUnlocked = unlockedVideoIds.includes(video.id);
          return (
            <div 
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden cursor-pointer transition shadow"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    {isUnlocked ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <Lock className="w-5 h-5 text-slate-950" />}
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono font-bold text-white rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-white truncate">{video.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{video.subtitle}</p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-cyan-400 font-semibold">{video.category}</span>
                  <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isUnlocked ? 'আনলক করা' : 'টাস্ক সম্পন্ন করুন'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
          botUsername="${botUsername || 'TeleVideoBot'}"
        />
      )}

      {/* Task Unlock Modal */}
      {taskModalVideo && (
        <TaskUnlockModal 
          video={taskModalVideo}
          onSuccess={(id) => {
            unlockVideo(id);
            setTaskModalVideo(null);
            const found = videos.find(v => v.id === id);
            if (found) setActiveVideo(found);
          }}
          onClose={() => setTaskModalVideo(null)}
        />
      )}

      {/* Special Channel Join Modal */}
      {specialModalVideo && (
        <SpecialChannelModal
          video={specialModalVideo}
          onSuccess={(id) => {
            unlockVideo(id);
            setSpecialModalVideo(null);
            const found = videos.find(v => v.id === id);
            if (found) setActiveVideo(found);
          }}
          onClose={() => setSpecialModalVideo(null)}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel
          videos={videos}
          onAddVideo={(newVid) => setVideos(prev => [newVid, ...prev])}
          onDeleteVideo={(id) => setVideos(prev => prev.filter(v => v.id !== id))}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}