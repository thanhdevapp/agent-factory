/**
 * Hierarchy Parser & DAG Layout Engine
 * Extracts multi-agent task delegation hierarchies (Multi-Agent DAG)
 * and computes (x, y) coordinates via Layered Hierarchical Layout.
 */

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 140;
export const HORIZONTAL_GAP = 60;
export const VERTICAL_GAP = 140;

/**
 * Parse and build DAG graph from traces and transcript
 * @param {Array} traces - List of session traces from useFactoryTraces
 * @param {string} focusedTraceId - Currently focused trace ID (or null to view all)
 * @param {Array} focusedTurns - Conversation turns for focused trace (if available)
 */
export function buildAgentHierarchy(traces = [], focusedTraceId = null, focusedTurns = []) {
  if (!Array.isArray(traces) || traces.length === 0) {
    return { nodes: [], edges: [], bounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 } };
  }

  // If focusedTraceId is provided, prioritize showing Orchestrator and its subagents
  const targetTrace = traces.find(t => 
    t.traceId === focusedTraceId || 
    t.traces?.[0]?.traceId === focusedTraceId ||
    t.connectionId === focusedTraceId
  ) || traces[0];

  // Extract subagents from invoke_subagent / define_subagent tool calls in transcript
  const subagentsFromTranscript = [];
  if (Array.isArray(focusedTurns)) {
    focusedTurns.forEach((turn, turnIdx) => {
      if (Array.isArray(turn.toolCalls)) {
        turn.toolCalls.forEach((tool) => {
          const name = (tool.name || "").toLowerCase();
          if (name.includes("invoke_subagent") || name.includes("define_subagent")) {
            const rawSub = tool.args?.Subagents || tool.args?.subagents || tool.args;
            const items = Array.isArray(rawSub) ? rawSub : [rawSub];
            items.forEach((item, itemIdx) => {
              if (item && (item.Role || item.role || item.TypeName || item.name)) {
                subagentsFromTranscript.push({
                  id: `sub-${turnIdx}-${itemIdx}-${item.TypeName || item.name || "worker"}`,
                  parentId: targetTrace.traceId || targetTrace.connectionId,
                  role: item.Role || item.role || "Subagent Worker",
                  typeName: item.TypeName || item.name || "specialist",
                  model: item.Model || item.model || null,
                  prompt: item.Prompt || item.prompt || item.system_prompt || "",
                  workspace: item.Workspace || item.workspace || "inherit",
                  status: tool.status === "running" ? "streaming" : "idle",
                  tokens: null,
                  durationMs: null,
                  isSubagent: true,
                });
              }
            });
          }
        });
      }
    });
  }

  // List of root sessions
  const rootTraces = traces.filter(t => !t.parentTraceId);
  const otherTraces = traces.filter(t => t.parentTraceId);

  const rawNodes = [];
  const rawEdges = [];
  const seenNodeIds = new Set();
  const seenEdgeIds = new Set();

  const addNodeSafe = (node) => {
    if (!node || !node.id || seenNodeIds.has(node.id)) return;
    seenNodeIds.add(node.id);
    rawNodes.push(node);
  };

  const addEdgeSafe = (edge) => {
    if (!edge || !edge.id || seenEdgeIds.has(edge.id)) return;
    seenEdgeIds.add(edge.id);
    rawEdges.push(edge);
  };

  // Generate node for focused root session (or all roots)
  const isSingleRootFocus = subagentsFromTranscript.length > 0;
  const activeRoots = isSingleRootFocus ? [targetTrace] : (rootTraces.length > 0 ? rootTraces : traces);

  // 1. Level 0: Root Orchestrators
  activeRoots.forEach((trace) => {
    const traceId = trace.traceId || trace.connectionId;
    addNodeSafe({
      id: traceId,
      level: 0,
      label: trace.account || trace.connectionId || "Orchestrator Agent",
      role: "Lead Orchestrator",
      model: trace.model || null,
      status: trace.state || trace.mode || "idle",
      isLooping: !!trace.isLooping,
      tokens: trace.tokens || null,
      toolsCount: trace.tools?.length ?? trace.logs?.length ?? null,
      clientType: trace.clientType || "cli",
      color: trace.color ? `#${trace.color.toString(16).padStart(6, "0")}` : "#38bdf8",
      isRoot: true,
      traceRef: trace,
    });
  });

  // 2. Level 1: Subagents extracted from transcript or child sessions
  if (subagentsFromTranscript.length > 0) {
    subagentsFromTranscript.forEach((sub) => {
      addNodeSafe({
        id: sub.id,
        level: 1,
        parentId: sub.parentId,
        label: sub.role,
        role: sub.role,
        typeName: sub.typeName,
        model: sub.model,
        status: sub.status,
        prompt: sub.prompt,
        tokens: sub.tokens,
        toolsCount: null,
        clientType: "subagent",
        color: "#818cf8", // Indigo
        isRoot: false,
      });

      addEdgeSafe({
        id: `edge-${sub.parentId}-${sub.id}`,
        fromId: sub.parentId,
        toId: sub.id,
        active: sub.status === "streaming",
        label: sub.typeName,
      });
    });
  }

  // 3. Compute (x, y) coordinates by layer (Hierarchical DAG Layout)
  const nodesByLevel = {};
  rawNodes.forEach(node => {
    if (!nodesByLevel[node.level]) nodesByLevel[node.level] = [];
    nodesByLevel[node.level].push(node);
  });

  const layoutedNodes = [];
  const nodePositionMap = {};

  const startY = 80;
  let maxNodesInLevel = 1;
  Object.values(nodesByLevel).forEach(arr => {
    if (arr.length > maxNodesInLevel) maxNodesInLevel = arr.length;
  });

  const totalContentWidth = maxNodesInLevel * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP;
  const canvasCenter = Math.max(totalContentWidth / 2 + 100, 500);

  Object.keys(nodesByLevel).forEach(lvlStr => {
    const level = parseInt(lvlStr, 10);
    const nodesInLevel = nodesByLevel[level];
    const levelWidth = nodesInLevel.length * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP;
    const levelStartX = canvasCenter - levelWidth / 2;

    nodesInLevel.forEach((node, idx) => {
      const x = Math.round(levelStartX + idx * (NODE_WIDTH + HORIZONTAL_GAP));
      const y = Math.round(startY + level * (NODE_HEIGHT + VERTICAL_GAP));

      const layoutedNode = {
        ...node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      };

      layoutedNodes.push(layoutedNode);
      nodePositionMap[node.id] = layoutedNode;
    });
  });

  // 4. Compute edge coordinates (Cubic Bezier curves)
  const layoutedEdges = [];
  rawEdges.forEach(edge => {
    const fromNode = nodePositionMap[edge.fromId];
    const toNode = nodePositionMap[edge.toId];

    if (fromNode && toNode) {
      const x1 = fromNode.x + fromNode.width / 2;
      const y1 = fromNode.y + fromNode.height;
      const x2 = toNode.x + toNode.width / 2;
      const y2 = toNode.y;

      // Cubic Bezier control points
      const dy = Math.max((y2 - y1) / 2, 40);
      const cx1 = x1;
      const cy1 = y1 + dy;
      const cx2 = x2;
      const cy2 = y2 - dy;

      const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      layoutedEdges.push({
        ...edge,
        fromPos: { x: x1, y: y1 },
        toPos: { x: x2, y: y2 },
        pathData,
      });
    }
  });

  // Compute bounding box for auto-fitting view
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  layoutedNodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x + n.width > maxX) maxX = n.x + n.width;
    if (n.y < minY) minY = n.y;
    if (n.y + n.height > maxY) maxY = n.y + n.height;
  });

  if (!isFinite(minX)) {
    minX = 0; maxX = 1000; minY = 0; maxY = 700;
  }

  return {
    nodes: layoutedNodes,
    edges: layoutedEdges,
    bounds: {
      minX: Math.max(0, minX - 100),
      maxX: maxX + 100,
      minY: Math.max(0, minY - 80),
      maxY: maxY + 100,
    }
  };
}
