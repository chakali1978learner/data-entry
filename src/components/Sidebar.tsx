import React from 'react';
import { ViewTab } from '../types';
import { 
  ListOrdered, 
  Layers, 
  History, 
  Settings2, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  autoSyncEnabled: boolean;
  onToggleAutoSync?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  autoSyncEnabled,
  onToggleAutoSync,
}) => {
  const navItems = [
    {
      id: 'ad-manager' as ViewTab,
      label: 'Active Ad Codes',
      icon: ListOrdered,
    },
    {
      id: 'batch-operations' as ViewTab,
      label: 'Batch Operations',
      icon: Layers,
    },
    {
      id: 'audit-logs' as ViewTab,
      label: 'Audit Logs',
      icon: History,
    },
    {
      id: 'sheet-settings' as ViewTab,
      label: 'Sheet Sync Config',
      icon: Settings2,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#ffffff] z-40 hidden md:flex flex-col justify-between shadow-[1px_0_8px_rgba(15,23,42,0.04)] border-r border-[#eff4ff]">
      <div className="p-4 flex flex-col gap-2">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#737686]">
          Operational Roster
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-[14px] text-left w-full ${
                  isActive
                    ? 'bg-[#1a56db] text-[#ffffff] font-semibold shadow-sm'
                    : 'text-[#434654] hover:bg-[#eff4ff] hover:text-[#0b1c30] font-normal'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-[#737686]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-[#eff4ff]/60 m-3 rounded-lg border border-[#dce9ff]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">Sync Engine</span>
          <span className="font-mono text-[12px] text-[#00687a] font-bold">v2.4.0</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#434654] text-[12px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00687a]" />
            <span>Autosave every 30s</span>
          </div>
          {onToggleAutoSync && (
            <button
              onClick={onToggleAutoSync}
              className="text-[10px] text-[#003fb1] hover:underline font-medium"
              title="Toggle Autosave"
            >
              {autoSyncEnabled ? 'Active' : 'Paused'}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
