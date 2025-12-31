"use client";

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidRenderer({ code }: { code: string }) {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        const render = async () => {
            try {
                const id = 'mermaid-render-' + Math.random().toString(36).substr(2, 9);
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
            } catch (err) {
                console.error('Failed to render static mermaid:', err);
            }
        };
        render();
    }, [code]);

    if (!svg) return <code className="text-[11px] text-neutral-500 font-mono whitespace-pre">{code}</code>;

    return (
        <div
            className="flex items-center justify-center p-4 bg-neutral-900/10 rounded-xl border border-white/5 overflow-auto max-h-[400px]"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
