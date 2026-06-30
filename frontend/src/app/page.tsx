"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  HomeView, 
  ProcessingView, 
  DashboardView, 
  ErrorView, 
  ViewState, 
  PipelineStep, 
  PipelineResult, 
  ChatMessage 
} from "@/components/views";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export default function Home() {
  // --- UI States ---
  const [view, setView] = useState<ViewState>("HOME");
  const [currentStep, setCurrentStep] = useState<PipelineStep>("init");
  
  // --- Form Inputs ---
  const [source, setSource] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");
  
  // --- Pipeline Tasks Tracking ---
  const [taskId, setTaskId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [result, setResult] = useState<PipelineResult | null>(null);

  // --- RAG Chat States ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Polling reference to safely clean up intervals
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // 1. Submit pipeline analysis
  const handleSubmitAnalysis = async () => {
    if (!source.trim()) return;

    setView("PROCESSING");
    setCurrentStep("init");
    setErrorMsg("");
    setResult(null);
    setChatHistory([]);
    setTaskId(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: source.trim(), language }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error code: ${res.status}`);
      }

      const data = await res.json();
      setTaskId(data.task_id);

      // Start status polling
      startPolling(data.task_id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initiate analysis pipeline.");
      setView("FAILED");
    }
  };

  // 2. Poll backend status endpoint
  const startPolling = (id: string) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch task status logs.");
        }

        const data = await res.json();
        
        // Update active step in pipeline
        if (data.current_step) {
          setCurrentStep(data.current_step as PipelineStep);
        }

        if (data.status === "completed") {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          setResult(data.result);
          setView("SUCCESS");
        } else if (data.status === "failed") {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          setErrorMsg(data.error || "Analysis pipeline execution failed.");
          setView("FAILED");
        }
      } catch (err: any) {
        console.error(err);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setErrorMsg(err.message || "Connection to API backend lost.");
        setView("FAILED");
      }
    };

    // Run first check immediately
    checkStatus();

    // Set checking interval every 3 seconds
    pollingIntervalRef.current = setInterval(checkStatus, 3000);
  };

  // 3. Send message to RAG chat endpoint
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !taskId || isChatLoading) return;

    const userMessageContent = chatInput.trim();
    setChatInput(""); // Clear input box
    setChatHistory(prev => [...prev, { role: "user", content: userMessageContent }]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, question: userMessageContent }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with RAG chat service.");
      }

      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "❌ Error: Could not get a response. Make sure your API backend is online." 
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 4. Reset views to go back home
  const handleReset = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    setView("HOME");
    setSource("");
    setTaskId(null);
    setResult(null);
    setChatHistory([]);
    setErrorMsg("");
  };

  return (
    <main className="min-h-screen text-zinc-100 flex flex-col justify-between py-6">
      {/* View Switcher Router */}
      <div className="flex-1">
        {view === "HOME" && (
          <HomeView
            source={source}
            setSource={setSource}
            language={language}
            setLanguage={setLanguage}
            onSubmit={handleSubmitAnalysis}
          />
        )}

        {view === "PROCESSING" && (
          <ProcessingView
            source={source}
            currentStep={currentStep}
          />
        )}

        {view === "SUCCESS" && result && (
          <DashboardView
            result={result}
            chatHistory={chatHistory}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendChat={handleSendChatMessage}
            onClearChat={() => setChatHistory([])}
            isChatLoading={isChatLoading}
            onReset={handleReset}
          />
        )}

        {view === "FAILED" && (
          <ErrorView
            errorMessage={errorMsg}
            onRetry={handleSubmitAnalysis}
            onGoHome={handleReset}
          />
        )}
      </div>

      {/* Global Footer */}
      <footer className="text-center text-[10px] text-zinc-600 font-mono mt-8 border-t border-zinc-950 pt-4 max-w-xl mx-auto w-full">
        AI Video Assistant Core Engine • Running local proxy to FastAPI
      </footer>
    </main>
  );
}
