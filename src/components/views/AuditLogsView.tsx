import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock,
  User,
  Trash2
} from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onClearLogs: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onClearLogs }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.user.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.details.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportLogs = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Target Ad Number', 'Revision', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      l.action,
      l.adNumber,
      l.revision,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#eff4ff]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#003fb1]">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0b1c30]">Immutable Audit Trail & Activity Logs</h1>
            <p className="text-[13px] text-[#737686]">
              Detailed record of every search, revision promotion, sheet creation, and webhook sync event
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            type="button"
            className="px-4 h-10 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003fb1] font-semibold text-[13px] flex items-center gap-2 border border-[#dce9ff] transition-all"
          >
            <Download className="w-4 h-4" />
            Export Logs (CSV)
          </button>
          <button
            onClick={onClearLogs}
            type="button"
            className="px-3 h-10 rounded-lg bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#93000a] text-[13px] font-medium flex items-center gap-1.5 transition-all"
            title="Clear Log History"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 border border-[#eff4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#737686] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ad code, operator, or details..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[13px] text-[#0b1c30] placeholder:text-[#737686] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
          />
        </div>

        {/* Action Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'UPDATE', 'CREATE', 'DELETE', 'SYNC', 'BATCH'].map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                actionFilter === action
                  ? 'bg-[#003fb1] text-white'
                  : 'bg-[#eff4ff] text-[#737686] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff]">
        <div className="overflow-x-auto border border-[#eff4ff] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#737686] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce9ff]">
                <th className="py-2.5 px-3.5">Timestamp</th>
                <th className="py-2.5 px-3.5">Action</th>
                <th className="py-2.5 px-3.5">Ad Number</th>
                <th className="py-2.5 px-3.5">Rev</th>
                <th className="py-2.5 px-3.5">Operator</th>
                <th className="py-2.5 px-3.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#0b1c30] divide-y divide-[#eff4ff]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#737686] text-[14px]">
                    No audit records match the current search filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let badgeStyle = 'bg-[#eff4ff] text-[#434654]';
                  if (log.action === 'CREATE') badgeStyle = 'bg-[#ecfdf5] text-[#065f46]';
                  if (log.action === 'UPDATE') badgeStyle = 'bg-[#e5eeff] text-[#003fb1]';
                  if (log.action === 'DELETE') badgeStyle = 'bg-[#ffdad6] text-[#93000a]';
                  if (log.action === 'SYNC') badgeStyle = 'bg-[#acedff]/60 text-[#004e5c]';

                  return (
                    <tr key={log.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#737686] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[12px] font-semibold text-[#003fb1]">
                        {log.adNumber}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[12px] text-[#737686]">
                        {log.revision > 0 ? `v${log.revision}` : '—'}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap text-[#434654]">
                        {log.user}
                      </td>
                      <td className="py-2.5 px-3.5 text-[#434654] font-medium leading-relaxed">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
