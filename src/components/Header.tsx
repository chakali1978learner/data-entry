import React, { useState } from 'react';
import { ViewTab } from '../types';
import { 
  Cloud, 
  BookOpen, 
  Bell, 
  User, 
  CheckCircle2, 
  Clock, 
  X,
  ExternalLink 
} from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenDocs: () => void;
  sheetId: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenDocs,
  sheetId,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Google Sheet Sync Verified',
      time: '2 mins ago',
      desc: 'Master Ad Registry (GID 1092237307) polled successfully. All 14 columns intact.',
      unread: true,
    },
    {
      id: '2',
      title: 'Revision Auto-Staged',
      time: '14 mins ago',
      desc: 'AD-2024-001 retrieved. Revision staged from v2 to v3 for editing.',
      unread: true,
    },
    {
      id: '3',
      title: 'Sync Engine Health: 100%',
      time: '1 hour ago',
      desc: 'Apps Script endpoint latency 142ms. Zero conflict errors detected.',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.06)] border-b border-[#eff4ff]">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img
            alt="Ad Number System Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UARY9btczwen5HWo6dsfKE8x8IBxfvnzI4Uw-wzs6KoSbhDGsC4YHgYnnGqCV_79zQs7ZEGS4Y38SkR90_wcD7zGd91ztFYbG2RtQE3Pm1eafK5NutYp9wMINUb_DJMl-jdb2X6HAwtT__VmEiqII5Lco9LIOd9DtQ12RV45-tLGD6sCowR9dTPd5Z9PAIgdT0OaZUeqfPQzXJUQ9kA4tM_oeA_NmsPzso1zH3shHGOQ3SdHZCOahfPXec"
          />
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold tracking-tight text-[#0b1c30] leading-none">
              Ad Number Management System
            </span>
            <span className="text-[11px] text-[#737686] font-semibold flex items-center gap-1 mt-0.5">
              <Cloud className="w-3.5 h-3.5 text-[#00687a]" />
              Google Sheets Live Sync
            </span>
          </div>
          {/* Live GID Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff] text-[#0b1c30] font-mono text-[12px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00687a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00687a]"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#00687a]">LIVE</span>
            <span className="text-[#c3c5d7] font-normal">|</span>
            <span
              className="text-[#434654] truncate max-w-[200px]"
              title={sheetId}
            >
              ID: {sheetId.substring(0, 10)}...
            </span>
          </div>
        </div>

        {/* Center: Main Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onTabChange('ad-manager')}
            className={`px-4 py-2 rounded text-[13px] font-semibold transition-colors ${
              currentTab === 'ad-manager'
                ? 'bg-[#dce9ff] text-[#003fb1]'
                : 'text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
            }`}
          >
            Ad Manager
          </button>
          <button
            onClick={() => onTabChange('batch-operations')}
            className={`px-4 py-2 rounded text-[13px] transition-colors ${
              currentTab === 'batch-operations'
                ? 'bg-[#dce9ff] text-[#003fb1] font-semibold'
                : 'text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] font-medium'
            }`}
          >
            Batch Operations
          </button>
          <button
            onClick={() => onTabChange('audit-logs')}
            className={`px-4 py-2 rounded text-[13px] transition-colors ${
              currentTab === 'audit-logs'
                ? 'bg-[#dce9ff] text-[#003fb1] font-semibold'
                : 'text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] font-medium'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => onTabChange('sheet-settings')}
            className={`px-4 py-2 rounded text-[13px] transition-colors ${
              currentTab === 'sheet-settings'
                ? 'bg-[#dce9ff] text-[#003fb1] font-semibold'
                : 'text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] font-medium'
            }`}
          >
            Sheet Settings
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 relative">
          {/* API Active Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#eff4ff] shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00687a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00687a]"></span>
            </span>
            <span className="text-[11px] text-[#434654] font-medium">API Active</span>
          </div>

          {/* Docs button */}
          <button
            onClick={onOpenDocs}
            className="inline-flex items-center justify-center w-8 h-8 rounded text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
            title="API & Schema Documentation"
            type="button"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex items-center justify-center w-8 h-8 rounded text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
              title="System Activity & Alerts"
              type="button"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-[#ffffff] rounded-xl shadow-xl border border-[#eff4ff] z-50 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#0b1c30]">System Activity Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ffdad6] text-[#93000a]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[#003fb1] hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-[12px] flex flex-col gap-0.5 ${
                        n.unread ? 'bg-[#eff4ff] border-l-2 border-[#003fb1]' : 'bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0b1c30]">{n.title}</span>
                        <span className="text-[10px] text-[#737686]">{n.time}</span>
                      </div>
                      <p className="text-[#434654] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between text-[11px] text-[#737686]">
                  <span>Live webhook socket connected</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#00687a] font-medium hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div 
            className="w-8 h-8 rounded-full bg-[#003fb1] flex items-center justify-center text-white shadow-[0_1px_3px_rgba(15,23,42,0.12)] cursor-pointer hover:bg-[#1a56db] transition-colors"
            title="Logged in as System Admin (chkumar@ekcs.co)"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
