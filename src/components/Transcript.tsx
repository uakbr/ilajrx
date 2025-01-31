import { useRef, useEffect, useState } from "react";

import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";
import { useToast } from '../hooks/useToast';

interface Props {
    transcribedData: TranscriberData | undefined;
    audioData?: AudioBuffer;
}

export default function Transcript({ transcribedData, audioData }: Props) {
    const divRef = useRef<HTMLDivElement>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const copyTimeout = useRef<NodeJS.Timeout>();
    const { showToast } = useToast();

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async () => {
        const chunks = transcribedData?.chunks ?? [];
        const text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();
        
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            if (copyTimeout.current) {
                clearTimeout(copyTimeout.current);
            }
            copyTimeout.current = setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
            showToast('Copied to clipboard', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy to clipboard', 'error');
        }
    };

    const exportTXT = () => {
        let chunks = transcribedData?.chunks ?? [];
        let text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        const blob = new Blob([text], { type: "text/plain" });
        saveBlob(blob, "transcript.txt");
    };

    useEffect(() => {
        if (divRef.current) {
            const diff = Math.abs(
                divRef.current.offsetHeight +
                    divRef.current.scrollTop -
                    divRef.current.scrollHeight,
            );

            if (diff <= 64) {
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        }
        
        return () => {
            if (copyTimeout.current) {
                clearTimeout(copyTimeout.current);
            }
        };
    });

    return (
        <div
            ref={divRef}
            className='w-full h-full overflow-y-auto space-y-2 pb-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner p-4'
        >
            {transcribedData?.chunks &&
                transcribedData.chunks.map((chunk, i) => (
                    <div
                        key={`${i}-${chunk.text}`}
                        className='w-full flex flex-row mb-2 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                    >
                        <div className='mr-3 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                            {formatAudioTimestamp(chunk.timestamp[0])}
                        </div>
                        <div className='text-gray-900 dark:text-white'>
                            {chunk.text}
                        </div>
                    </div>
                ))}
            {transcribedData && !transcribedData.isBusy && (
                <div className='sticky bottom-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg'>
                    <div className='flex justify-end items-center gap-2'>
                        <button
                            onClick={copyToClipboard}
                            className='inline-flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 gap-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={exportTXT}
                            className='inline-flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 gap-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
