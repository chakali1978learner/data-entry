import React, { useState } from 'react';
import { SheetConfig } from '../../types';
import { 
  Settings2, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Table, 
  ShieldCheck, 
  ExternalLink,
  Code,
  Save
} from 'lucide-react';

interface SheetSettingsViewProps {
  config: SheetConfig;
  onUpdateConfig: (newConfig: SheetConfig) => void;
  onTestConnection: () => void;
  isTesting: boolean;
  testResult: { success: boolean; latency: number; message: string } | null;
  onOpenDocs: () => void;
}

export const SheetSettingsView: React.FC<SheetSettingsViewProps> = ({
  config,
  onUpdateConfig,
  onTestConnection,
  isTesting,
  testResult,
  onOpenDocs,
}) => {
  const [formData, setFormData] = useState<SheetConfig>({ ...config });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const schemaColumns = [
    { col: 'A', name: 'Ad Number', key: 'adNumber', type: 'String (Code)', req: 'Yes (Unique ID)', desc: 'Primary key (e.g. AD-YYYY-XXXX)' },
    { col: 'B', name: 'Revision', key: 'revision', type: 'Integer', req: 'Auto-managed', desc: 'Revision number auto +1 on fetch for edits' },
    { col: 'C', name: 'Campaign Name', key: 'campaign', type: 'String', req: 'Yes', desc: 'Campaign brand flight title' },
    { col: 'D', name: 'Client / Brand', key: 'client', type: 'String', req: 'Yes', desc: 'Brand or enterprise advertiser name' },
    { col: 'E', name: 'Channel / Medium', key: 'channel', type: 'Enum', req: 'Optional', desc: 'Digital Display, Paid Social, Broadcast TV, etc.' },
    { col: 'F', name: 'Format / Dimensions', key: 'dimensions', type: 'String', req: 'Optional', desc: 'Resolution / aspect ratio specs' },
    { col: 'G', name: 'Target Market', key: 'market', type: 'String', req: 'Optional', desc: 'Designated geographic region or DMA' },
    { col: 'H', name: 'Flight Start Date', key: 'startDate', type: 'Date (ISO)', req: 'Optional', desc: 'Start of ad flight period' },
    { col: 'I', name: 'Flight End Date', key: 'endDate', type: 'Date (ISO)', req: 'Optional', desc: 'End of ad flight period' },
    { col: 'J', name: 'Creative Lead', key: 'owner', type: 'String', req: 'Optional', desc: 'Director or creative owner' },
    { col: 'K', name: 'Destination URL', key: 'url', type: 'URL', req: 'Optional', desc: 'Click tag destination or preview link' },
    { col: 'L', name: 'Approval Status', key: 'status', type: 'Enum', req: 'Optional', desc: 'Draft, Pending Client, Approved, Live On Air, etc.' },
    { col: 'M', name: 'Budget Cap', key: 'budget', type: 'Currency', req: 'Optional', desc: 'Total allocated financial spend cap' },
    { col: 'N', name: 'Notes / Delivery Specs', key: 'notes', type: 'Text (Multi-line)', req: 'Optional', desc: 'Technical audio/video mastering instructions' },
  ];

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#eff4ff]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#003fb1]">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0b1c30]">Google Sheets Live Sync Configuration</h1>
            <p className="text-[13px] text-[#737686]">
              Manage webhook endpoints, sheet IDs, automatic background synchronizations, and column A-N schemas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDocs}
            type="button"
            className="px-4 h-10 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00687a] font-semibold text-[13px] flex items-center gap-2 border border-[#dce9ff] transition-all"
          >
            <Code className="w-4 h-4" />
            Apps Script Code & Docs
          </button>
        </div>
      </div>

      {/* Configuration Form & Connection Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff] flex flex-col gap-5">
          <h2 className="text-[16px] font-bold text-[#0b1c30] border-b border-[#eff4ff] pb-3">
            Google Sheets Endpoint Parameters
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Apps Script Webhook Endpoint URL
            </label>
            <input
              type="url"
              name="endpointUrl"
              value={formData.endpointUrl}
              onChange={handleChange}
              required
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-mono text-[12px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
            />
            <span className="text-[11px] text-[#737686]">
              Target Web App deployment URL published with access enabled for Anyone
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b1c30]">
                Google Sheet ID
              </label>
              <input
                type="text"
                name="sheetId"
                value={formData.sheetId}
                onChange={handleChange}
                required
                className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-mono text-[12px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b1c30]">
                Target Sheet GID
              </label>
              <input
                type="text"
                name="gid"
                value={formData.gid}
                onChange={handleChange}
                required
                className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-mono text-[12px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b1c30]">
                Spreadsheet Tab Name
              </label>
              <input
                type="text"
                name="sheetName"
                value={formData.sheetName}
                onChange={handleChange}
                required
                className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b1c30]">
                Background Auto-sync Cadence
              </label>
              <select
                name="autoSyncSeconds"
                value={formData.autoSyncSeconds}
                onChange={handleChange}
                className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20"
              >
                <option value={15}>Every 15 seconds (High Frequency)</option>
                <option value={30}>Every 30 seconds (Recommended Default)</option>
                <option value={60}>Every 1 minute</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#eff4ff]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="autoSyncEnabled"
                checked={formData.autoSyncEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#003fb1] focus:ring-0"
              />
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                Enable Automatic Live Sync Polling
              </span>
            </label>

            <button
              type="submit"
              className="px-6 h-10 rounded-lg bg-[#003fb1] text-white hover:bg-[#1a56db] text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Config Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>

        {/* Right 1 Col: Test & Telemetry Diagnostics */}
        <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff] flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#00687a]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-[15px] font-bold text-[#0b1c30]">Webhook Connectivity Check</h3>
            </div>

            <p className="text-[12px] text-[#737686] leading-relaxed">
              Verify bidirectional connectivity between this workstation interface and the Google Apps Script POST endpoint.
            </p>

            <div className="p-4 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex flex-col gap-2 font-mono text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#737686]">Status:</span>
                <span className="font-bold text-[#00687a]">CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737686]">Active Rows:</span>
                <span className="font-bold text-[#0b1c30]">{config.totalActiveRows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737686]">Sync Status:</span>
                <span className="text-[#00687a]">Idle (Poll ready)</span>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-[12px] flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                    : 'bg-[#ffdad6] text-[#93000a] border border-[#fecaca]'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {testResult.success ? 'Endpoint Responded 200 OK' : 'Connection Timeout'}
                  </div>
                  <div className="text-[11px] opacity-90">{testResult.message}</div>
                  <div className="text-[10px] mt-0.5 opacity-75 font-mono">
                    Roundtrip Latency: {testResult.latency}ms
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onTestConnection}
            disabled={isTesting}
            className="w-full h-10 rounded-lg bg-[#00687a] text-white hover:bg-[#004e5c] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Endpoint...' : 'Ping Webhook Endpoint'}</span>
          </button>
        </div>
      </div>

      {/* Schema Mapping Table (Columns A - N) */}
      <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 border border-[#eff4ff] flex flex-col gap-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#0b1c30]">Google Sheets Master Schema (Columns A through N)</h3>
          <p className="text-[12px] text-[#737686]">
            Strict structural definition mapped between UI fields and the Google Sheet Master Ad Registry
          </p>
        </div>

        <div className="overflow-x-auto border border-[#eff4ff] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#737686] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce9ff]">
                <th className="py-2.5 px-3.5 w-16">Col</th>
                <th className="py-2.5 px-3.5">Sheet Header</th>
                <th className="py-2.5 px-3.5">Internal Key</th>
                <th className="py-2.5 px-3.5">Data Type</th>
                <th className="py-2.5 px-3.5">Requirement</th>
                <th className="py-2.5 px-3.5">Notes & Operational Rules</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#0b1c30] divide-y divide-[#eff4ff]">
              {schemaColumns.map((col) => (
                <tr key={col.col} className="hover:bg-[#eff4ff]/60 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono text-[12px] font-bold text-[#003fb1]">
                    Col {col.col}
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-[#0b1c30]">{col.name}</td>
                  <td className="py-2.5 px-3.5 font-mono text-[12px] text-[#737686]">{col.key}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] text-[#434654] font-medium">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        col.req.includes('Yes')
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : col.req.includes('Auto')
                          ? 'bg-[#dbe1ff] text-[#00174d]'
                          : 'bg-[#eff4ff] text-[#737686]'
                      }`}
                    >
                      {col.req}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-[#434654] text-[12px]">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
