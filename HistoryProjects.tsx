import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Copy, 
  Download, 
  Printer, 
  Edit3, 
  Layers, 
  Check, 
  ExternalLink,
  BookOpen,
  Calendar
} from 'lucide-react';
import { HistoryItem } from './types';

interface HistoryProjectsProps {
  token: string | null;
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onUpdateHistoryItem: (id: string, updatedText: string) => void;
  onNavigateToGen: () => void;
}

export default function HistoryProjects({ token, history, onDeleteHistoryItem, onUpdateHistoryItem, onNavigateToGen }: HistoryProjectsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  
  const [editorText, setEditorText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Extract unique formats for filters
  const categories = ['All', ...Array.from(new Set(history.map(item => item.format)))];

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.format === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectActive = (item: HistoryItem) => {
    setActiveItem(item);
    setEditorText(item.result);
    setIsEditing(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (item: HistoryItem) => {
    const element = document.createElement("a");
    const file = new Blob([item.result], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`Verified Export! "${item.title}" saved successfully as TXT file.`);
  };

  const handleDownloadPdf = (item: HistoryItem) => {
    const element = document.createElement("a");
    const docHeader = `--- CREATOROS DOCUMENT PDF DRAFT EXPORT ---\nDATE: ${new Date().toLocaleDateString()}\nTITLE: ${item.title.toUpperCase()}\nFORMAT: ${item.format}\nPROMPT: ${item.prompt}\n------------------------------------------\n\n`;
    const file = new Blob([docHeader + item.result], {type: 'application/pdf;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}_draft.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`Verified Export! "${item.title}" compiled successfully as document PDF.`);
  };

  const handleUpdate = async () => {
    if (!activeItem) return;
    try {
      const res = await fetch(`/api/history/${activeItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ result: editorText })
      });
      if (!res.ok) throw new Error("Failed to update database.");
      
      onUpdateHistoryItem(activeItem.id, editorText);
      // update local preview state
      setActiveItem({ ...activeItem, result: editorText });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this historical draft?")) return;
    
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onDeleteHistoryItem(id);
        if (activeItem?.id === id) {
          setActiveItem(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete draft:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" id="history-projects-canvas">
      
      {/* Header and Search Tool */}
      <div className="bg-white dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-6" id="history-hud-search">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">Projects & Draft Library</h1>
            <p className="text-sm text-[#5c5952] dark:text-[#a19c91]">Manage, download, and iterate your saved creations.</p>
          </div>

          <button
            onClick={onNavigateToGen}
            className="px-4 py-2 bg-[#1a1917] dark:bg-amber-300 dark:text-[#1a1917] text-[#f7f6f2] hover:bg-[#383531] rounded-xl text-xs font-semibold font-mono flex items-center gap-1 cursor-pointer"
          >
            Create New Draft +
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-[#a19c91]" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or generated text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#fcfbf9] dark:bg-zinc-900 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-sm text-[#1a1917] dark:text-zinc-100 focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="search-history-input"
            />
          </div>

          {/* Categories Horizontal scrolling */}
          <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors
                  ${selectedCategory === cat 
                    ? 'bg-[#1a1917] text-[#f7f6f2] dark:bg-amber-300 dark:text-[#1a1917]' 
                    : 'bg-[#ebe7de] text-[#5c5952] hover:bg-[#eadecc] hover:text-[#1a1917] dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Items list */}
        <div className="md:col-span-5 space-y-3 max-h-[550px] overflow-y-auto pr-1" id="history-items-list">
          {filteredHistory.length === 0 ? (
            <div className="bg-white dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-8 text-center text-[#5c5952] dark:text-zinc-400">
              <Layers className="h-10 w-10 text-[#a19c91] mx-auto mb-2 animate-pulse" />
              <p className="font-bold">No draft files matched</p>
              <p className="text-xs text-[#a19c91] mt-1">Try refining search parameters or click workflow workshop to draft some.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const active = activeItem?.id === item.id;
              const dateStr = item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : "Just Now";

              return (
                <div
                  key={item.id}
                  id={`history-card-item-${item.id}`}
                  onClick={() => handleSelectActive(item)}
                  className={`
                    p-4 rounded-xl border transition-all cursor-pointer text-left
                    ${active 
                      ? 'bg-amber-50/50 border-amber-300 dark:bg-amber-950/20 dark:border-amber-500 w-full shadow-xs' 
                      : 'bg-white border-[#e2dfd9] dark:bg-[#151413] dark:border-[#2f2e2c] hover:bg-[#fdfdfc] dark:hover:bg-zinc-800/50 w-full'}
                  `}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-mono bg-[#ebe7de] dark:bg-zinc-800 text-[#1a1917] dark:text-zinc-300 font-semibold px-2 py-0.5 rounded">
                      {item.format}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg max-md:opacity-100 opacity-0 transition-opacity hover:opacity-100 md:group-hover:opacity-100"
                      title="Delete Draft"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-sm text-[#1a1917] dark:text-[#f7f6f2] truncate">{item.title}</h3>
                  <p className="text-xs text-[#5c5952] dark:text-[#a19c91] line-clamp-1 mt-1 font-mono">{item.prompt}</p>

                  <div className="flex items-center gap-2 mt-3 text-[10px] text-[#a19c91] font-sans">
                    <Calendar className="h-3 w-3" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Quick Editor Panel */}
        <div className="md:col-span-7 bg-white dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-6 min-h-[350px]" id="history-editor-pane">
          {!activeItem ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-[#5c5952] dark:text-zinc-400">
              <BookOpen className="h-10 w-10 text-[#a19c91] mb-2 animate-bounce" />
              <p className="font-display font-extrabold text-base text-[#1a1917] dark:text-white">No active draft selected</p>
              <p className="text-xs text-[#a19c91] max-w-sm mt-1">
                Select any draft file from the list archive on the left to trigger the preview inspector and editor panel.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between space-y-4">
              
              {/* Draft Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e2db] dark:border-[#2f2e2c] pb-4">
                <div>
                  <h3 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-lg">{activeItem.title}</h3>
                  <p className="text-xs text-[#5c5952] dark:text-zinc-400 font-mono mt-1">Prompt: {activeItem.prompt}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="history-action-btn-copy"
                    onClick={() => handleCopy(activeItem.result, activeItem.id)}
                    className="p-1.5 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold font-sans flex items-center gap-1 text-[#1a1917] dark:text-zinc-200 cursor-pointer"
                  >
                    {copiedId === activeItem.id ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                  <button
                    id="history-action-btn-txt"
                    onClick={() => handleDownloadTxt(activeItem)}
                    className="p-1.5 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg text-[#1a1917] dark:text-[#f7f6f2] cursor-pointer"
                    title="Download Plaintext TXT"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="history-action-btn-pdf"
                    onClick={() => handleDownloadPdf(activeItem)}
                    className="p-1.5 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg text-amber-600 dark:text-amber-400 cursor-pointer flex items-center gap-1"
                    title="Export Styled PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold font-sans">PDF</span>
                  </button>
                  <button
                    id="history-action-btn-delete"
                    onClick={() => handleDelete(activeItem.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Draft Content Viewer & Live form */}
              <div className="flex-1 min-h-[250px] py-4">
                {isEditing ? (
                  <textarea
                    value={editorText}
                    onChange={(e) => setEditorText(e.target.value)}
                    className="w-full h-[280px] p-4 bg-[#fcfbf9] dark:bg-zinc-900 border border-[#e2dfd9] dark:border-[#2f2e2c] text-[#1a1917] dark:text-[#f7f6f2] font-mono text-sm focus:outline-none focus:border-[#1a1917]"
                  />
                ) : (
                  <div className="prose dark:prose-invert text-sm text-[#1a1917] dark:text-zinc-200 whitespace-pre-wrap select-text max-h-[350px] overflow-y-auto">
                    {activeItem.result}
                  </div>
                )}
              </div>

              {/* Commit changes bar */}
              <div className="border-t border-[#e5e2db] dark:border-[#2f2e2c] pt-4 flex justify-between items-center text-xs">
                <span className="text-[#a19c91] font-mono">Format: <strong>{activeItem.format}</strong></span>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        id="history-btn-cancel-edit"
                        onClick={() => { setIsEditing(false); setEditorText(activeItem.result); }}
                        className="px-3 py-1.5 border border-[#d8d4cb] dark:border-[#2f2e2c] hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-all text-[#1a1917] dark:text-[#f7f6f2] font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        id="history-btn-save-edit"
                        onClick={handleUpdate}
                        className="px-3 py-1.5 bg-[#1a1917] dark:bg-amber-300 dark:text-[#1a1917] text-[#f7f6f2] hover:bg-[#383531] rounded-lg font-semibold"
                      >
                        Save Revisions
                      </button>
                    </>
                  ) : (
                    <button
                      id="history-btn-enable-edit"
                      onClick={() => setIsEditing(true)}
                      className="px-3.5 py-2 border border-[#d8d4cb] dark:border-[#2f2e2c] hover:bg-[#ebe7de] dark:hover:bg-zinc-800 text-[#1a1917] dark:text-[#f7f6f2] rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Modify Document Text
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1a1917] dark:bg-amber-300 border border-[#2f2e2c] dark:border-amber-400 text-[#f7f6f2] dark:text-[#1a1917] px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 max-w-[340px] animate-bounce-short"
          id="export-toast-notification"
        >
          <div className="h-6 w-6 rounded-full bg-emerald-500/15 dark:bg-[#1a1917]/10 text-emerald-500 dark:text-emerald-800 flex items-center justify-center shrink-0">
            <Check className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-sans font-medium">{toastMessage}</p>
        </div>
      )}

    </div>
  );
}
