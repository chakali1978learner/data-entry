import React, { useState } from 'react';
import { AdRecord, ChannelMedium, ApprovalStatus } from '../../types';
import { 
  Search, 
  ArrowRight, 
  PlusCircle, 
  RefreshCw, 
  Eraser, 
  Bolt, 
  Code, 
  Database, 
  Clock, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Lock, 
  Unlock, 
  User, 
  Link as LinkIcon, 
  RotateCcw, 
  Trash2, 
  Save, 
  FileEdit,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface AdManagerViewProps {
  records: AdRecord[];
  activeRecord: AdRecord | null;
  onSearch: (adNumber: string) => void;
  onSaveNew: (record: Omit<AdRecord, 'rowIndex'>) => void;
  onRequestUpdate: (formData: AdRecord) => void;
  onRequestDelete: (adNumber: string) => void;
  onResetToNew: () => void;
  onSyncSheet: () => void;
  onOpenDocs: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
  totalActiveRows: number;
}

export const AdManagerView: React.FC<AdManagerViewProps> = ({
  records,
  activeRecord,
  onSearch,
  onSaveNew,
  onRequestUpdate,
  onRequestDelete,
  onResetToNew,
  onSyncSheet,
  onOpenDocs,
  isSyncing,
  lastSyncTime,
  totalActiveRows,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isAdLocked, setIsAdLocked] = useState(false);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);

  // Form local state
  const [formData, setFormData] = useState<AdRecord>({
    rowIndex: activeRecord?.rowIndex || 0,
    adNumber: activeRecord?.adNumber || '',
    revision: activeRecord ? activeRecord.revision + 1 : 1,
    campaign: activeRecord?.campaign || '',
    client: activeRecord?.client || '',
    channel: activeRecord?.channel || 'Digital Display',
    dimensions: activeRecord?.dimensions || '',
    market: activeRecord?.market || '',
    startDate: activeRecord?.startDate || '',
    endDate: activeRecord?.endDate || '',
    owner: activeRecord?.owner || '',
    url: activeRecord?.url || '',
    status: activeRecord?.status || 'Draft',
    budget: activeRecord?.budget || '',
    notes: activeRecord?.notes || '',
  });

  // Keep form in sync when activeRecord changes
  React.useEffect(() => {
    if (activeRecord) {
      setFormData({
        ...activeRecord,
        revision: activeRecord.revision + 1, // Auto +1 on fetch rule
      });
      setIsAdLocked(true);
    } else {
      setFormData({
        rowIndex: 0,
        adNumber: '',
        revision: 1,
        campaign: '',
        client: '',
        channel: 'Digital Display',
        dimensions: '',
        market: '',
        startDate: '',
        endDate: '',
        owner: '',
        url: '',
        status: 'Draft',
        budget: '',
        notes: '',
      });
      setIsAdLocked(false);
    }
  }, [activeRecord]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(searchInput);
  };

  const handleQuickTest = (code: string) => {
    setSearchInput(code);
    onSearch(code);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedAdId(id);
    setTimeout(() => setCopiedAdId(null), 1500);
  };

  const isEditingExisting = activeRecord !== null;

  return (
    <div className="w-full px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Top Operational Search & Command Bar */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-5 lg:p-6 flex flex-col gap-4 border border-[#eff4ff]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Form Component */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl flex flex-col gap-1.5"
          >
            <label
              className="text-[11px] font-semibold uppercase tracking-wider text-[#737686] flex items-center gap-1.5"
              htmlFor="ad-search-input"
            >
              <Search className="w-3.5 h-3.5 text-[#003fb1]" />
              Enter Ad Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-[#737686]">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="ad-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. AD-2024-001 or AD-2024-8841"
                className="w-full h-12 pl-11 pr-28 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-mono text-[13px] placeholder:text-[#737686]/70 focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 shadow-inner transition-all border border-[#dce9ff]"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 h-9 rounded bg-[#003fb1] text-white text-[13px] font-semibold flex items-center gap-1.5 hover:bg-[#1a56db] transition-all active:scale-95 shadow-sm"
              >
                <span>Find</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Utility Fast Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            <button
              onClick={onResetToNew}
              type="button"
              className="px-4 h-10 rounded-lg bg-[#dce9ff] text-[#0b1c30] hover:bg-[#b5c4ff] transition-all text-[13px] font-semibold flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#003fb1]" />
              Add New Record
            </button>
            <button
              onClick={onSyncSheet}
              type="button"
              className="px-4 h-10 rounded-lg bg-[#dce9ff] text-[#0b1c30] hover:bg-[#acedff] transition-all text-[13px] font-semibold flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#00687a] ${isSyncing ? 'animate-spin' : ''}`}
              />
              Sync From Sheet
            </button>
            <button
              onClick={onResetToNew}
              type="button"
              className="px-4 h-10 rounded-lg bg-[#eff4ff] text-[#434654] hover:bg-[#d3e4fe] transition-all text-[13px] font-semibold flex items-center gap-2"
            >
              <Eraser className="w-4 h-4 text-[#737686]" />
              Reset / Clear Form
            </button>
          </div>
        </div>

        {/* Evaluator Quick Test Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[12px] border-t border-[#eff4ff]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737686] mr-1 flex items-center gap-1">
            <Bolt className="w-3.5 h-3.5 text-amber-500" /> Quick Test Roster:
          </span>
          <button
            type="button"
            onClick={() => handleQuickTest('AD-2024-001')}
            className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#003fb1] hover:bg-[#003fb1] hover:text-white transition-all font-mono text-[12px] font-medium"
          >
            AD-2024-001 (Nike)
          </button>
          <button
            type="button"
            onClick={() => handleQuickTest('AD-2024-002')}
            className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#003fb1] hover:bg-[#003fb1] hover:text-white transition-all font-mono text-[12px] font-medium"
          >
            AD-2024-002 (Spotify)
          </button>
          <button
            type="button"
            onClick={() => handleQuickTest('AD-2024-003')}
            className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#003fb1] hover:bg-[#003fb1] hover:text-white transition-all font-mono text-[12px] font-medium"
          >
            AD-2024-003 (Tesla)
          </button>
          <button
            type="button"
            onClick={() => handleQuickTest('AD-2024-999')}
            className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#737686] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-all font-mono text-[12px]"
          >
            AD-2024-999 (Non-existent)
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="ml-auto text-[#00687a] hover:text-[#0b1c30] flex items-center gap-1 text-[12px] font-semibold"
          >
            <Code className="w-4 h-4" />
            View Apps Script Webhook & Docs
          </button>
        </div>
      </div>

      {/* Live Google Sheet Status Telemetry Banner */}
      <div className="w-full bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#eff4ff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#0F9D58]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] font-semibold text-[#0b1c30]">
                Target Sheet: Master Ad Registry
              </span>
              <span className="px-2 py-0.5 rounded bg-[#dce9ff] font-mono text-[11px] text-[#737686]">
                GID: 1092237307
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#00687a] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00687a]"></span>
                Apps Script POST Endpoint Live
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#737686] text-[12px] mt-0.5">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                <strong className="font-semibold text-[#0b1c30]">
                  {totalActiveRows.toLocaleString()}
                </strong>{' '}
                active rows
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Last synced: <span>{lastSyncTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Action Banner Message Indicator */}
        <div className="px-4 py-2 rounded-lg bg-[#eff4ff] flex items-center gap-2 text-[#434654] text-[13px] border border-[#dce9ff]">
          <Info className="w-4 h-4 text-[#00687a] flex-shrink-0" />
          <span className="font-medium">
            {isEditingExisting
              ? `Loaded record ${activeRecord.adNumber}. Auto-staged revision from ${activeRecord.revision} → ${activeRecord.revision + 1}.`
              : 'System idle. Search an ad number or initiate a new campaign registration.'}
          </span>
        </div>
      </div>

      {/* Active Workspace & Record Details Card */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-[#eff4ff]">
        {/* Workspace Top Metadata Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 gap-4 border-b border-[#eff4ff]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">
                Active Ad ID:
              </span>
              <span className="px-3 py-1 rounded bg-[#dce9ff] text-[#003fb1] font-mono text-[16px] font-bold">
                {isEditingExisting ? activeRecord.adNumber : 'NEW RECORD'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#e5eeff] text-[#00687a] font-mono text-[12px]">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {isEditingExisting
                  ? `Revision ${activeRecord.revision} in Google Sheet → Auto-staged as Revision ${formData.revision}. Changes will only persist on Update.`
                  : 'Auto-staged for initial creation (Rev 1)'}
              </span>
            </div>
            <span
              className={`px-3 py-0.5 rounded-full font-semibold text-[11px] uppercase ${
                isEditingExisting
                  ? activeRecord.status === 'Live On Air'
                    ? 'bg-[#ecfdf5] text-[#065f46]'
                    : activeRecord.status === 'Approved'
                    ? 'bg-[#dbe1ff] text-[#00174d]'
                    : 'bg-[#e5eeff] text-[#003fb1]'
                  : 'bg-[#dce9ff] text-[#737686]'
              }`}
            >
              {isEditingExisting ? activeRecord.status : 'UNSAVED DRAFT'}
            </span>
          </div>

          {/* Audit Metadata Tracker */}
          <div className="flex items-center gap-3 text-[#737686] text-[12px]">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>System Admin</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isEditingExisting
                  ? `Sheet Row #${activeRecord.rowIndex} | Synchronized`
                  : 'Ready for staging'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAdLocked(!isAdLocked)}
              className="p-1 rounded hover:bg-[#eff4ff] text-[#737686] hover:text-[#0b1c30] transition-colors"
              title={isAdLocked ? 'Unlock Ad Number Input' : 'Lock Ad Number Input'}
            >
              {isAdLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Google Sheets Column Mapping Form Grid */}
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Column A: Ad Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30] flex items-center justify-between">
              <span>Ad Number (Col A) *</span>
              <span className="font-mono text-[11px] text-[#737686]">Unique ID</span>
            </label>
            <input
              name="adNumber"
              type="text"
              value={formData.adNumber}
              onChange={handleInputChange}
              readOnly={isAdLocked}
              placeholder="AD-YYYY-XXXX"
              required
              className={`h-10 px-3 rounded-lg text-[#0b1c30] font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-[#003fb1]/20 transition-all border ${
                isAdLocked
                  ? 'bg-[#dce9ff]/60 border-[#c3c5d7] cursor-not-allowed'
                  : 'bg-[#eff4ff] border-[#dce9ff] focus:bg-[#ffffff]'
              }`}
            />
          </div>

          {/* Column B: Revision Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30] flex items-center justify-between">
              <span>Revision (Col B)</span>
              <span className="font-mono text-[11px] text-[#00687a] font-semibold">Auto +1 on Fetch</span>
            </label>
            <div className="relative flex items-center">
              <input
                name="revision"
                type="number"
                value={formData.revision}
                readOnly
                className="w-full h-10 px-3 rounded-lg bg-[#dce9ff]/60 border border-[#c3c5d7] text-[#0b1c30] font-mono text-[12px] cursor-not-allowed"
              />
              <span className="absolute right-3 text-[11px] font-semibold text-[#737686]">
                {isEditingExisting ? `Stored: Rev ${activeRecord.revision}` : 'Stored: None'}
              </span>
            </div>
          </div>

          {/* Column C: Campaign Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Campaign Name (Col C) *
            </label>
            <input
              name="campaign"
              type="text"
              value={formData.campaign}
              onChange={handleInputChange}
              placeholder="e.g. Summer Momentum 2024"
              required
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column D: Client / Brand */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Client / Brand (Col D) *
            </label>
            <input
              name="client"
              type="text"
              value={formData.client}
              onChange={handleInputChange}
              placeholder="e.g. Nike Global Athletics"
              required
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column E: Channel / Medium */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Channel / Medium (Col E)
            </label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleInputChange}
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            >
              <option value="Digital Display">Digital Display</option>
              <option value="Paid Social">Paid Social</option>
              <option value="Broadcast TV">Broadcast TV</option>
              <option value="Connected TV (CTV)">Connected TV (CTV)</option>
              <option value="Outdoor / Billboard">Outdoor / Billboard</option>
              <option value="Streaming Audio">Streaming Audio</option>
              <option value="Print Magazine">Print Magazine</option>
            </select>
          </div>

          {/* Column F: Ad Format / Dimensions */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Format / Dimensions (Col F)
            </label>
            <input
              name="dimensions"
              type="text"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="e.g. 300x250, 1080x1920 (9:16)"
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column G: Target Market / Region */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Target Market (Col G)
            </label>
            <input
              name="market"
              type="text"
              value={formData.market}
              onChange={handleInputChange}
              placeholder="e.g. NA - US West, EMEA UK"
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column H: Flight Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Flight Start Date (Col H)
            </label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column I: Flight End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Flight End Date (Col I)
            </label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column J: Creative Lead / Owner */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Creative Lead (Col J)
            </label>
            <input
              name="owner"
              type="text"
              value={formData.owner}
              onChange={handleInputChange}
              placeholder="e.g. Sarah Jenkins (Design Dir)"
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            />
          </div>

          {/* Column L: Approval Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Approval Status (Col L)
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="h-10 px-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
            >
              <option value="Draft">Draft</option>
              <option value="Pending Client">Pending Client</option>
              <option value="Legal Review">Legal Review</option>
              <option value="Approved">Approved</option>
              <option value="Live On Air">Live On Air</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Column M: Budget Cap */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Budget Cap (Col M)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-mono text-[12px] text-[#737686]">$</span>
              <input
                name="budget"
                type="text"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="45,000.00"
                className="w-full h-10 pl-7 pr-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-mono text-[12px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
              />
            </div>
          </div>

          {/* Column K: Destination URL (Spans 2 cols on lg) */}
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Destination URL / Click Tag (Col K)
            </label>
            <div className="relative flex items-center">
              <input
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://brand.com/campaign?utm_source=sheet_sync"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-mono text-[12px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all"
              />
              <LinkIcon className="w-4 h-4 absolute left-3 text-[#737686]" />
            </div>
          </div>

          {/* Column N: Notes / Delivery Instructions (Spans 2 cols on lg) */}
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[12px] font-semibold text-[#0b1c30]">
              Notes / Delivery Instructions (Col N)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={1}
              placeholder="Audio loudness -24 LKFS, ProRes 422 HQ master required..."
              className="h-10 px-3 py-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[13px] focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003fb1]/20 transition-all resize-none"
            />
          </div>
        </form>

        {/* Primary Action & Operation Button Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#eff4ff]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Clear Form Button */}
            <button
              onClick={onResetToNew}
              type="button"
              className="w-full sm:w-auto px-4 h-10 rounded-lg bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff] transition-all text-[13px] font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-[#737686]" />
              <span>Clear Form</span>
            </button>

            {/* Delete Record Button */}
            <button
              onClick={() => isEditingExisting && onRequestDelete(activeRecord.adNumber)}
              disabled={!isEditingExisting}
              type="button"
              className="w-full sm:w-auto px-4 h-10 rounded-lg bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white transition-all text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Record</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Search Button in Bar */}
            <button
              onClick={() => onSearch(formData.adNumber || searchInput)}
              type="button"
              className="px-4 h-10 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] transition-all text-[13px] font-semibold flex items-center gap-1.5 border border-[#dce9ff]"
            >
              <Search className="w-4 h-4 text-[#737686]" />
              <span>Search</span>
            </button>

            {/* Save New Record Button */}
            <button
              onClick={() => onSaveNew(formData)}
              disabled={isEditingExisting}
              type="button"
              className="px-6 h-10 rounded-lg bg-[#003fb1] text-white hover:bg-[#1a56db] transition-all text-[13px] font-semibold flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save New Record</span>
            </button>

            {/* Update Record Button */}
            <button
              onClick={() => isEditingExisting && onRequestUpdate(formData)}
              disabled={!isEditingExisting}
              type="button"
              className="px-6 h-10 rounded-lg bg-[#00687a] text-white hover:bg-[#004e5c] transition-all text-[13px] font-semibold flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileEdit className="w-4 h-4" />
              <span>Update Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Registered Roster Inspection Table */}
      <div className="w-full bg-[#ffffff] rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-[#eff4ff]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[18px] font-semibold text-[#0b1c30]">
              Registered Ad Inventory (Google Sheet Cached View)
            </h2>
            <p className="text-[12px] text-[#737686]">
              Live synchronized snapshot of columns A through N
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] px-3 py-1 rounded bg-[#eff4ff] text-[#737686] border border-[#dce9ff]">
              Showing <span className="font-semibold text-[#0b1c30]">{records.length}</span> items
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#eff4ff] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#737686] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce9ff]">
                <th className="py-2.5 px-3.5">Ad Number</th>
                <th className="py-2.5 px-3.5">Rev</th>
                <th className="py-2.5 px-3.5">Campaign</th>
                <th className="py-2.5 px-3.5">Client / Brand</th>
                <th className="py-2.5 px-3.5">Medium</th>
                <th className="py-2.5 px-3.5">Flight Window</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#0b1c30] divide-y divide-[#eff4ff]">
              {records.map((rec) => (
                <tr
                  key={rec.adNumber}
                  className={`hover:bg-[#eff4ff]/60 transition-colors ${
                    activeRecord?.adNumber === rec.adNumber ? 'bg-[#e5eeff]/50' : ''
                  }`}
                >
                  <td className="py-2.5 px-3.5 font-mono text-[12px] font-semibold text-[#003fb1]">
                    <div className="flex items-center gap-1.5">
                      <span>{rec.adNumber}</span>
                      <button
                        onClick={() => handleCopyId(rec.adNumber)}
                        className="text-[#737686] hover:text-[#003fb1] transition-colors p-0.5"
                        title="Copy Ad ID"
                      >
                        {copiedAdId === rec.adNumber ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-[12px] text-[#737686]">
                    v{rec.revision}
                  </td>
                  <td className="py-2.5 px-3.5 font-medium max-w-xs truncate" title={rec.campaign}>
                    {rec.campaign}
                  </td>
                  <td className="py-2.5 px-3.5">{rec.client}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] text-[#434654] font-medium">
                      {rec.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#737686]">
                    {rec.startDate || '—'} / {rec.endDate || '—'}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        rec.status === 'Live On Air'
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : rec.status === 'Approved'
                          ? 'bg-[#dbe1ff] text-[#00174d]'
                          : rec.status === 'Pending Client'
                          ? 'bg-[#eff4ff] text-[#737686]'
                          : 'bg-[#eff4ff] text-[#434654]'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <button
                      onClick={() => onSearch(rec.adNumber)}
                      className="px-3 py-1 rounded bg-[#e5eeff] hover:bg-[#003fb1] hover:text-white text-[12px] font-semibold transition-all shadow-sm"
                    >
                      Load Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
