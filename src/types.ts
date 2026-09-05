export type ChannelMedium =
  | 'Digital Display'
  | 'Paid Social'
  | 'Broadcast TV'
  | 'Connected TV (CTV)'
  | 'Outdoor / Billboard'
  | 'Streaming Audio'
  | 'Print Magazine';

export type ApprovalStatus =
  | 'Draft'
  | 'Pending Client'
  | 'Legal Review'
  | 'Approved'
  | 'Live On Air'
  | 'Expired';

export interface AdRecord {
  rowIndex: number;
  adNumber: string; // Col A
  revision: number; // Col B
  campaign: string; // Col C
  client: string; // Col D
  channel: ChannelMedium; // Col E
  dimensions: string; // Col F
  market: string; // Col G
  startDate: string; // Col H
  endDate: string; // Col I
  owner: string; // Col J
  url: string; // Col K
  status: ApprovalStatus; // Col L
  budget: string; // Col M
  notes: string; // Col N
  lastModified?: string;
  modifiedBy?: string;
}

export type ViewTab = 'ad-manager' | 'batch-operations' | 'audit-logs' | 'sheet-settings';

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'SEARCH' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC' | 'BATCH';
  adNumber: string;
  revision: number;
  details: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

export interface SheetConfig {
  endpointUrl: string;
  sheetId: string;
  gid: string;
  sheetName: string;
  autoSyncEnabled: boolean;
  autoSyncSeconds: number;
  lastSyncTime: string;
  totalActiveRows: number;
}
