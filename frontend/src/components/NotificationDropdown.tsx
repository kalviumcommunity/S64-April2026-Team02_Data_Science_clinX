import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, CheckCircle } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <Bell size={20} className="text-slate-500 group-hover:text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content shadow-sm">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Clinical Alerts</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">System clear. No alerts.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                    !n.isRead ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold leading-tight ${!n.isRead ? 'text-blue-900' : 'text-slate-700'}`}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex items-center mt-2 text-[10px] text-slate-400 font-medium">
                    <Clock size={10} className="mr-1" />
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <button className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold uppercase tracking-widest">
              View Audit Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
