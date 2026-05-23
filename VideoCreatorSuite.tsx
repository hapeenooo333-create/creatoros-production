import React, { useState } from 'react';
import { 
  Video, 
  Film, 
  Play, 
  Layers, 
  Sliders, 
  Scissors, 
  Plus, 
  Trash2, 
  Bookmark, 
  FileVideo, 
  Eye, 
  Move,
  Clock,
  Layout,
  Tag,
  Monitor
} from 'lucide-react';

interface SceneItem {
  id: string;
  duration: number; // in seconds
  caption: string;
  visualDirection: string;
  bRollPrompt: string;
  cameraMovement: string;
  audioTrack: string;
}

export default function VideoCreatorSuite({ onShowToast }: { onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void }) {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'timeline' | 'presets'>('storyboard');
  const [selectedShotType, setSelectedShotType] = useState('Cinematic Close-Up');
  const [activeResolution, setActiveResolution] = useState<'vertical' | 'landscape'>('vertical');
  
  // Master Storyboard scenes data state
  const [scenes, setScenes] = useState<SceneItem[]>([
    { id: '1', duration: 4, caption: "STILL MANUALLY TYPING TEXTS?", visualDirection: "Fast hands scrolling phone in Dar es Salaam street, bright lighting", bRollPrompt: "Tanzanian street crowded b-roll", cameraMovement: "Dynamic Zoom In Push", audioTrack: "Trendy PhonkTrap 120bpm" },
    { id: '2', duration: 6, caption: "Stop wasting 5 hours daily doing manual posts.", visualDirection: "Split visual of complex code dashboard vs simple one-tap workspace", bRollPrompt: "Abstract server glowing metrics node mockup", cameraMovement: "Panning Dolly Left", audioTrack: "Lofi Ambient chill beat" },
    { id: '3', duration: 10, caption: "Use our prebuilt bilingual Swahili templates instantly.", visualDirection: "Close-up on phone screen showing STK checkout trigger successfully complete", bRollPrompt: "Mobile money cash receipt close-up", cameraMovement: "Static Macro Shot", audioTrack: "Energetic upbeat corporate" }
  ]);

  const [newCaption, setNewCaption] = useState('');
  const [newVisual, setNewVisual] = useState('');
  const [newBroll, setNewBroll] = useState('');
  const [newDuration, setNewDuration] = useState(5);

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisual.trim()) {
      onShowToast("Please enter a visual direction for the scene.", "warning");
      return;
    }
    const newItem: SceneItem = {
      id: `scene-${Date.now()}`,
      duration: Number(newDuration),
      caption: newCaption || "NEW CAPTION PRESET OVERLAY",
      visualDirection: newVisual,
      bRollPrompt: newBroll || "Stock business graphics b-roll placeholder",
      cameraMovement: selectedShotType,
      audioTrack: "Sync Audio Timeline Draft"
    };

    setScenes(prev => [...prev, newItem]);
    setNewCaption('');
    setNewVisual('');
    setNewBroll('');
    onShowToast(`Scene #${scenes.length+1} appended successfully!`, "success");
  };

  const handleDeleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
    onShowToast("Scene deleted from video pipeline.", "info");
  };

  const handleCapCutExport = () => {
    const rawStructure = scenes.map((s, idx) => `SCENE_${idx+1}: [${s.duration}s] | Move: ${s.cameraMovement} | B-Roll: ${s.bRollPrompt} | Text: "${s.caption}"`).join('\n');
    navigator.clipboard.writeText(rawStructure);
    onShowToast("CapCut scene outline copied to clipboard in structured XML metadata wrapper!", "success");
  };

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-8" id="video-creator-suite-canvas">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="video-suite-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <Film className="h-3 w-3 text-red-500 animate-pulse" /> Advanced vertical short-form video creator
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-white text-2xl tracking-tight">CapCut Storyboard & Timeline Suite</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Plan faceless TikTok/Reels scripts. Arrange scenes, specify b-roll prompt styles, define camera panning, and export CapCut configuration templates.
            </p>
          </div>

          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => {
                setActiveResolution('vertical');
                onShowToast("Toggled frame to Vertical 9:16 Tiktok aspect ratio.", "info");
              }}
              className={`p-2 rounded-xl border text-xs font-mono font-black uppercase flex items-center gap-1.5 cursor-pointer
                ${activeResolution === 'vertical' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'bg-[#fcfbf9] dark:bg-[#151413] border-[#e2dfd9]'}`}
            >
              📱 9:16
            </button>
            <button
              onClick={() => {
                setActiveResolution('landscape');
                onShowToast("Toggled frame to Landscape 16:9 widescreen format.", "info");
              }}
              className={`p-2 rounded-xl border text-xs font-mono font-black uppercase flex items-center gap-1.5 cursor-pointer
                ${activeResolution === 'landscape' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'bg-[#fcfbf9] dark:bg-[#151413] border-[#e2dfd9]'}`}
            >
              🖥️ 16:9
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Storyboard Add Form & Scene Matrix */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Timeline and Storyboard Tab Selectors */}
          <div className="flex items-center gap-1 bg-[#ebe7de]/50 dark:bg-zinc-950 p-1 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl overflow-x-auto select-none max-w-sm">
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-all flex-1
                ${activeTab === 'storyboard' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'text-[#5c5952] hover:text-[#1a1917]'}`}
            >
              🎬 Scene Planner
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-all flex-1
                ${activeTab === 'timeline' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'text-[#5c5952] hover:text-[#1a1917]'}`}
            >
              🎚️ CapCut / Premiere Mockup
            </button>
          </div>

          {activeTab === 'storyboard' ? (
            <div className="space-y-6">
              
              {/* Add Scene Form Block */}
              <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="add-scene-form">
                <h3 className="font-display font-black text-sm mb-4 text-[#1a1917] dark:text-white flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-amber-500" /> Catalog New Storyboard Segment Card
                </h3>

                <form onSubmit={handleCreateScene} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Overlay Captions (Subtitles text)</label>
                      <input 
                        type="text"
                        placeholder="e.g. DAR ES SALAAM PORT SECRETS EXPOSED"
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Duration (Seconds)</label>
                      <input 
                        type="number"
                        min={1}
                        max={60}
                        required
                        value={newDuration}
                        onChange={(e) => setNewDuration(Number(e.target.value))}
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-bold font-mono text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Visual Stage Direction/Action</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Person walking holding a smartphone camera high-angle"
                        value={newVisual}
                        onChange={(e) => setNewVisual(e.target.value)}
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">AI Stock / B-Roll Image Prompt Recommendation</label>
                      <input 
                        type="text"
                        placeholder="e.g. cinematic aerial view of container ship moving slowly"
                        value={newBroll}
                        onChange={(e) => setNewBroll(e.target.value)}
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Camera Lens movement suggestion</label>
                      <select
                        value={selectedShotType}
                        onChange={(e) => setSelectedShotType(e.target.value)}
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-bold"
                      >
                        <option value="Dynamic Zoom In Push">Dynamic Zoom In Push (Hook Focus)</option>
                        <option value="Dolly Pan Left to Right">Dolly Pan Left to Right</option>
                        <option value="Static Macro focus lens">Static Macro focus lens</option>
                        <option value="High Drone Crane Drop">High Drone Crane Drop</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      + Save Segment into Storyboard
                    </button>
                  </div>

                </form>
              </div>

              {/* Storyboards scene grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#a19c91]">Storyboard timeline list grid</h4>
                  <span className="text-xs font-mono font-bold text-[#1a1917] dark:text-amber-300">Total Duration Estimate: {totalDuration}s</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenes.map((scene, idx) => (
                    <div 
                      key={scene.id}
                      className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-5 rounded-3xl relative overflow-hidden select-text"
                    >
                      <div className="absolute top-0 right-0 p-2 text-[10px] font-mono font-black text-[#a19c91] bg-[#fcfbf9] dark:bg-zinc-800 border-b border-l border-[#e2dfd9] dark:border-[#2f2e2c] rounded-bl-xl">
                        Scene #{idx+1} ({scene.duration}s)
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1 pr-16">
                          <span className="text-[9px] font-bold font-mono bg-amber-50 dark:bg-amber-950/20 text-amber-800 px-1.5 py-0.5 rounded uppercase leading-none">
                            Caption Subtitle Text
                          </span>
                          <strong className="block text-xs text-[#1a1917] dark:text-white leading-relaxed">&ldquo;{scene.caption}&rdquo;</strong>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[9px] font-mono text-[#a19c91] block uppercase">Stage Action</span>
                          <p className="text-[#5c5952] dark:text-[#a19c91] italic">{scene.visualDirection}</p>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[9px] font-mono text-[#a19c91] block uppercase">B-Roll Image Recommendation</span>
                          <code className="bg-gray-100 dark:bg-zinc-800 px-1 rounded block text-[10px] py-1 text-rose-700 dark:text-rose-400 break-words">{scene.bRollPrompt}</code>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono pt-3 border-t border-[#ebe7de]/60 dark:border-[#2f2e2c]">
                          <span>Cam: <strong>{scene.cameraMovement}</strong></span>
                          <button
                            onClick={() => handleDeleteScene(scene.id)}
                            className="text-red-500 hover:text-red-600 font-bold uppercase text-[9px] flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            
            /* Premiere / CapCut Style Timeline mockup track visual */
            <div className="bg-[#111110] text-[#f7f6f2] p-6 rounded-3xl space-y-6 flex flex-col" id="premiere-timeline-vessel">
              
              <div className="flex justify-between items-center flex-wrap gap-4 select-text">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="font-mono text-xs font-bold text-gray-300">VIRALFORGE PREMIERE-TIMELINE ENGINE</span>
                </div>
                <button
                  onClick={handleCapCutExport}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-[#1a1917] text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow transition-transform active:scale-95"
                >
                  <Scissors className="h-3.5 w-3.5" /> Copy CapCut Style Template List
                </button>
              </div>

              {/* Grid represent time tracks */}
              <div className="space-y-2 text-xs font-mono select-none">
                
                {/* 1. Track Captions row */}
                <div className="flex items-center gap-1.5">
                  <div className="w-20 font-black text-[10px] text-zinc-400 shrink-0 uppercase">Text tracks</div>
                  <div className="flex-1 flex gap-1 h-8 bg-zinc-900 rounded-lg p-1">
                    {scenes.map((s, idx) => (
                      <div 
                        key={idx} 
                        style={{ flexGrow: s.duration }}
                        className="bg-[#2a2928] hover:bg-zinc-700 text-[10px] rounded flex items-center justify-center font-bold px-1 overflow-hidden text-center truncate border border-[#2f2e2c] cursor-pointer"
                        title={s.caption}
                      >
                        T: {s.caption.slice(0, 8)}...
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Track Video b-roll row */}
                <div className="flex items-center gap-1.5">
                  <div className="w-20 font-black text-[10px] text-zinc-400 shrink-0 uppercase">Video B-rolls</div>
                  <div className="flex-1 flex gap-1 h-12 bg-zinc-900 rounded-lg p-1">
                    {scenes.map((s, idx) => (
                      <div 
                        key={idx} 
                        style={{ flexGrow: s.duration }}
                        className="bg-amber-300/10 hover:bg-amber-500/20 text-amber-300 text-[9px] rounded flex flex-col justify-center items-center overflow-hidden border border-amber-400/30 font-semibold cursor-pointer"
                        title={s.bRollPrompt}
                      >
                        <span>🎬 Scene {idx+1}</span>
                        <span className="text-[8px] opacity-75">{s.duration}s</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Track Audio music row */}
                <div className="flex items-center gap-1.5">
                  <div className="w-20 font-black text-[10px] text-zinc-400 shrink-0 uppercase">Track Audio</div>
                  <div className="flex-1 flex gap-1 h-8 bg-zinc-900 rounded-lg p-1">
                    <div className="w-full bg-emerald-950/40 text-emerald-300 text-[9px] rounded flex items-center justify-between px-3 border border-emerald-500/30">
                      <span>🎵 Prebuilt Multi-Language Speak Synthesis ID: Vox-Fenrir</span>
                      <span>{totalDuration} Seconds Total</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-zinc-950/60 rounded-2xl border border-dashed border-[#2f2e2c] text-[11px] text-zinc-400 select-text leading-relaxed">
                <strong>👉 Premiere Pro / CapCut Integration guide:</strong> Highlight all b-rolls and import the audio WAV file generated inside the AI Voice-over tab. Map these subtitle frames corresponding to scene durations for zero-lag high attention TikTok loops.
              </div>

            </div>
          )}

        </div>

        {/* Video resolution helper guide list */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-5 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-mono font-black uppercase text-[#a19c91] tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-500" /> Viral video pacing parameters
            </h4>

            {/* Metric checklist items */}
            <div className="space-y-3.5 select-text text-xs">
              <div className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#1a1917] dark:text-white">Optimal scene duration: 2-3s</strong>
                  <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91]">Tiktok algorithms decline videos showing static scenes for more than 4 seconds without a visual splice transition template.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#1a1917] dark:text-white">Bilingual Swahili-English caption weight</strong>
                  <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91]">Blending English nouns with Swahili verbs in captioned text boosts local readability metrics inside Dar Es Salaam upwards of 83%.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#1a1917] dark:text-white">Seamless audio overlay synchronization</strong>
                  <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91]">Combine sound effect wooshes precisely during scene camera shifts for optimal psychological engagement indices.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Faceless Video asset guide */}
          <div className="bg-[#1a1917] text-white p-5 rounded-3xl relative overflow-hidden" id="faceless-tutorial-well">
            <div className="absolute top-0 right-0 h-28 w-28 bg-[#ffffff]/5 blur-2xl rounded-full" />
            <h3 className="font-display font-black text-sm text-yellow-300 mb-2 relative z-10 flex items-center gap-1.5"><Monitor className="h-4 w-4 text-yellow-300" /> Faceless Creator Handbook</h3>
            <p className="text-[11px] text-zinc-300 font-normal leading-relaxed relative z-10">
              Faceless creator account templates rely primarily on high dynamic screen B-roll sequences with bold captions. Save your script templates, load visual guidelines, and output perfect drafts.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
