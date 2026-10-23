import React, { useRef, useState } from 'react';
import { X, Play, Pause, Download, Send, ExternalLink, Sparkles } from 'lucide-react';
import { triggerHaptic, openTelegramLink } from '../utils/telegram.js';

export function VideoPlayerModal({ video, onClose, botUsername }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    triggerHaptic('light');
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-bold text-white truncate max-w-[220px]">{video.title}</h3>
          </div>
          <button 
            onClick={() => { triggerHaptic('light'); onClose(); }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Buttons & Telegram Channel link */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-400">{video.description}</p>
          
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                triggerHaptic('medium');
                openTelegramLink(video.botUrl || `https://t.me/${botUsername}`);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>টেলিগ্রাম চ্যানেল থেকে ডাউনলোড</span>
            </button>

            <a
              href={video.videoUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition"
              title="Direct File Link"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}