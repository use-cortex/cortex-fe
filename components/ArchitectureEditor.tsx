"use client";

import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState } from 'react';

const Excalidraw = dynamic(
    async () => {
        const component = await import("@excalidraw/excalidraw");
        return component.Excalidraw;
    },
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-xl">
                <div className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Initializing Studio...</div>
            </div>
        ),
    }
);

interface ArchitectureEditorProps {
    data?: string;
    onChange: (data: string, image: string) => void;
}

export default function ArchitectureEditor({ data, onChange }: ArchitectureEditorProps) {
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const initialData = useMemo(() => {
        if (!data) return { elements: [], appState: { theme: 'dark' as const } };
        try {
            return {
                elements: JSON.parse(data),
                appState: { theme: 'dark' as const }
            };
        } catch (e) {
            return { elements: [], appState: { theme: 'dark' as const } };
        }
    }, [data]);

    const handleExcalidrawChange = useCallback((elements: any, appState: any, files: any) => {
        if (!excalidrawAPI) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            // Only export if we have elements to save processing
            const json = JSON.stringify(elements);
            try {
                const { exportToCanvas } = await import("@excalidraw/excalidraw");
                const canvas = await exportToCanvas({
                    elements,
                    appState: {
                        ...appState,
                        exportWithDarkMode: true,
                        viewBackgroundColor: "#0a0a0a"
                    },
                    files,
                    getDimensions: (width: number, height: number) => ({ width: width * 1.5, height: height * 1.5 })
                });

                const imageData = canvas.toDataURL("image/png");
                onChange(json, imageData);
            } catch (err) {
                console.error("Export failure:", err);
                onChange(json, "");
            }
        }, 1000);
    }, [excalidrawAPI, onChange]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 bg-neutral-950">
            <Excalidraw
                theme="dark"
                excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                initialData={initialData}
                onChange={handleExcalidrawChange}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveToActiveFile: false,
                        export: false,
                        saveAsImage: false,
                        toggleTheme: false,
                    },
                }}
            />
        </div>
    );
}
