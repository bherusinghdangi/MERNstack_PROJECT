import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, TrendingUp, TrendingDown, ShieldCheck, X } from "lucide-react";

const NotificationToast = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto flex items-start space-x-4 p-4 rounded-2xl bg-[#111] border border-white/10 backdrop-blur-xl shadow-2xl animate-fade-in w-80 overflow-hidden relative group"
        >
          <div className={`p-2 rounded-xl ${
            notif.type === 'HIKE' ? 'bg-green-500/10 text-green-400' :
            notif.type === 'DOWN' ? 'bg-red-500/10 text-red-400' :
            notif.type === 'VERIFICATION' ? 'bg-[#bef264]/10 text-[#bef264]' :
            'bg-blue-500/10 text-blue-400'
          }`}>
            {notif.type === 'HIKE' ? <TrendingUp size={20} /> :
             notif.type === 'DOWN' ? <TrendingDown size={20} /> :
             notif.type === 'VERIFICATION' ? <ShieldCheck size={20} /> :
             <Bell size={20} />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-0.5">
              {notif.type || 'Notification'}
            </p>
            <p className="text-sm text-white font-medium line-clamp-2">
              {notif.message}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 h-0.5 bg-[#bef264] animate-progress" />
        </div>
      ))}

      <style>
        {`
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          .animate-progress {
            animation: progress 5s linear forwards;
          }
        `}
      </style>
    </div>
  );
};

export default NotificationToast;
