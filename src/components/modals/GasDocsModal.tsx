import React, { useState } from 'react';
import { Code, X, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

interface GasDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetConfig: {
    endpointUrl: string;
    sheetId: string;
    gid: string;
  };
}

export const GasDocsModal: React.FC<GasDocsModalProps> = ({
  isOpen,
  onClose,
  sheetConfig,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const appsScriptCode = `function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Ad Registry");
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data;
    
    if (action === "searchAdNumber") {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] == data.adNumber) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            rowIndex: i + 1,
            record: rows[i]
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "not_found" }));
    }
    
    if (action === "addAdRecord") {
      sheet.appendRow([
        data.adNumber, 1, data.campaign, data.client, data.channel,
        data.dimensions, data.market, data.startDate, data.endDate,
        data.owner, data.url, data.status, data.budget, data.notes
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }));
    }
    
    if (action === "updateAdRecord") {
      // Updates specified row and advances revision
      var row = payload.rowIndex;
      sheet.getRange(row, 1, 1, 14).setValues([[
        data.adNumber, data.revision, data.campaign, data.client, data.channel,
        data.dimensions, data.market, data.startDate, data.endDate,
        data.owner, data.url, data.status, data.budget, data.notes
      ]]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }));
    }
    
    if (action === "deleteAdRecord") {
      sheet.deleteRow(payload.rowIndex);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }));
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }));
  } finally {
    lock.releaseLock();
  }
}`;

  const copyToClipboard = (text: string, isEnv = false) => {
    navigator.clipboard.writeText(text);
    if (isEnv) {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#eff4ff]">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] flex items-center justify-between border-b border-[#dce9ff]">
          <div className="flex items-center gap-2.5 text-[#003fb1]">
            <Code className="w-5 h-5 text-[#003fb1]" />
            <span className="text-[16px] font-semibold text-[#0b1c30]">
              Google Apps Script Webhook API Reference
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#dce9ff] text-[#737686] transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[13px] font-semibold uppercase text-[#737686] tracking-wider">
                Production Apps Script Backend Code
              </h4>
              <button
                onClick={() => copyToClipboard(appsScriptCode)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#eff4ff] text-[#003fb1] hover:bg-[#dce9ff] text-[12px] font-medium transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied to Clipboard' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[12px] text-[#434654] mb-2 leading-relaxed">
              Paste this Google Apps Script code into your Google Sheet's script editor (Extensions → Apps Script) and deploy as a Web App with access set to "Anyone".
            </p>
            <pre className="p-4 rounded-lg bg-[#001f26] text-[#acedff] font-mono text-[12px] overflow-x-auto leading-relaxed max-h-72 border border-[#004e5c]">
              {appsScriptCode}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[13px] font-semibold uppercase text-[#737686] tracking-wider">
                Environment Variables & Endpoints
              </h4>
              <button
                onClick={() =>
                  copyToClipboard(
                    `NEXT_PUBLIC_SHEETS_ENDPOINT=${sheetConfig.endpointUrl}\nSHEET_ID=${sheetConfig.sheetId}\nSHEET_GID=${sheetConfig.gid}`,
                    true
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#eff4ff] text-[#003fb1] hover:bg-[#dce9ff] text-[12px] font-medium transition-colors"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied' : 'Copy Env'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-lg bg-[#eff4ff] font-mono text-[12px] flex flex-col gap-1.5 text-[#0b1c30] border border-[#dce9ff]">
              <div>
                <span className="text-[#00687a] font-semibold">NEXT_PUBLIC_SHEETS_ENDPOINT</span> ={' '}
                <span className="text-[#434654]">{sheetConfig.endpointUrl}</span>
              </div>
              <div>
                <span className="text-[#00687a] font-semibold">SHEET_ID</span> ={' '}
                <span className="text-[#434654]">{sheetConfig.sheetId}</span>
              </div>
              <div>
                <span className="text-[#00687a] font-semibold">SHEET_GID</span> ={' '}
                <span className="text-[#434654]">{sheetConfig.gid}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff]/60 border-t border-[#dce9ff] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-lg bg-[#003fb1] text-white hover:bg-[#1a56db] text-[13px] font-semibold transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
