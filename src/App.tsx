import React, { useState, useEffect } from 'react';
import { 
  AdRecord, 
  AuditLog, 
  SheetConfig, 
  ToastMessage, 
  ViewTab, 
  ApprovalStatus 
} from './types';
import { 
  INITIAL_RECORDS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SHEET_CONFIG 
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { AdManagerView } from './components/views/AdManagerView';
import { BatchOperationsView } from './components/views/BatchOperationsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SheetSettingsView } from './components/views/SheetSettingsView';
import { UpdateConfirmModal } from './components/modals/UpdateConfirmModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { GasDocsModal } from './components/modals/GasDocsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('ad-manager');
  const [records, setRecords] = useState<AdRecord[]>(INITIAL_RECORDS);
  const [activeRecord, setActiveRecord] = useState<AdRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(INITIAL_SHEET_CONFIG);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    latency: number;
    message: string;
  } | null>(null);

  // Modals state
  const [isGasDocsOpen, setIsGasDocsOpen] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<{
    isOpen: boolean;
    pendingRecord: AdRecord | null;
  }>({
    isOpen: false,
    pendingRecord: null,
  });
  const [deleteModalData, setDeleteModalData] = useState<{
    isOpen: boolean;
    adNumber: string;
  }>({
    isOpen: false,
    adNumber: '',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (
    action: AuditLog['action'],
    adNumber: string,
    revision: number,
    details: string,
    type: AuditLog['type'] = 'success'
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'System Admin (chkumar@ekcs.co)',
      action,
      adNumber,
      revision,
      details,
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Search Ad Number logic
  const handleSearch = (queryCode: string) => {
    const code = (queryCode || '').trim();
    if (!code) {
      showToast('Please enter an Ad Number to search.', 'warning');
      return;
    }

    const found = records.find((r) => r.adNumber.toUpperCase() === code.toUpperCase());

    if (found) {
      setActiveRecord({ ...found });
      showToast('Advertisement record found successfully.', 'success');
      addAuditLog(
        'SEARCH',
        found.adNumber,
        found.revision,
        `Retrieved record ${found.adNumber} (Rev ${found.revision}) from Row #${found.rowIndex}. Staged for Rev ${found.revision + 1}.`,
        'success'
      );
    } else {
      showToast('No record found for this Ad Number.', 'error');
      setActiveRecord(null);
      addAuditLog(
        'SEARCH',
        code.toUpperCase(),
        0,
        `Lookup failed for "${code}". No matching row located in sheet columns A-N.`,
        'warning'
      );
    }
  };

  // Save new record
  const handleSaveNew = (formData: Omit<AdRecord, 'rowIndex'>) => {
    const code = (formData.adNumber || '').trim();
    const campaign = (formData.campaign || '').trim();
    const client = (formData.client || '').trim();

    if (!code || !campaign || !client) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    const duplicate = records.some((r) => r.adNumber.toUpperCase() === code.toUpperCase());
    if (duplicate) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    const newRecord: AdRecord = {
      ...formData,
      rowIndex: records.length + 2,
      adNumber: code.toUpperCase(),
      revision: 1,
      campaign,
      client,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      modifiedBy: 'System Admin',
    };

    setRecords((prev) => [...prev, newRecord]);
    setActiveRecord(newRecord);
    setSheetConfig((prev) => ({
      ...prev,
      totalActiveRows: prev.totalActiveRows + 1,
      lastSyncTime: 'Just now',
    }));

    showToast('New advertisement record added successfully.', 'success');
    addAuditLog(
      'CREATE',
      newRecord.adNumber,
      1,
      `Appended new ad ${newRecord.adNumber} to Master Ad Registry at row #${newRecord.rowIndex}. Campaign: "${newRecord.campaign}".`
    );
  };

  // Request update (opens modal)
  const handleRequestUpdate = (formData: AdRecord) => {
    if (!activeRecord) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }
    setUpdateModalData({
      isOpen: true,
      pendingRecord: formData,
    });
  };

  // Confirm update
  const handleConfirmUpdate = () => {
    if (!updateModalData.pendingRecord || !activeRecord) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    const pending = updateModalData.pendingRecord;
    const targetRev = pending.revision;

    setRecords((prev) =>
      prev.map((r) =>
        r.adNumber === activeRecord.adNumber
          ? {
              ...pending,
              rowIndex: r.rowIndex,
              revision: targetRev,
              lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
              modifiedBy: 'System Admin',
            }
          : r
      )
    );

    const updatedRecord: AdRecord = {
      ...pending,
      rowIndex: activeRecord.rowIndex,
      revision: targetRev,
    };

    setActiveRecord(updatedRecord);
    setUpdateModalData({ isOpen: false, pendingRecord: null });
    setSheetConfig((prev) => ({ ...prev, lastSyncTime: 'Just now' }));

    showToast('Advertisement record updated successfully.', 'success');
    addAuditLog(
      'UPDATE',
      activeRecord.adNumber,
      targetRev,
      `Committed Revision ${targetRev} (previously Rev ${activeRecord.revision}) into Sheet Row #${activeRecord.rowIndex}. Status: ${pending.status}.`
    );
  };

  // Request delete (opens modal)
  const handleRequestDelete = (adNumber: string) => {
    setDeleteModalData({
      isOpen: true,
      adNumber,
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    const targetCode = deleteModalData.adNumber;
    if (!targetCode) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    setRecords((prev) => prev.filter((r) => r.adNumber !== targetCode));
    setActiveRecord(null);
    setDeleteModalData({ isOpen: false, adNumber: '' });
    setSheetConfig((prev) => ({
      ...prev,
      totalActiveRows: Math.max(0, prev.totalActiveRows - 1),
      lastSyncTime: 'Just now',
    }));

    showToast('Advertisement record removed successfully.', 'success');
    addAuditLog(
      'DELETE',
      targetCode,
      0,
      `Permanently pruned row matching ${targetCode} from Master Ad Registry.`,
      'warning'
    );
  };

  // Reset to new record mode
  const handleResetToNew = () => {
    setActiveRecord(null);
  };

  // Sync from sheet button
  const handleSyncSheet = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSheetConfig((prev) => ({ ...prev, lastSyncTime: 'Just now' }));
      showToast('Synced 14 columns from Google Sheet successfully.', 'success');
      addAuditLog(
        'SYNC',
        'ALL',
        0,
        `Triggered manual Apps Script POST webhook poll. Synchronized 14 columns across ${records.length} records.`,
        'info'
      );
    }, 700);
  };

  // Batch operations
  const handleBatchUpdateStatus = (adNumbers: string[], newStatus: ApprovalStatus) => {
    setRecords((prev) =>
      prev.map((r) => (adNumbers.includes(r.adNumber) ? { ...r, status: newStatus } : r))
    );
    if (activeRecord && adNumbers.includes(activeRecord.adNumber)) {
      setActiveRecord((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Updated status to "${newStatus}" for ${adNumbers.length} records.`, 'success');
    addAuditLog(
      'BATCH',
      adNumbers.join(', '),
      0,
      `Bulk updated status to "${newStatus}" for ${adNumbers.length} ad units.`
    );
  };

  const handleBatchIncrementRevision = (adNumbers: string[]) => {
    setRecords((prev) =>
      prev.map((r) =>
        adNumbers.includes(r.adNumber) ? { ...r, revision: r.revision + 1 } : r
      )
    );
    if (activeRecord && adNumbers.includes(activeRecord.adNumber)) {
      setActiveRecord((prev) => (prev ? { ...prev, revision: prev.revision + 1 } : null));
    }
    showToast(`Incremented revision (+1) for ${adNumbers.length} records.`, 'success');
    addAuditLog(
      'BATCH',
      adNumbers.join(', '),
      0,
      `Bulk bumped revision numbers (+1) for ${adNumbers.length} ad units.`
    );
  };

  const handleBatchImportRecords = (newRecords: AdRecord[]) => {
    setRecords((prev) => [...prev, ...newRecords]);
    setSheetConfig((prev) => ({
      ...prev,
      totalActiveRows: prev.totalActiveRows + newRecords.length,
      lastSyncTime: 'Just now',
    }));
    showToast(`Successfully imported ${newRecords.length} ad units into registry.`, 'success');
    addAuditLog(
      'CREATE',
      `${newRecords.length} records`,
      1,
      `Batch imported ${newRecords.length} records into Master Ad Registry via CSV line injector.`
    );
  };

  // Test webhook connection
  const handleTestConnection = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookTestResult({
        success: true,
        latency: Math.floor(Math.random() * 80) + 95,
        message: 'Master Ad Registry GID 1092237307 reached. Service lock acquired and verified.',
      });
      showToast('Apps Script POST endpoint verified and live.', 'success');
    }, 850);
  };

  // Auto-sync polling timer
  useEffect(() => {
    if (!sheetConfig.autoSyncEnabled) return;

    const interval = setInterval(() => {
      setSheetConfig((prev) => ({ ...prev, lastSyncTime: 'Just now' }));
    }, sheetConfig.autoSyncSeconds * 1000);

    return () => clearInterval(interval);
  }, [sheetConfig.autoSyncEnabled, sheetConfig.autoSyncSeconds]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenDocs={() => setIsGasDocsOpen(true)}
        sheetId={sheetConfig.sheetId}
      />

      {/* Main Framework with Fixed Sidebar */}
      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          autoSyncEnabled={sheetConfig.autoSyncEnabled}
          onToggleAutoSync={() =>
            setSheetConfig((prev) => ({
              ...prev,
              autoSyncEnabled: !prev.autoSyncEnabled,
            }))
          }
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 md:pl-64 pt-16 min-h-[calc(100vh-4rem)]">
          {currentTab === 'ad-manager' && (
            <AdManagerView
              records={records}
              activeRecord={activeRecord}
              onSearch={handleSearch}
              onSaveNew={handleSaveNew}
              onRequestUpdate={handleRequestUpdate}
              onRequestDelete={handleRequestDelete}
              onResetToNew={handleResetToNew}
              onSyncSheet={handleSyncSheet}
              onOpenDocs={() => setIsGasDocsOpen(true)}
              isSyncing={isSyncing}
              lastSyncTime={sheetConfig.lastSyncTime}
              totalActiveRows={sheetConfig.totalActiveRows}
            />
          )}

          {currentTab === 'batch-operations' && (
            <BatchOperationsView
              records={records}
              onBatchUpdateStatus={handleBatchUpdateStatus}
              onBatchIncrementRevision={handleBatchIncrementRevision}
              onBatchImportRecords={handleBatchImportRecords}
            />
          )}

          {currentTab === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
              onClearLogs={() => {
                setAuditLogs([]);
                showToast('Audit log history cleared.', 'info');
              }}
            />
          )}

          {currentTab === 'sheet-settings' && (
            <SheetSettingsView
              config={sheetConfig}
              onUpdateConfig={(newConfig) => {
                setSheetConfig(newConfig);
                showToast('Google Sheet configuration saved successfully.', 'success');
              }}
              onTestConnection={handleTestConnection}
              isTesting={isTestingWebhook}
              testResult={webhookTestResult}
              onOpenDocs={() => setIsGasDocsOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Revision Update Confirmation Modal */}
      <UpdateConfirmModal
        isOpen={updateModalData.isOpen}
        onClose={() => setUpdateModalData({ isOpen: false, pendingRecord: null })}
        onConfirm={handleConfirmUpdate}
        adNumber={activeRecord?.adNumber || ''}
        storedRevision={activeRecord?.revision || 1}
        newRevision={updateModalData.pendingRecord?.revision || (activeRecord ? activeRecord.revision + 1 : 2)}
        rowIndex={activeRecord?.rowIndex}
      />

      {/* Dangerous Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalData.isOpen}
        onClose={() => setDeleteModalData({ isOpen: false, adNumber: '' })}
        onConfirm={handleConfirmDelete}
        adNumber={deleteModalData.adNumber}
      />

      {/* Google Apps Script & Deployment Guide Modal */}
      <GasDocsModal
        isOpen={isGasDocsOpen}
        onClose={() => setIsGasDocsOpen(false)}
        sheetConfig={{
          endpointUrl: sheetConfig.endpointUrl,
          sheetId: sheetConfig.sheetId,
          gid: sheetConfig.gid,
        }}
      />
    </div>
  );
}
