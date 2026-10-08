/**
 * Replay Keyframe Normalizer Engine for AGMon Time-Machine
 * 
 * Converts structured session transcripts (Antigravity & Claude Code)
 * into a sequential timeline of interactive keyframe milestones.
 */

import { getPricingForModel } from "../modelPricing.js";

function calculateCost(tokens, modelName) {
  if (!tokens) return null;
  const price = getPricingForModel(modelName);
  if (!price) return null;
  return (
    (tokens.input || 0) * (price.input / 1e6) +
    (tokens.output || 0) * (price.output / 1e6) +
    (tokens.cached || 0) * (price.cached / 1e6)
  );
}

/**
 * Normalizes a transcript object into an ordered array of Timeline Keyframes.
 *
 * @param {object} transcript - Output of getSessionTranscript()
 * @returns {object} { sessionInfo, keyframes, totalElapsedSeconds, totalTokens, totalCost }
 */
export function normalizeTranscriptToKeyframes(transcript) {
  if (!transcript || !Array.isArray(transcript.turns)) {
    return {
      sessionInfo: {},
      keyframes: [],
      totalElapsedSeconds: 0,
      totalTokens: 0,
      totalCost: 0,
    };
  }

  const session = transcript.session || {};
  const turns = transcript.turns || [];
  const modelName = session.model || null;
  const cli = session.cli || "antigravity";

  const keyframes = [];
  let stepCounter = 0;
  let runningInputTokens = 0;
  let runningOutputTokens = 0;
  let runningCachedTokens = 0;

  // Determine baseline timestamp
  let baseTimeMs = Date.now();
  if (session.startedAt) {
    baseTimeMs = new Date(session.startedAt).getTime();
  } else if (turns.length > 0 && turns[0].timestamp) {
    baseTimeMs = new Date(turns[0].timestamp).getTime();
  }

  turns.forEach((turn, turnIdx) => {
    const turnTimeMs = turn.timestamp ? new Date(turn.timestamp).getTime() : baseTimeMs + turnIdx * 5000;
    const elapsedSec = Math.max(0, Math.round((turnTimeMs - baseTimeMs) / 1000));

    // Accumulate tokens if turn has token data
    if (turn.tokens) {
      runningInputTokens += turn.tokens.input || 0;
      runningOutputTokens += turn.tokens.output || 0;
      runningCachedTokens += turn.tokens.cached || 0;
    }

    const currentCumulativeTokens = runningInputTokens + runningOutputTokens + runningCachedTokens;
    const currentCost = calculateCost(
      { input: runningInputTokens, output: runningOutputTokens, cached: runningCachedTokens },
      modelName
    );

    // 1. User Prompt Turn
    if (turn.role === "user") {
      keyframes.push({
        stepIndex: stepCounter++,
        turnIndex: turnIdx,
        timestamp: turn.timestamp || new Date(turnTimeMs).toISOString(),
        elapsedSeconds: elapsedSec,
        type: "user_input",
        milestoneType: "prompt", // For dot color: 'prompt' (amber)
        agentState: "thinking",
        title: "User Prompt",
        summary: turn.content ? turn.content.slice(0, 80) + (turn.content.length > 80 ? "..." : "") : "User message",
        content: turn.content || "",
        cumulativeTokens: currentCumulativeTokens,
        cumulativeCost: currentCost,
        activeTool: null,
      });
      return;
    }

    // 2. Assistant Thinking Phase (if present)
    if (turn.thinking) {
      keyframes.push({
        stepIndex: stepCounter++,
        turnIndex: turnIdx,
        timestamp: turn.timestamp || new Date(turnTimeMs).toISOString(),
        elapsedSeconds: elapsedSec,
        type: "thought",
        milestoneType: "thought",
        agentState: "thinking",
        title: "AI Chain of Thought",
        summary: turn.thinking.slice(0, 90) + (turn.thinking.length > 90 ? "..." : ""),
        content: turn.thinking,
        cumulativeTokens: currentCumulativeTokens,
        cumulativeCost: currentCost,
        activeTool: null,
      });
    }

    // 3. Tool Calls (Execution & Results)
    const toolCalls = turn.toolCalls || [];
    toolCalls.forEach((tool, toolIdx) => {
      const toolElapsed = elapsedSec + (toolIdx + 1) * 2;
      const isFileEdit =
        tool.name === "replace_file_content" ||
        tool.name === "write_to_file" ||
        tool.name?.includes("edit") ||
        tool.name?.includes("write");
      const isCommand = tool.name === "run_command" || tool.name === "bash" || tool.name === "terminal";
      const isSearch = tool.name?.includes("search") || tool.name?.includes("grep") || tool.name?.includes("view");

      let category = "tool";
      if (isFileEdit) category = "file_write";
      else if (isCommand) category = "command";
      else if (isSearch) category = "search";

      keyframes.push({
        stepIndex: stepCounter++,
        turnIndex: turnIdx,
        toolIndex: toolIdx,
        timestamp: turn.timestamp || new Date(turnTimeMs + toolIdx * 2000).toISOString(),
        elapsedSeconds: toolElapsed,
        type: isFileEdit ? "file_write" : "tool_call",
        milestoneType: tool.status === "error" ? "error" : "tool", // 'tool' (cyan) or 'error' (rose)
        agentState: isFileEdit ? "typing" : "running_tool",
        title: `Tool Call: ${tool.name || "tool"}`,
        summary: tool.summary || tool.action || tool.name,
        details: {
          id: tool.id,
          name: tool.name,
          type: category,
          summary: tool.summary,
          args: tool.args || {},
          output: tool.output || "",
          status: tool.status || "completed",
          targetFile: tool.args?.TargetFile || tool.args?.AbsolutePath || null,
        },
        cumulativeTokens: currentCumulativeTokens,
        cumulativeCost: currentCost,
        activeTool: tool.name,
      });
    });

    // 4. Assistant Explanation / Output Reply
    if (turn.content) {
      const replyElapsed = elapsedSec + (toolCalls.length > 0 ? (toolCalls.length + 1) * 2 : 1);
      keyframes.push({
        stepIndex: stepCounter++,
        turnIndex: turnIdx,
        timestamp: turn.timestamp || new Date(turnTimeMs + replyElapsed * 1000).toISOString(),
        elapsedSeconds: replyElapsed,
        type: "assistant_reply",
        milestoneType: "reply",
        agentState: "typing",
        title: "Assistant Reply",
        summary: turn.content.slice(0, 90) + (turn.content.length > 90 ? "..." : ""),
        content: turn.content,
        cumulativeTokens: currentCumulativeTokens,
        cumulativeCost: currentCost,
        activeTool: null,
      });
    }
  });

  // Final Finished Keyframe
  const lastKeyframe = keyframes[keyframes.length - 1];
  const finalElapsed = lastKeyframe ? lastKeyframe.elapsedSeconds + 2 : 5;
  keyframes.push({
    stepIndex: stepCounter++,
    timestamp: new Date().toISOString(),
    elapsedSeconds: finalElapsed,
    type: "finish",
    milestoneType: "finish", // 'finish' (emerald)
    agentState: "done",
    title: "Session Completed",
    summary: `Completed ${turns.length} turns • ${keyframes.length} events`,
    content: "All tasks completed as instructed.",
    cumulativeTokens: runningInputTokens + runningOutputTokens + runningCachedTokens,
    cumulativeCost: calculateCost(
      { input: runningInputTokens, output: runningOutputTokens, cached: runningCachedTokens },
      modelName
    ),
    activeTool: null,
  });

  const totalElapsedSeconds = finalElapsed;
  const totalTokens = runningInputTokens + runningOutputTokens + runningCachedTokens;
  const totalCost = calculateCost(
    { input: runningInputTokens, output: runningOutputTokens, cached: runningCachedTokens },
    modelName
  );

  return {
    sessionInfo: {
      id: session.id || "session",
      cli,
      model: modelName,
      cwd: session.cwd || "",
      startedAt: session.startedAt,
      turnsCount: turns.length,
      totalSteps: keyframes.length,
    },
    keyframes,
    totalElapsedSeconds,
    totalTokens,
    totalCost,
  };
}

/**
 * Synthesizes a real-time trace snapshot from a historical replay keyframe.
 * Enables OfficeCanvas and AgentGraphView to retroactively animate the agent's
 * posture, desk highlight, tool badges, and HUD metrics.
 *
 * @param {object} keyframe - The current active keyframe
 * @param {object} sessionInfo - Metadata about the session
 * @returns {object|null} Trace object compatible with buildOffice() & AgentGraphView
 */
export function synthesizeTraceFromKeyframe(keyframe, sessionInfo = {}) {
  if (!keyframe) return null;

  const sessionId = sessionInfo.id || "replay-session";
  const cli = sessionInfo.cli || "antigravity";
  const model = sessionInfo.model || "gemini-3.8-flash";
  const isApp = sessionInfo.clientType === "app";
  const clientType = isApp ? "app" : "cli";
  const provider = cli === "antigravity" ? "Google" : "Anthropic";

  // Map tool name to office scene tool type (bash, read, edit, search, web, mcp, memory)
  let officeToolType = "mcp";
  const rawTool = (keyframe.activeTool || keyframe.details?.name || "").toLowerCase();
  if (rawTool.includes("bash") || rawTool.includes("command") || rawTool.includes("terminal") || rawTool === "run_command") {
    officeToolType = "bash";
  } else if (rawTool.includes("read") || rawTool.includes("view") || rawTool === "view_file") {
    officeToolType = "read";
  } else if (rawTool.includes("edit") || rawTool.includes("write") || rawTool === "replace_file_content" || rawTool === "write_to_file") {
    officeToolType = "edit";
  } else if (rawTool.includes("search") || rawTool.includes("grep") || rawTool.includes("find")) {
    officeToolType = "search";
  } else if (rawTool.includes("web") || rawTool.includes("browse") || rawTool.includes("url")) {
    officeToolType = "web";
  } else if (rawTool.includes("memory") || rawTool.includes("remember") || rawTool.includes("recall")) {
    officeToolType = "memory";
  }

  let state = "streaming";
  let mode = "streaming";

  if (keyframe.type === "user_input" || keyframe.type === "thought") {
    state = "pending";
    mode = "pending";
  } else if (keyframe.type === "finish") {
    state = "done";
    mode = "happy";
  } else if (keyframe.milestoneType === "error") {
    state = "error";
    mode = "error";
  }

  const toolCalls = keyframe.activeTool
    ? [
        {
          id: keyframe.details?.id || "tool-0",
          tool: officeToolType,
          type: officeToolType,
          name: keyframe.activeTool,
          status: keyframe.details?.status || "completed",
        },
      ]
    : [];

  return {
    connectionId: sessionId,
    traceId: sessionId,
    account: `${cli.toUpperCase()}: ${sessionId.slice(0, 10)}`,
    model,
    provider,
    cli,
    clientType,
    state,
    mode,
    isLooping: false,
    tools: keyframe.activeTool ? [officeToolType] : [],
    toolCalls,
    activeTool: keyframe.activeTool || null,
    tokens: { input: null, output: null, cached: null },
    totalTokens: keyframe.cumulativeTokens ?? null,
    cost: keyframe.cumulativeCost ?? null,
    elapsedMs: (keyframe.elapsedSeconds || 0) * 1000,
    currentCommand: keyframe.title || "",
    summary: keyframe.summary || "",
    isReplay: true,
    logs: [
      {
        id: `replay-log-${keyframe.stepIndex}`,
        time: new Date(keyframe.timestamp || Date.now()).toLocaleTimeString(),
        level: keyframe.milestoneType === "error" ? "error" : "info",
        message: `[Replay #${keyframe.stepIndex + 1}] ${keyframe.title}: ${keyframe.summary}`,
      },
    ],
  };
}
