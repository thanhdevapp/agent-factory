"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  CheckSquare, 
  Square, 
  CircleDot, 
  Circle, 
  Sparkles, 
  Send, 
  CornerDownRight, 
  Check, 
  Copy 
} from "lucide-react";

/**
 * AskQuestionCard Component
 * Hiển thị thẻ Human-in-the-Loop (HITL) cho tool ask_question
 * Cho phép người dùng trực tiếp chọn các option, viết bổ sung và sao chép/gửi câu trả lời
 */
export default function AskQuestionCard({
  args = {},
  onSubmitAnswer,
  className = ""
}) {
  const questions = Array.isArray(args.questions) ? args.questions : [];
  
  // State lưu trữ các lựa chọn của từng câu hỏi { [questionIndex]: [selectedOptionStrings] }
  const [selections, setSelections] = useState(() => {
    const initial = {};
    questions.forEach((q, idx) => {
      // Mặc định chọn recommended option đầu tiên nếu có
      const rec = q.options?.find(opt => opt.startsWith("(Recommended)"));
      if (rec) {
        initial[idx] = [rec];
      } else {
        initial[idx] = [];
      }
    });
    return initial;
  });

  // State lưu custom write-in text cho mỗi câu hỏi
  const [writeIns, setWriteIns] = useState({});
  const [copied, setCopied] = useState(false);

  if (questions.length === 0) return null;

  const handleToggleOption = (qIdx, option, isMulti) => {
    setSelections(prev => {
      const current = prev[qIdx] || [];
      if (isMulti) {
        if (current.includes(option)) {
          return { ...prev, [qIdx]: current.filter(o => o !== option) };
        } else {
          return { ...prev, [qIdx]: [...current, option] };
        }
      } else {
        return { ...prev, [qIdx]: [option] };
      }
    });
  };

  const handleWriteInChange = (qIdx, text) => {
    setWriteIns(prev => ({ ...prev, [qIdx]: text }));
  };

  // Tạo formatted response text
  const formatAnswers = () => {
    return questions.map((q, idx) => {
      const sel = selections[idx] || [];
      const writeIn = writeIns[idx]?.trim();
      let ans = sel.join(", ");
      if (writeIn) {
        ans = ans ? `${ans}; Thêm: ${writeIn}` : writeIn;
      }
      return `Q${idx + 1}: ${q.question}\nA: ${ans || "Chưa chọn"}`;
    }).join("\n\n");
  };

  const handleCopyAnswers = () => {
    const text = formatAnswers();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    const formatted = formatAnswers();
    if (onSubmitAnswer) {
      onSubmitAnswer(formatted);
    } else {
      handleCopyAnswers();
    }
  };

  return (
    <div className={`rounded-xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 via-slate-900/90 to-slate-950 p-4 text-xs shadow-xl backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Human-in-the-Loop Inquiry</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                {questions.length} {questions.length > 1 ? "questions" : "question"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Agent cần bạn làm rõ hoặc đưa ra quyết định để tiếp tục
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyAnswers}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          title="Sao chép các câu trả lời"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Đã copy" : "Copy phản hồi"}</span>
        </button>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const isMulti = !!q.is_multi_select;
          const currentSelected = selections[qIdx] || [];

          return (
            <div key={qIdx} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 space-y-2.5">
              {/* Question title */}
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] shrink-0 mt-0.5 font-semibold">
                  Q{qIdx + 1}
                </span>
                <div className="font-medium text-slate-200 text-xs leading-relaxed">
                  {q.question}
                  {isMulti && (
                    <span className="ml-2 text-[10px] text-indigo-400 font-normal italic">
                      (Có thể chọn nhiều)
                    </span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-6">
                {(q.options || []).map((opt, optIdx) => {
                  const isSelected = currentSelected.includes(opt);
                  const isRecommended = opt.startsWith("(Recommended)");
                  const cleanText = isRecommended ? opt.replace("(Recommended)", "").trim() : opt;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleToggleOption(qIdx, opt, isMulti)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer select-none transition-all border ${
                        isSelected
                          ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-200"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      {/* Checkbox / Radio Icon */}
                      <div className="mt-0.5 shrink-0 text-indigo-400">
                        {isMulti ? (
                          isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />
                        ) : (
                          isSelected ? <CircleDot className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      {/* Option Text & Badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs leading-relaxed">{cleanText}</span>
                          {isRecommended && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-sans px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              Khuyến nghị
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Write-in Input option */}
                <div className="pt-1 flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={writeIns[qIdx] || ""}
                    onChange={(e) => handleWriteInChange(qIdx, e.target.value)}
                    placeholder="Ý kiến hoặc chỉ thị khác của bạn..."
                    className="bg-slate-950/80 border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 flex-1 font-sans"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Submit Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400">
          Chọn các phương án trên và ấn gửi phản hồi cho Agent.
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gửi quyết định</span>
        </button>
      </div>
    </div>
  );
}
