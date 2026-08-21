import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  GitFork, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Scale, 
  Play, 
  ArrowRight, 
  ShieldAlert, 
  BookOpen, 
  Eye, 
  Info,
  Compass,
  Flame,
  Award,
  Box
} from 'lucide-react';
import { BeltLevel, Technique } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { 
  TECHNIQUE_FLOW_SCENARIOS, 
  TechniqueFlowScenario, 
  PathNode, 
  PathEdge, 
  EdgeType 
} from '../data/techniquePaths';
import { Technique3DViewer } from './Technique3DViewer';

interface TechniquePathViewProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  trainedMoves: string[];
  toggleTrained: (id: string) => void;
  userBelt: BeltLevel;
  onNavigateToTechnique?: (techId: string) => void;
  onCompareTechnique?: (techId: string) => void;
}

const BELT_BADGES: Record<BeltLevel, { label: string; bg: string; text: string; border: string; colorHex: string }> = {
  branca: { label: 'Branca', bg: 'bg-stone-100', text: 'text-stone-950', border: 'border-stone-400', colorHex: '#f5f5f4' },
  azul: { label: 'Azul', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500', colorHex: '#2563eb' },
  roxa: { label: 'Roxa', bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500', colorHex: '#9333ea' },
  marrom: { label: 'Marrom', bg: 'bg-amber-900', text: 'text-amber-100', border: 'border-amber-700', colorHex: '#78350f' },
  preta: { label: 'Preta', bg: 'bg-zinc-950', text: 'text-red-500', border: 'border-red-600', colorHex: '#dc2626' },
  coral: { label: 'Coral', bg: 'bg-red-700', text: 'text-amber-200', border: 'border-red-500', colorHex: '#b91c1c' },
  vermelha: { label: 'Vermelha', bg: 'bg-red-800', text: 'text-amber-300', border: 'border-amber-500', colorHex: '#991b1b' },
};

const EDGE_COLORS: Record<EdgeType, { stroke: string; labelBg: string; text: string; name: string }> = {
  primary_attack: { stroke: '#ef4444', labelBg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', name: 'Ataque Primário' },
  opponent_reaction: { stroke: '#38bdf8', labelBg: 'rgba(56, 189, 248, 0.15)', text: '#7dd3fc', name: 'Reação / Defesa do Oponente' },
  counter_transition: { stroke: '#c084fc', labelBg: 'rgba(192, 132, 252, 0.15)', text: '#e9d5ff', name: 'Contragolpe / Transição' },
  sweep_point: { stroke: '#10b981', labelBg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', name: 'Raspagem (+2 Pts)' },
  pass_point: { stroke: '#f59e0b', labelBg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', name: 'Passagem (+3 Pts)' },
  submission_finish: { stroke: '#f43f5e', labelBg: 'rgba(244, 63, 94, 0.25)', text: '#fda4af', name: 'Finalização (Tap-Out)' }
};

export const TechniquePathView: React.FC<TechniquePathViewProps> = ({
  favorites,
  toggleFavorite,
  trainedMoves,
  toggleTrained,
  userBelt,
  onNavigateToTechnique,
  onCompareTechnique
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(TECHNIQUE_FLOW_SCENARIOS[0].id);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBeltFilter, setSelectedBeltFilter] = useState<BeltLevel | 'todas'>('todas');
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);
  const [simulatorStepIndex, setSimulatorStepIndex] = useState<number>(0);
  const [simulatorHistory, setSimulatorHistory] = useState<string[]>([]);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const currentScenario = useMemo(() => {
    return TECHNIQUE_FLOW_SCENARIOS.find(s => s.id === selectedScenarioId) || TECHNIQUE_FLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Lookup full technique details from TECHNIQUES if matched
  const matchedTechnique = useMemo<Technique | null>(() => {
    if (!selectedNode?.techniqueId) return null;
    return TECHNIQUES.find(t => t.id === selectedNode.techniqueId) || null;
  }, [selectedNode]);

  // Compute Layout coordinates for nodes
  const layoutData = useMemo(() => {
    const nodes = currentScenario.nodes;
    const edges = currentScenario.edges;
    
    // Group into logical hierarchical depth levels
    const depthMap = new Map<string, number>();
    depthMap.set(currentScenario.rootNodeId, 0);

    // BFS to assign depths
    const queue: string[] = [currentScenario.rootNodeId];
    const visited = new Set<string>([currentScenario.rootNodeId]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentDepth = depthMap.get(currentId) || 0;

      const outgoingEdges = edges.filter(e => e.source === currentId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          depthMap.set(edge.target, currentDepth + 1);
          queue.push(edge.target);
        }
      }
    }

    // Assign fallback depth for unreached nodes
    nodes.forEach(n => {
      if (!depthMap.has(n.id)) {
        depthMap.set(n.id, 2);
      }
    });

    // Group nodes by depth
    const columns: Record<number, PathNode[]> = {};
    nodes.forEach(n => {
      const d = depthMap.get(n.id) || 0;
      if (!columns[d]) columns[d] = [];
      columns[d].push(n);
    });

    const maxDepth = Math.max(...Object.keys(columns).map(Number), 0);
    const colSpacing = 340;
    const rowSpacing = 160;
    const nodeWidth = 240;
    const nodeHeight = 110;

    const positionedNodes = nodes.map(n => {
      const depth = depthMap.get(n.id) || 0;
      const colNodes = columns[depth] || [n];
      const indexInCol = colNodes.findIndex(item => item.id === n.id);
      
      const totalColHeight = colNodes.length * rowSpacing;
      const startY = 320 - (totalColHeight / 2) + (rowSpacing / 2);

      const x = 80 + depth * colSpacing;
      const y = startY + indexInCol * rowSpacing;

      return {
        ...n,
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        depth
      };
    });

    const totalWidth = Math.max(1200, 160 + (maxDepth + 1) * colSpacing);
    const totalHeight = 850;

    return {
      nodes: positionedNodes,
      edges,
      width: totalWidth,
      height: totalHeight
    };
  }, [currentScenario]);

  // Set initial selected node to root when switching scenario
  useEffect(() => {
    const root = currentScenario.nodes.find(n => n.id === currentScenario.rootNodeId) || currentScenario.nodes[0];
    setSelectedNode(root || null);
    setSimulatorHistory([currentScenario.rootNodeId]);
    setSimulatorStepIndex(0);
  }, [currentScenario]);

  // Setup D3 Zoom & Pan
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Reset zoom on scenario change
    svg.transition().duration(500).call(
      zoom.transform,
      d3.zoomIdentity.translate(40, 20).scale(0.85)
    );
  }, [selectedScenarioId]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(40, 20).scale(0.85)
    );
  };

  // Connected nodes map for hover highlights
  const highlightedEdges = useMemo(() => {
    if (!hoveredNodeId && !selectedNode) return new Set<string>();
    const activeId = hoveredNodeId || selectedNode?.id;
    const connected = new Set<string>();

    currentScenario.edges.forEach(e => {
      if (e.source === activeId || e.target === activeId) {
        connected.add(e.id);
      }
    });
    return connected;
  }, [hoveredNodeId, selectedNode, currentScenario.edges]);

  // Simulator navigation helper
  const availableSimulatorBranches = useMemo(() => {
    const currentId = simulatorHistory[simulatorHistory.length - 1];
    return currentScenario.edges.filter(e => e.source === currentId);
  }, [simulatorHistory, currentScenario.edges]);

  const handleSimulatorChoice = (targetNodeId: string) => {
    setSimulatorHistory(prev => [...prev, targetNodeId]);
    const targetNode = currentScenario.nodes.find(n => n.id === targetNodeId);
    if (targetNode) {
      setSelectedNode(targetNode);
    }
  };

  const handleSimulatorRestart = () => {
    setSimulatorHistory([currentScenario.rootNodeId]);
    const root = currentScenario.nodes.find(n => n.id === currentScenario.rootNodeId);
    if (root) setSelectedNode(root);
  };

  return (
    <div id="technique-path-view-container" className="space-y-8 animate-fadeIn text-zinc-100">
      {/* Header Banner with Bushido & Warrior Styling */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#12080a] via-[#1a0f12] to-[#0c0c12] border border-red-900/40 p-6 sm:p-8 shadow-2xl">
        {/* Background Kanji Watermark */}
        <div className="absolute right-6 -bottom-10 text-[130px] font-black text-red-600/[0.04] pointer-events-none select-none font-serif">
          技道
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-80" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 shadow-inner">
                <GitFork className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest uppercase text-red-400 font-mono">
                    FLOW MAP & DECISION TREE • 技の道
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold">
                    D3 Interactive
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-warrior tracking-wide text-zinc-100 flex items-center gap-2">
                  Caminho Técnico & Cadeias de Golpes
                </h1>
              </div>
            </div>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Visualize como cada golpe se conecta logicamente no Jiu-Jitsu. Explore o encadeamento de ataques primários, reações defensivas do oponente, contragolpes imediatos e transições para a vitória.
            </p>
          </div>

          {/* Quick Stats or Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-toggle-simulator-mode"
              onClick={() => setIsSimulatorMode(!isSimulatorMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isSimulatorMode
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-zinc-950 shadow-lg shadow-red-600/30 scale-[1.02]'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{isSimulatorMode ? 'Sair do Simulador' : 'Modo Simulador de Decisão'}</span>
            </button>

            <button
              id="btn-recenter-graph"
              onClick={handleResetZoom}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all"
              title="Recentralizar Mapa"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Resetar Vista</span>
            </button>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="mt-6 pt-5 border-t border-red-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TECHNIQUE_FLOW_SCENARIOS.map(sc => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                id={`btn-scenario-${sc.id}`}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setIsSimulatorMode(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40 border border-red-500 scale-[1.02]'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span className="text-sm font-serif text-amber-300/80">{sc.kanji}</span>
                <span>{sc.startingPosition}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-zinc-300 font-mono">
                  {sc.nodes.length} nós
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e0e14] border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar golpe no mapa..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Belt Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-zinc-400 hidden sm:inline">Faixa:</span>
            <select
              value={selectedBeltFilter}
              onChange={(e) => setSelectedBeltFilter(e.target.value as BeltLevel | 'todas')}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500"
            >
              <option value="todas">Todas as Faixas</option>
              <option value="branca">Branca +</option>
              <option value="azul">Azul +</option>
              <option value="roxa">Roxa +</option>
              <option value="marrom">Marrom +</option>
              <option value="preta">Preta</option>
            </select>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] w-full md:w-auto justify-start md:justify-end">
          {Object.entries(EDGE_COLORS).map(([key, config]) => (
            <div 
              key={key} 
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-zinc-800 bg-zinc-900/60"
            >
              <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: config.stroke }} />
              <span className="text-zinc-400 text-[10px] font-medium">{config.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Mode Walkthrough Card if active */}
      {isSimulatorMode && (
        <div className="bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-900 border-2 border-red-600/50 rounded-2xl p-5 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h3 className="text-base font-bold font-warrior text-zinc-100 flex items-center gap-2">
                  Simulador de Combate & Tomada de Decisão
                </h3>
                <p className="text-xs text-zinc-400">
                  Passo {simulatorHistory.length}: Escolha o movimento ou reaja ao oponente
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulatorRestart}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Simulação</span>
            </button>
          </div>

          {/* Current Node in Simulator */}
          {selectedNode && (
            <div className="bg-zinc-900/80 border border-zinc-700/70 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  Posição Atual no Tabuleiro:
                </span>
                <span className="text-xs font-serif text-amber-400">{selectedNode.kanji}</span>
              </div>
              <h4 className="text-lg font-black text-white">{selectedNode.label}</h4>
              <p className="text-xs text-zinc-300">{selectedNode.description}</p>
              {selectedNode.tacticalTip && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Segredo Tático:</strong> {selectedNode.tacticalTip}</span>
                </div>
              )}
            </div>
          )}

          {/* Available Next Moves / Branches */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
              <span>Próximas Opções de Ação / Reações Possíveis:</span>
            </span>

            {availableSimulatorBranches.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                <span>🏆 Fim da Linha de Combate! Posição concluída com sucesso.</span>
                <button
                  onClick={handleSimulatorRestart}
                  className="px-3 py-1 bg-emerald-600 text-zinc-950 rounded-lg text-xs font-black hover:bg-emerald-500"
                >
                  Jogar Novamente
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSimulatorBranches.map(branch => {
                  const targetNode = currentScenario.nodes.find(n => n.id === branch.target);
                  const edgeStyle = EDGE_COLORS[branch.edgeType];
                  if (!targetNode) return null;

                  return (
                    <button
                      key={branch.id}
                      onClick={() => handleSimulatorChoice(branch.target)}
                      className="group p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500 text-left transition-all flex flex-col justify-between gap-2 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded border"
                          style={{ backgroundColor: edgeStyle.labelBg, borderColor: edgeStyle.stroke, color: edgeStyle.text }}
                        >
                          {branch.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-zinc-100 group-hover:text-amber-300">
                          {targetNode.label}
                        </div>
                        <div className="text-[11px] text-zinc-400 line-clamp-1">
                          {targetNode.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main D3 Interactive Visualizer Stage */}
      <div className="relative rounded-3xl bg-[#09090d] border border-zinc-800 shadow-2xl overflow-hidden min-h-[580px] sm:min-h-[640px]">
        {/* Floating Zoom & Canvas Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-zinc-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Resetar Posição"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Dojo Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px), radial-gradient(#ffffff 1px, #09090d 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} 
        />

        {/* D3 SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-[580px] sm:h-[640px] cursor-grab active:cursor-grabbing select-none"
          viewBox={`0 0 ${layoutData.width} ${layoutData.height}`}
        >
          <defs>
            {/* Markers for Arrowheads */}
            {Object.entries(EDGE_COLORS).map(([key, config]) => (
              <marker
                key={`marker-${key}`}
                id={`arrow-${key}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={config.stroke} />
              </marker>
            ))}

            {/* Glowing filter for highlighted connections */}
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* D3 Transformed Group */}
          <g ref={gRef}>
            {/* Connection Edges (Curved Bezier Paths) */}
            <g className="edges-layer">
              {layoutData.edges.map((edge) => {
                const sourceNode = layoutData.nodes.find(n => n.id === edge.source);
                const targetNode = layoutData.nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const sx = (sourceNode.x || 0) + (sourceNode.width || 240);
                const sy = (sourceNode.y || 0) + (sourceNode.height || 110) / 2;
                const tx = targetNode.x || 0;
                const ty = (targetNode.y || 0) + (targetNode.height || 110) / 2;

                const dx = tx - sx;
                const controlX1 = sx + dx * 0.45;
                const controlX2 = tx - dx * 0.45;

                const pathData = `M ${sx} ${sy} C ${controlX1} ${sy}, ${controlX2} ${ty}, ${tx} ${ty}`;
                const midX = (sx + tx) / 2;
                const midY = (sy + ty) / 2;

                const isHighlighted = highlightedEdges.has(edge.id);
                const edgeConfig = EDGE_COLORS[edge.edgeType] || EDGE_COLORS.primary_attack;

                return (
                  <g key={edge.id} className="edge-group">
                    {/* Shadow / Glow line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={edgeConfig.stroke}
                      strokeWidth={isHighlighted ? 4 : 2}
                      strokeOpacity={isHighlighted ? 0.9 : 0.4}
                      filter={isHighlighted ? 'url(#glow-edge)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Animated flow dash line if active/animated */}
                    {(edge.isAnimated || isHighlighted) && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={2}
                        strokeDasharray="6 8"
                        className="animate-flow"
                        strokeOpacity={0.8}
                      />
                    )}

                    {/* Arrowhead endpoint */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="transparent"
                      markerEnd={`url(#arrow-${edge.edgeType})`}
                    />

                    {/* Edge Label Badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-70"
                        y="-11"
                        width="140"
                        height="22"
                        rx="11"
                        fill="#0c0c12"
                        stroke={isHighlighted ? edgeConfig.stroke : '#27272a'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill={isHighlighted ? '#ffffff' : edgeConfig.text}
                        className="font-sans select-none"
                      >
                        {edge.label.length > 24 ? edge.label.substring(0, 22) + '...' : edge.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Nodes Layer with Custom Martial Visual Cards */}
            <g className="nodes-layer">
              {layoutData.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNodeId === node.id;
                const beltBadge = BELT_BADGES[node.minBelt];
                const isTrained = node.techniqueId ? trainedMoves.includes(node.techniqueId) : false;

                // Check search filter match
                const isSearchMatch = searchQuery.trim() !== '' && (
                  node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  node.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

                // Check belt filter match
                const isBeltMatch = selectedBeltFilter === 'todas' || node.minBelt === selectedBeltFilter;

                let borderColor = '#27272a';
                let glowColor = 'transparent';

                if (node.type === 'root_position') {
                  borderColor = '#e11d48';
                  glowColor = 'rgba(225, 29, 72, 0.2)';
                } else if (node.type === 'outcome') {
                  borderColor = '#10b981';
                  glowColor = 'rgba(16, 185, 129, 0.2)';
                } else if (isSelected) {
                  borderColor = '#f59e0b';
                  glowColor = 'rgba(245, 158, 11, 0.3)';
                } else if (isHovered) {
                  borderColor = '#ef4444';
                  glowColor = 'rgba(239, 68, 68, 0.2)';
                }

                return (
                  <g
                    key={node.id}
                    id={`svg-node-${node.id}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer transition-all duration-200"
                    opacity={(!isBeltMatch && selectedBeltFilter !== 'todas') ? 0.35 : 1}
                  >
                    {/* Node Container Card Box */}
                    <foreignObject width={node.width} height={node.height}>
                      <div
                        className={`h-full w-full rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 select-none ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#1c1417] to-[#120e10] border-2 shadow-2xl scale-[1.03]'
                            : 'bg-gradient-to-b from-[#13131a] to-[#0c0c11] border hover:border-red-500/70 hover:scale-[1.02]'
                        }`}
                        style={{
                          borderColor: borderColor,
                          boxShadow: isSelected || isHovered ? `0 8px 24px ${glowColor}` : 'none'
                        }}
                      >
                        {/* Top Node Header Row */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${beltBadge.bg} ${beltBadge.text} ${beltBadge.border}`}>
                              {beltBadge.label}
                            </span>
                            {node.points && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800">
                                +{node.points} Pts
                              </span>
                            )}
                            {isTrained && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          
                          {node.kanji && (
                            <span className="text-xs font-serif text-amber-400/80 font-bold">
                              {node.kanji}
                            </span>
                          )}
                        </div>

                        {/* Middle Node Title */}
                        <div>
                          <h4 className={`text-xs font-bold leading-tight font-warrior ${
                            isSelected ? 'text-amber-300' : isSearchMatch ? 'text-red-400' : 'text-zinc-100'
                          }`}>
                            {node.label}
                          </h4>
                          <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                            {node.description}
                          </p>
                        </div>

                        {/* Bottom Tag / Indicator */}
                        <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-zinc-800/80 pt-1">
                          <span className="capitalize">{node.category}</span>
                          <span className="flex items-center gap-0.5 text-amber-400/80 group-hover:text-amber-300">
                            <span>Ver detalhes</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      {/* Selected Node Detailed Inspector & Action Drawer */}
      {selectedNode && (
        <div className="bg-[#0f0f15] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border uppercase tracking-wider ${BELT_BADGES[selectedNode.minBelt].bg} ${BELT_BADGES[selectedNode.minBelt].text} ${BELT_BADGES[selectedNode.minBelt].border}`}>
                  Faixa {BELT_BADGES[selectedNode.minBelt].label}
                </span>
                {selectedNode.points && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                    +{selectedNode.points} Pontos IBJJF
                  </span>
                )}
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  {selectedNode.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-warrior text-zinc-100 flex items-center gap-3">
                <span>{selectedNode.label}</span>
                {selectedNode.kanji && (
                  <span className="text-sm font-serif text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    {selectedNode.kanji}
                  </span>
                )}
              </h3>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {matchedTechnique && (
                <>
                  <button
                    id="btn-inspector-toggle-trained"
                    onClick={() => toggleTrained(matchedTechnique.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      trainedMoves.includes(matchedTechnique.id)
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{trainedMoves.includes(matchedTechnique.id) ? 'Golpe Dominado' : 'Marcar Treinado'}</span>
                  </button>

                  <button
                    id="btn-inspector-3d"
                    onClick={() => setIs3DModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                  >
                    <Box className="w-4 h-4 text-purple-400" />
                    <span>Visualizador 3D</span>
                  </button>

                  {onCompareTechnique && (
                    <button
                      id="btn-inspector-compare"
                      onClick={() => onCompareTechnique(matchedTechnique.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                    >
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span>Comparar Golpe</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description & Tactical tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-red-400" />
                  <span>Resumo do Conceito & Alavanca:</span>
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                  {matchedTechnique ? matchedTechnique.summary : selectedNode.description}
                </p>
              </div>

              {selectedNode.tacticalTip && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Segredo Biomecânico Invisível</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {selectedNode.tacticalTip}
                  </p>
                </div>
              )}
            </div>

            {/* Step by step or Connections */}
            <div className="space-y-4">
              {matchedTechnique ? (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Checkpoints de Execução Técnica:</span>
                  </h4>
                  <ul className="space-y-2 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                    {matchedTechnique.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-red-600/20 text-red-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Papel Tático na Árvore de Decisão:</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Esta posição funciona como um pivô de controle no sistema. A partir deste estado, o atleta dita o ritmo da luta, limitando as reações do adversário e forçando aberturas para finalização ou avanço de pontuação.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Viewer Modal if opened */}
      {is3DModalOpen && matchedTechnique && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0d0d12] border border-red-900/40 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Box className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold font-warrior text-zinc-100">
                  Modelo 3D Interativo: {matchedTechnique.name}
                </h3>
              </div>
              <button
                onClick={() => setIs3DModalOpen(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold"
              >
                Fechar ✕
              </button>
            </div>

            <div className="h-[440px] rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <Technique3DViewer technique={matchedTechnique} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
