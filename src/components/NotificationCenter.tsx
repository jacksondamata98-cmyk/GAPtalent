import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Heart, MessageSquare, Award, Megaphone, ShieldCheck, Sparkles } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'interactions' | 'system'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'interactions') return n.type === 'like' || n.type === 'comment' || n.type === 'comment_approved';
    if (filter === 'system') return n.type === 'announcement' || n.type === 'ranking' || n.type === 'system' || n.type === 'talent_approval';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'comment':
      case 'comment_approved':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'ranking':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-300" />;
      case 'talent_approval':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed sm:absolute top-16 sm:top-auto right-2 sm:right-0 mt-2 w-96 max-w-[95vw] sm:max-w-[92vw] bg-stone-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-stone-100 text-sm">Notificações</h3>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
            {notifications.filter(n => !n.read).length} novas
          </span>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          title="Marcar todas como lidas"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Marcar lidas
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 gap-4 border-b border-stone-800 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            filter === 'all'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('interactions')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            filter === 'interactions'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Interações
        </button>
        <button
          onClick={() => setFilter('system')}
          className={`pb-2 font-medium transition-colors border-b-2 ${
            filter === 'system'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Talent Hub & Alertas
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-stone-800/60">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            Nenhuma notificação no momento.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                onClose();
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-stone-800/50 cursor-pointer transition-colors ${
                !item.read ? 'bg-amber-950/20 border-l-2 border-amber-400' : ''
              }`}
            >
              <div className="relative shrink-0 mt-0.5">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                    {getIcon(item.type)}
                  </div>
                )}
                {item.avatar && (
                  <div className="absolute -bottom-1 -right-1 bg-stone-900 rounded-full p-0.5 border border-stone-700">
                    {getIcon(item.type)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-stone-200 truncate">{item.title}</h4>
                  <span className="text-[10px] text-stone-500 whitespace-nowrap">{item.timestamp}</span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5 leading-relaxed break-words">{item.message}</p>
              </div>

              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-stone-950/80 border-t border-stone-800 text-center">
        <button
          onClick={onClose}
          className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
