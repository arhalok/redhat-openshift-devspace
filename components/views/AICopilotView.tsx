'use client';

import React, { useState } from 'react';
import { useLogistics } from '../../lib/logistics-state';
import {
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Bot,
  User,
  Check,
  Fuel,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  answer?: string;
  evidence?: string[];
  recommendedAction?: string;
  actionType?: 'REASSIGN_STOPS' | 'CONSOLIDATE_ORDERS' | 'REALLOCATE_VEHICLE' | 'TRIGGER_REPLENISHMENT';
  actionApplied?: boolean;
}

export function AICopilotView() {
  const {
    addToast,
    applyExceptionFix,
    setConsolidationState,
    applyConsolidation,
    setActiveTab,
  } = useLogistics();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: '14:02',
      answer: '11 deliveries are currently at risk across the Bangalore distribution network.',
      evidence: [
        '5 vehicle reassignment issues on arterial corridors',
        '3 supplier delays at Kaveri Perishables cold facility',
        '2 overloaded routes exceeding cubic capacity (Route R-124)',
        '1 warehouse staging delay at Central Depot',
      ],
      recommendedAction: 'Move stops 4 and 5 from Route R-124 to Route R-131.',
      actionType: 'REASSIGN_STOPS',
      actionApplied: false,
    },
  ]);

  const [confirmDialogAction, setConfirmDialogAction] = useState<CopilotMessage | null>(null);

  const suggestedPrompts = [
    'Why are deliveries delayed today?',
    'Which stores are at stockout risk?',
    'Find unused vehicle capacity.',
    'What should we optimize first?',
    'What changed in today’s network?',
    'Simulate a 20% demand increase.',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answer: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulated contextual AI response conforming to Section 28
    setTimeout(() => {
      const lower = text.toLowerCase();
      let assistantMsg: CopilotMessage;

      if (lower.includes('stockout') || lower.includes('store')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          answer: 'Laxmi Retail (Jayanagar) is at critical stockout risk with only 1 bag of Atta remaining.',
          evidence: [
            'Current on-hand inventory: 1 bag of Aashirvaad Atta 10kg',
            'Cluster consumption velocity: 5.4 bags/day',
            'Stockout projected in 3.6 hours',
            'Supplier lead time: 18 hours',
          ],
          recommendedAction: 'Batch emergency replenishment order with Apex FMCG Hub.',
          actionType: 'TRIGGER_REPLENISHMENT',
          actionApplied: false,
        };
      } else if (lower.includes('capacity') || lower.includes('unused') || lower.includes('vehicle')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          answer: 'Vehicle V-027 has 38% unused payload on its Jayanagar return leg.',
          evidence: [
            'Vehicle V-027 completing 6 drops with 190 kg surplus capacity',
            'Delta East Hub has 340 kg secondary packaging return ready',
            'Pickup deviation is only 2.8 km along the Old Madras Road corridor',
          ],
          recommendedAction: 'Assign backhaul load to V-027 to raise utilization to 91%.',
          actionType: 'REALLOCATE_VEHICLE',
          actionApplied: false,
        };
      } else if (lower.includes('optimize') || lower.includes('consolidat')) {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          answer: 'Consolidate 12 fragmented orders in East Bangalore to save 16.8 km.',
          evidence: [
            '12 separate orders share 10:00–14:00 delivery windows',
            'Combined cargo fits 4 Tata Ace payload envelopes',
            'Reduces fleet requirement by 4 vehicles (₹3,200 fuel savings)',
          ],
          recommendedAction: 'Apply dynamic consolidation proposal C-801.',
          actionType: 'CONSOLIDATE_ORDERS',
          actionApplied: false,
        };
      } else {
        assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          answer: 'Network telemetry is operating within acceptable limits across 61 routes.',
          evidence: [
            'On-time SLA compliance: 94.2%',
            'Average vehicle capacity utilization: 76.4%',
            'Active exceptions: 3 items requiring supervisor review',
          ],
          recommendedAction: 'Review open exceptions in Control Tower.',
          actionType: 'REASSIGN_STOPS',
          actionApplied: false,
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  const handleApplyAction = (msg: CopilotMessage) => {
    // Open Confirmation Dialog (Section 29: Preview -> User confirmation -> Execute -> Audit event)
    setConfirmDialogAction(msg);
  };

  const executeConfirmedAction = () => {
    if (!confirmDialogAction) return;

    if (confirmDialogAction.actionType === 'REASSIGN_STOPS') {
      applyExceptionFix('exc-delay-r124');
    } else if (confirmDialogAction.actionType === 'CONSOLIDATE_ORDERS') {
      applyConsolidation();
      setActiveTab('consolidation');
    } else if (confirmDialogAction.actionType === 'TRIGGER_REPLENISHMENT') {
      setActiveTab('stores');
      addToast('Replenishment Opened', 'Navigated to Jayanagar store catalog.', 'info');
    } else {
      addToast('Operational Action Executed', 'Fleet schedule updated with audit log entry #AUD-8821.', 'success');
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === confirmDialogAction.id ? { ...m, actionApplied: true } : m))
    );
    setConfirmDialogAction(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Operations Copilot
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
            STRUCTURED REASONING
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Operational inquiry engine delivering structured answers, telemetry evidence, and verified action previews.
        </p>
      </div>

      {/* Suggested Quick Prompts (Section 27) */}
      <div>
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Suggested Operational Queries:
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-xs text-gray-300 transition text-left"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed (Section 28) */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-xl min-h-[380px] flex flex-col justify-between">
        <div className="space-y-5 overflow-y-auto max-h-[460px] pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.sender === 'user' ? (
                /* User Prompt Bubble */
                <div className="flex items-start justify-end gap-2.5">
                  <div className="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none max-w-md shadow-md">
                    <div className="font-medium">{msg.answer}</div>
                    <div className="text-[10px] text-blue-200 mt-1 text-right">{msg.timestamp}</div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                /* Assistant Structured Response Card (Section 28) */
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md space-y-3">
                    {/* 1. Answer */}
                    <div className="text-sm font-semibold text-white leading-relaxed">
                      {msg.answer}
                    </div>

                    {/* 2. Evidence */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="p-3 rounded-lg bg-[#070b14] border border-gray-800 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Telemetry Evidence:
                        </div>
                        {msg.evidence.map((ev, i) => (
                          <div key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                            <span className="text-blue-400">•</span>
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Recommended Action */}
                    {msg.recommendedAction && (
                      <div className="text-xs text-emerald-400 font-medium">
                        <strong>Recommended:</strong> {msg.recommendedAction}
                      </div>
                    )}

                    {/* 4. Action Buttons (Section 28) */}
                    {msg.recommendedAction && (
                      <div className="pt-2 border-t border-gray-800 flex items-center gap-2">
                        {msg.actionApplied ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Action Applied to Network
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                addToast('Action Preview', `Projected impact: ${msg.recommendedAction}`, 'info')
                              }
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleApplyAction(msg)}
                              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                            >
                              <span>Apply Action</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder="Ask about route delays, inventory stockouts, or vehicle capacity..."
            className="flex-1 bg-[#0b0f19] border border-gray-700 text-xs rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSend(inputQuery)}
            className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog (Section 29) */}
      {confirmDialogAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmDialogAction(null)}
          />

          <div className="relative w-full max-w-md bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Operational Action
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Section 29: Non-reversible operational changes require explicit authorization.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-gray-800 text-xs">
              <div className="font-semibold text-white">Action to execute:</div>
              <div className="text-gray-300 mt-1">{confirmDialogAction.recommendedAction}</div>
              <div className="text-[11px] text-gray-500 font-mono mt-2">
                Audit event will be committed to <code>audit_log_20261006</code>.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialogAction(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow"
              >
                Authorize & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
