"use client";

import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
    Maximize2,
    RotateCcw,
    Download,
    AlertCircle,
    Code2,
    Eye,
    Type,
    GitGraph,
    Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Instrument Sans, sans-serif',
    themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#000000',
        primaryBorderColor: '#333333',
        lineColor: '#555555',
        secondaryColor: '#111111',
        tertiaryColor: '#0a0a0a'
    }
});

interface DiagramEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function DiagramEditor({ value, onChange }: DiagramEditorProps) {
    const [previewSvg, setPreviewSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
    const previewRef = useRef<HTMLDivElement>(null);

    const defaultCode = value || `graph TD
    A[User] --> B(Load Balancer)
    B --> C{Strategy}
    C -->|Round Robin| D[Server 1]
    C -->|Least Conn| E[Server 2]`;

    useEffect(() => {
        if (!value) {
            onChange(defaultCode);
        }
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!value) return;
            try {
                const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                const { svg } = await mermaid.render(id, value);
                setPreviewSvg(svg);
                setError(null);
            } catch (err: any) {
                console.error('Mermaid render error:', err);
                setError('Syntax error in diagram definition');
                // Don't update SVG if there's an error to keep the last valid one
            }
        };

        const timeoutId = setTimeout(renderDiagram, 300);
        return () => clearTimeout(timeoutId);
    }, [value]);

    const templates = [
        { name: 'Flowchart', code: 'graph TD\n  Start --> Stop' },
        { name: 'Sequence', code: 'sequenceDiagram\n  Alice->>John: Hello John, how are you?' },
        { name: 'Class', code: 'classDiagram\n  Class01 <|-- AveryLongClass' },
        { name: 'State', code: 'stateDiagram-v2\n  [*] --> State1' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/60 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-white/5">
                        <button
                            onClick={() => setViewMode('editor')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'editor' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            <Code2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('split')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            <Square className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mr-2">Templates:</span>
                        {templates.map(t => (
                            <button
                                key={t.name}
                                onClick={() => onChange(t.code)}
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[9px] font-bold text-neutral-400 hover:text-white transition-all border border-white/5"
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {error && (
                        <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {error}
                        </div>
                    )}
                    <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex min-h-0 relative">
                <AnimatePresence mode="wait">
                    {(viewMode === 'editor' || viewMode === 'split') && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`flex flex-col h-full ${viewMode === 'split' ? 'w-1/2 border-r border-white/5' : 'w-full'}`}
                        >
                            <div className="p-4 flex-1 flex flex-col">
                                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-3 block">Diagram Definition</label>
                                <textarea
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="Enter Mermaid syntax..."
                                    className="flex-1 bg-transparent border-none text-neutral-300 font-mono text-sm leading-relaxed focus:outline-none resize-none custom-scrollbar selection:bg-white selection:text-black"
                                    spellCheck={false}
                                />
                            </div>
                        </motion.div>
                    )}

                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`flex flex-col h-full bg-black/20 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}
                        >
                            <div className="p-4 flex-1 flex flex-col min-h-0">
                                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-3 block">Live Architecture Preview</label>
                                <div
                                    ref={previewRef}
                                    className="flex-1 flex items-center justify-center bg-neutral-900/10 rounded-xl overflow-auto border border-white/5 p-8 mermaid-preview"
                                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hint Bar */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between bg-black/40 shrink-0">
                <div className="flex items-center gap-4 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3 h-3 text-neutral-600" />
                        Pan/Zoom Supported
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Download className="w-3 h-3 text-neutral-600" />
                        SVG Export
                    </div>
                </div>
                <div className="text-[9px] font-bold text-neutral-500">
                    Press <span className="text-white">Ctrl+Enter</span> to sync with AI
                </div>
            </div>

            <style jsx global>{`
                .mermaid-preview svg {
                    max-width: 100% !important;
                    height: auto !important;
                    filter: invert(0) !important;
                }
                .mermaid-preview .node rect, 
                .mermaid-preview .node circle, 
                .mermaid-preview .node polygon, 
                .mermaid-preview .node path {
                    fill: #000 !important;
                    stroke: #fff !important;
                    stroke-width: 1px !important;
                }
                .mermaid-preview .node .label {
                    color: #fff !important;
                }
                .mermaid-preview .edgePath .path {
                    stroke: #666 !important;
                    stroke-width: 1.5px !important;
                }
                .mermaid-preview .markerPath {
                    fill: #666 !important;
                }
                .mermaid-preview .edgeLabel {
                    background-color: transparent !important;
                    color: #888 !important;
                    padding: 4px !important;
                }
            `}</style>
        </div>
    );
}
