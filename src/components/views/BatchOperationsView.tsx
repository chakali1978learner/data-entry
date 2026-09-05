import React, { useState } from 'react';
import { AdRecord, ApprovalStatus } from '../../types';
import { 
  Layers, 
  Upload, 
  Download, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  FileSpreadsheet, 
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';

interface BatchOperationsViewProps {
  records: AdRecord[];
  onBatchUpdateStatus: (adNumbers: string[], newStatus: ApprovalStatus) => void;
  onBatchIncrementRevision: (adNumbers: string[]) => void;
  onBatchImportRecords: (newRecords: AdRecord[]) => void;
}

export const BatchOperationsView: React.FC<BatchOperationsViewProps> = ({
  records,
  onBatchUpdateStatus,
  onBatchIncrementRevision,
  onBatchImportRecords,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targetStatus, setTargetStatus] = useState<ApprovalStatus>('Approved');
  const [bulkTextInput, setBulkTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'selection' | 'quick-generator'>('selection');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map((r) => r.adNumber));
    }
  };

  const handleApplyStatus = () => {
    if (selectedIds.length === 0) return;
    onBatchUpdateStatus(selectedIds, targetStatus);
    setSelectedIds([]);
  };

  const handleApplyRevisionBump = () => {
    if (selectedIds.length === 0) return;
    onBatchIncrementRevision(selectedIds);
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    const headers = [
      'Ad Number (Col A)',
      'Revision (Col B)',
      'Campaign (Col C)',
      'Client (Col D)',
      'Channel (Col E)',
      'Dimensions (Col F)',
      'Market (Col G)',
      'Start Date (Col H)',
      'End Date (Col I)',
      'Creative Lead (Col J)',
      'Destination URL (Col K)',
      'Status (Col L)',
      'Budget (Col M)',
      'Notes (Col N)',
    ];

    const rows = records.map((r) => [
      `"${r.adNumber}"`,
      r.revision,
      `"${r.campaign.replace(/"/g, '""')}"`,
      `"${r.client.replace(/"/g, '""')}"`,
      `"${r.channel}"`,
      `"${r.dimensions}"`,
      `"${r.market}"`,
      r.startDate,
      r.endDate,
      `"${r.owner}"`,
      `"${r.url}"`,
      `"${r.status}"`,
      `"${r.budget}"`,
      `"${r.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Ad_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickImport = () => {
    if (!bulkTextInput.trim()) return;

    const lines = bulkTextInput.split('\n').filter((l) => l.trim().length > 0);
    const imported: AdRecord[] = lines.map((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      const adNumber = parts[0] || `AD-2024-${String(records.length + idx + 10).padStart(3, '0')}`;
      const campaign = parts[1] || 'Batch Import Campaign';
      const client = parts[2] || 'Enterprise Client';
      const channel = (parts[3] as any) || 'Digital Display';

      return {
        rowIndex: records.length + idx + 2,
        adNumber: adNumber.toUpperCase(),
        revision: 1,
        campaign,
        client,
        channel,
        dimensions: '300x250',
        market: 'National',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        owner: 'Batch Operator',
        url: 'https://client.com',
        status: 'Draft',
        budget: '25,000.00',
        notes: 'Bulk created via Batch Operations portal.',
      };
    });

    onBatchImportRecords(imported);
    setBulkTextInput('');
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#eff4ff]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#003fb1]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0b1c30]">Batch Operations & Bulk Roster</h1>
            <p className="text-[13px] text-[#737686]">
              Perform bulk status transitions, revision increments, and CSV exports across the Google Sheets registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            type="button"
            className="px-4 h-10 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003fb1] font-semibold text-[13px] flex items-center gap-2 border border-[#dce9ff] transition-all"
          >
            <Download className="w-4 h-4" />
            Export Registry CSV
          </button>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex gap-2 border-b border-[#dce9ff]">
        <button
          onClick={() => setActiveTab('selection')}
          className={`pb-2.5 px-4 text-[13px] font-semibold border-b-2 transition-all ${
            activeTab === 'selection'
              ? 'border-[#003fb1] text-[#003fb1]'
              : 'border-transparent text-[#737686] hover:text-[#0b1c30]'
          }`}
        >
          Selected Roster Actions ({selectedIds.length})
        </button>
        <button
          onClick={() => setActiveTab('quick-generator')}
          className={`pb-2.5 px-4 text-[13px] font-semibold border-b-2 transition-all ${
            activeTab === 'quick-generator'
              ? 'border-[#003fb1] text-[#003fb1]'
              : 'border-transparent text-[#737686] hover:text-[#0b1c30]'
          }`}
        >
          Bulk Line Generator / CSV Injector
        </button>
      </div>

      {activeTab === 'selection' ? (
        <div className="flex flex-col gap-4">
          {/* Operations Bar for Selected Items */}
          <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#eff4ff] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                {selectedIds.length} of {records.length} records selected
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-[12px] text-[#003fb1] hover:underline font-medium"
              >
                {selectedIds.length === records.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#737686]">Change Status:</span>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ApprovalStatus)}
                  className="h-9 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[12px] font-medium text-[#0b1c30]"
                >
                  <option value="Approved">Approved</option>
                  <option value="Live On Air">Live On Air</option>
                  <option value="Pending Client">Pending Client</option>
                  <option value="Legal Review">Legal Review</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                </select>
                <button
                  onClick={handleApplyStatus}
                  disabled={selectedIds.length === 0}
                  className="px-3.5 h-9 rounded-lg bg-[#003fb1] text-white hover:bg-[#1a56db] text-[12px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply Status
                </button>
              </div>

              <div className="h-6 w-px bg-[#dce9ff]"></div>

              <button
                onClick={handleApplyRevisionBump}
                disabled={selectedIds.length === 0}
                className="px-3.5 h-9 rounded-lg bg-[#00687a] text-white hover:bg-[#004e5c] text-[12px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Increment Revision (+1)</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff]">
            <div className="overflow-x-auto border border-[#eff4ff] rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#737686] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce9ff]">
                    <th className="py-2.5 px-3.5 w-10">
                      <button onClick={toggleSelectAll} className="flex items-center text-[#003fb1]">
                        {selectedIds.length === records.length ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-2.5 px-3.5">Ad Number</th>
                    <th className="py-2.5 px-3.5">Rev</th>
                    <th className="py-2.5 px-3.5">Campaign Name</th>
                    <th className="py-2.5 px-3.5">Client</th>
                    <th className="py-2.5 px-3.5">Channel</th>
                    <th className="py-2.5 px-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[#0b1c30] divide-y divide-[#eff4ff]">
                  {records.map((r) => {
                    const isSelected = selectedIds.includes(r.adNumber);
                    return (
                      <tr
                        key={r.adNumber}
                        onClick={() => toggleSelect(r.adNumber)}
                        className={`hover:bg-[#eff4ff]/60 cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#e5eeff]/50' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#003fb1]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#737686]" />
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-[12px] font-semibold text-[#003fb1]">
                          {r.adNumber}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-[12px] text-[#737686]">
                          v{r.revision}
                        </td>
                        <td className="py-2.5 px-3.5 font-medium">{r.campaign}</td>
                        <td className="py-2.5 px-3.5">{r.client}</td>
                        <td className="py-2.5 px-3.5">{r.channel}</td>
                        <td className="py-2.5 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              r.status === 'Live On Air'
                                ? 'bg-[#ecfdf5] text-[#065f46]'
                                : r.status === 'Approved'
                                ? 'bg-[#dbe1ff] text-[#00174d]'
                                : 'bg-[#eff4ff] text-[#434654]'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff] flex flex-col gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0b1c30]">Paste Bulk Lines (CSV Format)</h3>
            <p className="text-[12px] text-[#737686]">
              Input format: <code className="font-mono bg-[#eff4ff] px-1 rounded">AD-NUMBER, CAMPAIGN NAME, CLIENT, CHANNEL</code> (one per line)
            </p>
          </div>

          <textarea
            value={bulkTextInput}
            onChange={(e) => setBulkTextInput(e.target.value)}
            placeholder="AD-2024-004, Summer Olympics Brand Push, Omega Watches, Broadcast TV&#10;AD-2024-005, Back To School Blitz, Target Stores, Paid Social&#10;AD-2024-006, Autumn EV Drive, Rivian Automotive, Digital Display"
            rows={8}
            className="w-full p-4 rounded-lg bg-[#eff4ff] border border-[#dce9ff] font-mono text-[12px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20 leading-relaxed"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-[12px] text-[#737686]">
              All injected records will default to Rev 1 and be appended into the Master Sheet.
            </span>
            <button
              onClick={handleQuickImport}
              type="button"
              className="px-6 h-10 rounded-lg bg-[#003fb1] text-white hover:bg-[#1a56db] text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import & Stage Records</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
