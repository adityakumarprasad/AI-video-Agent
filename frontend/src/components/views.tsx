"use client";

import React, { useState, useRef } from "react";
import { 
  Link2, 
  Globe, 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Trash2, 
  ArrowRight,
  Terminal,
  FileText,
  HelpCircle,
  Award,
  ListTodo
} from "lucide-react";

// --- Types ---
export type ViewState = "HOME" | "PROCESSING" | "SUCCESS" | "FAILED";
export type PipelineStep = "init" | "audio" | "transcript" | "title" | "summary" | "extract" | "rag" | "done";

export interface PipelineResult {
  title: string;
  transcript: string;
  summary: string;
  action_items: string;
  key_decisions: string;
  open_questions: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// 🏠 1. HOME VIEW
// ────────────────────────────────────────────────────────────────────────────────
interface HomeViewProps {
  source: string;
  setSource: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  onSubmit: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  source,
  setSource,
  language,
  setLanguage,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSource(file.name); // Using filename as placeholder/identifier
      setSelectedFileName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSource(file.name);
      setSelectedFileName(file.name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          🎬 AI Video Assistant
        </h1>
        <p className="text-zinc-400 mt-3 text-base font-medium">
          Transcribe · Summarise · Chat with your meetings
        </p>
      </div>

      {/* Main Form Box */}
      <div className="w-full max-w-xl glass-panel p-6 rounded-2xl glow-purple border border-zinc-800">
        {/* Youtube Link paste */}
        <div className="relative mb-4">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Paste YouTube URL..."
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setSelectedFileName(null);
            }}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-950/60 border border-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors text-sm text-zinc-100 placeholder-zinc-500"
          />
        </div>

        {/* Language select dropdown */}
        <div className="relative mb-4">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-xl bg-zinc-950/60 border border-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors text-sm text-zinc-300 appearance-none cursor-pointer"
          >
            <option value="english">English</option>
            <option value="hinglish">Hinglish</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            ▼
          </div>
        </div>

        {/* Dashed dropzone upload */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-purple-500/60 bg-zinc-950/30 transition-colors rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer mb-6"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="audio/*,video/*"
          />
          <UploadCloud className="w-10 h-10 text-cyan-400 mb-3" />
          <p className="text-zinc-400 text-xs font-medium">
            {selectedFileName 
              ? `Selected file: ${selectedFileName}` 
              : "Drag & drop audio/video file here, or click to browse"
            }
          </p>
        </div>

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={!source.trim()}
          className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 transition-all py-4 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⚡ Analyse
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// ⚙️ 2. PROCESSING / STEPPER VIEW
// ────────────────────────────────────────────────────────────────────────────────
interface ProcessingViewProps {
  source: string;
  currentStep: PipelineStep;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  source,
  currentStep,
}) => {
  const stepsList = [
    { key: "audio", label: "Audio Acquisition — Downloading & Chunking" },
    { key: "transcript", label: "Transcription — Speech-to-Text conversion" },
    { key: "title", label: "Title Generation — Title extraction" },
    { key: "summary", label: "Summarisation — Bullet point summaries" },
    { key: "extract", label: "Insights Extraction — Action items & Decisions" },
    { key: "rag", label: "RAG Indexing — Preparing chat data" },
  ];

  // Map step key to ordering index to evaluate completion state
  const stepOrder = ["init", "audio", "transcript", "title", "summary", "extract", "rag", "done"];
  const currentIdx = stepOrder.indexOf(currentStep);

  // Compute percentage progress for progress bar
  const progressPercent = Math.min(Math.max((currentIdx / (stepOrder.length - 2)) * 100, 0), 100);

  // Custom subtext log generation depending on step
  const getSubtextMessage = () => {
    switch (currentStep) {
      case "audio": return "Extracting and downloading audio streams...";
      case "transcript": return "Transcribing speech segments using AI Models...";
      case "title": return "Reading transcription to identify professional meeting title...";
      case "summary": return "Running map-reduce summarization models...";
      case "extract": return "Extracting action items, key decisions, and questions...";
      case "rag": return "Indexing documents into Chroma Vector Database...";
      default: return "Initializing pipeline tasks...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      {/* Title */}
      <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100 text-center">
        Processing Your Video...
      </h2>
      <p className="text-zinc-500 mt-2 text-sm max-w-sm truncate text-center mb-8">
        {source}
      </p>

      {/* Stepper Card */}
      <div className="w-full max-w-2xl glass-panel p-8 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col gap-6 mb-8">
          {stepsList.map((step, idx) => {
            const stepOrderIdx = stepOrder.indexOf(step.key);
            const isCompleted = currentIdx > stepOrderIdx;
            const isActive = currentStep === step.key;

            return (
              <div key={step.key} className="flex items-center gap-4 text-left">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-cyan-400 shrink-0 flex items-center justify-center animate-active-step">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-700 shrink-0" />
                )}

                <span
                  className={`text-sm font-medium transition-colors ${
                    isCompleted 
                      ? "text-zinc-400" 
                      : isActive 
                        ? "text-cyan-400 font-semibold" 
                        : "text-zinc-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Bottom logs console line */}
        <p className="text-zinc-500 text-xs font-mono">
          {getSubtextMessage()}
        </p>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// 📊 3. RESULTS DASHBOARD VIEW
// ────────────────────────────────────────────────────────────────────────────────
interface DashboardViewProps {
  result: PipelineResult;
  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendChat: () => void;
  onClearChat: () => void;
  isChatLoading: boolean;
  onReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  result,
  chatHistory,
  chatInput,
  setChatInput,
  onSendChat,
  onClearChat,
  isChatLoading,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "insights" | "transcript">("summary");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  // Convert raw text content of transcript into numbered lines list
  const transcriptLines = result.transcript.split("\n").filter(l => l.trim() !== "");

  // Render bullet list formatting for summaries
  const renderSummaryContent = () => {
    // If summary has list formatting like "- Subheading: content", parse it
    // Default fallback to rendering simple lines
    const summarySections = result.summary.split("\n").filter(s => s.trim() !== "");
    
    return (
      <div className="flex flex-col gap-6 text-left">
        {summarySections.map((line, idx) => {
          // Clean bullet symbols
          const cleanLine = line.replace(/^[-*•\d.]\s+/, "");
          const colonIdx = cleanLine.indexOf(":");
          
          if (colonIdx !== -1) {
            const heading = cleanLine.substring(0, colonIdx);
            const description = cleanLine.substring(colonIdx + 1);
            return (
              <div key={idx} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-purple-500" />
                <h4 className="text-purple-400 font-bold text-sm">{heading}</h4>
                <p className="text-zinc-300 text-xs leading-relaxed mt-1">{description.trim()}</p>
              </div>
            );
          }

          return (
            <div key={idx} className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-purple-500" />
              <p className="text-zinc-300 text-xs leading-relaxed">{cleanLine}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 p-6 rounded-2xl glass-panel mb-6">
        <div className="text-left">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span className="text-purple-500">🎬</span> {result.title || "Meeting Summary and Actionable Insights"}
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Generated overview of the video with key moments, insights, and conversation support
          </p>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 text-xs px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          🔄 Analyse New Video
        </button>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Summary / Insights / Transcript Tabs (60% width equivalent) */}
        <div className="lg:col-span-7 flex flex-col gap-4 border border-zinc-800 rounded-2xl p-6 glass-panel min-h-[580px]">
          {/* Tabs Menu */}
          <div className="flex items-center gap-6 border-b border-zinc-800 pb-3">
            {[
              { id: "summary", label: "Summary" },
              { id: "insights", label: "Insights" },
              { id: "transcript", label: "Transcript" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-semibold pb-1 cursor-pointer transition-colors relative ${
                  activeTab === tab.id 
                    ? "text-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="mt-4 flex-1">
            {/* 1. Summary Tab */}
            {activeTab === "summary" && (
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 min-h-[420px] max-h-[520px] overflow-y-auto">
                {renderSummaryContent()}
              </div>
            )}

            {/* 2. Insights Tab */}
            {activeTab === "insights" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[420px] max-h-[520px] overflow-y-auto">
                {/* Action items column */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col text-left">
                  <h4 className="text-purple-400 font-bold text-xs flex items-center gap-2 mb-3 uppercase tracking-wide">
                    <ListTodo className="w-4 h-4" /> Action Items
                  </h4>
                  <div className="text-zinc-400 text-xs flex flex-col gap-2 overflow-y-auto whitespace-pre-line leading-relaxed">
                    {result.action_items || "No action items identified."}
                  </div>
                </div>

                {/* Key decisions column */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col text-left">
                  <h4 className="text-cyan-400 font-bold text-xs flex items-center gap-2 mb-3 uppercase tracking-wide">
                    <Award className="w-4 h-4" /> Key Decisions
                  </h4>
                  <div className="text-zinc-400 text-xs flex flex-col gap-2 overflow-y-auto whitespace-pre-line leading-relaxed">
                    {result.key_decisions || "No key decisions identified."}
                  </div>
                </div>

                {/* Open questions column */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col text-left">
                  <h4 className="text-zinc-300 font-bold text-xs flex items-center gap-2 mb-3 uppercase tracking-wide">
                    <HelpCircle className="w-4 h-4" /> Open Questions
                  </h4>
                  <div className="text-zinc-400 text-xs flex flex-col gap-2 overflow-y-auto whitespace-pre-line leading-relaxed">
                    {result.open_questions || "No open questions identified."}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Transcript Tab (macOS terminal style) */}
            {activeTab === "transcript" && (
              <div className="border border-zinc-800 rounded-xl overflow-hidden text-left bg-zinc-950">
                {/* macOS bar */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> transcript.txt
                  </span>
                  <div className="w-12" />
                </div>
                
                {/* Scrollable code body */}
                <div className="p-4 max-h-[450px] overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300">
                  <table className="border-collapse w-full">
                    <tbody>
                      {transcriptLines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/30">
                          <td className="pr-4 text-right text-zinc-600 select-none border-r border-zinc-900 w-10">
                            {idx + 1}
                          </td>
                          <td className="pl-4 py-0.5 text-zinc-300 whitespace-pre-wrap">
                            {line.replace(/^[-*•\d.]\s+/, "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Panel (40% width equivalent) */}
        <div className="lg:col-span-5 border border-zinc-800 rounded-2xl p-6 glass-panel flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="text-left">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  💬 Chat with your Meeting
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Live context-aware assistant</p>
              </div>
              <span className="text-[9px] bg-zinc-900 text-cyan-400 font-semibold px-2 py-0.5 border border-zinc-800 rounded-full select-none">
                Live
              </span>
            </div>

            {/* Message Box Scrollable area */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[380px] min-h-[350px] pr-1 py-1">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] text-center p-8 bg-zinc-950/20 rounded-xl border border-zinc-900/40">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-zinc-500 text-xs max-w-[200px] leading-relaxed">
                    Ask anything about this video transcript...
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"} text-left`}
                    >
                      <span className="text-[9px] text-zinc-500 mb-1 px-1">
                        {isUser ? "You" : "Assistant"}
                      </span>
                      <div 
                        className={`text-xs px-4 py-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          isUser 
                            ? "bg-purple-950/20 text-zinc-100 border border-purple-500/25 rounded-tr-none" 
                            : "bg-zinc-900/60 text-zinc-300 border border-zinc-800 rounded-tl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Chat loading typing dots indicator */}
              {isChatLoading && (
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] text-zinc-500 mb-1 px-1">Assistant</span>
                  <div className="bg-zinc-900/60 border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 dot-bounce-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 dot-bounce-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 dot-bounce-3" />
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-1 pl-1">Thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Clear Chat controls */}
            {chatHistory.length > 0 && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={onClearChat}
                  className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Chat
                </button>
              </div>
            )}
          </div>

          {/* Form Input fields */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Ask anything about this video..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendChat()}
              className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={onSendChat}
              disabled={!chatInput.trim() || isChatLoading}
              className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-zinc-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// ❌ 4. ERROR VIEW
// ────────────────────────────────────────────────────────────────────────────────
interface ErrorViewProps {
  errorMessage: string;
  onRetry: () => void;
  onGoHome: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  errorMessage,
  onRetry,
  onGoHome,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-zinc-800 text-center flex flex-col items-center shadow-2xl">
        {/* Red X icon */}
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>

        {/* Title / description */}
        <h3 className="text-2xl font-extrabold text-zinc-100">
          Analysis Failed
        </h3>
        <p className="text-zinc-500 mt-2 text-xs">
          An error occurred while processing your request.
        </p>

        {/* Monospace Code Block */}
        <div className="w-full mt-6 bg-zinc-950/90 border border-zinc-900 rounded-xl p-4 text-left font-mono text-[10px] text-red-400 leading-relaxed max-h-[150px] overflow-y-auto">
          {errorMessage || "Backend polling returned status failed. The video analysis pipeline could not complete."}
        </div>

        {/* Action Buttons */}
        <button
          onClick={onRetry}
          className="w-full mt-6 bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 py-3.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-lg hover:shadow-purple-900/10"
        >
          🔄 Try Again
        </button>

        <button
          onClick={onGoHome}
          className="mt-4 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
