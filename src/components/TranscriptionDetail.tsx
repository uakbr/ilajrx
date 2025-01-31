import { useState } from 'react';
import { SavedTranscription } from '../contexts/TranscriptionHistoryContext';
import Dialog from './Dialog';
import { useToast } from '../hooks/useToast';

interface TranscriptionDetailProps {
    transcription: SavedTranscription;
    isOpen: boolean;
    onClose: () => void;
}

export default function TranscriptionDetail({ transcription, isOpen, onClose }: TranscriptionDetailProps) {
    const { showToast } = useToast();
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(transcription.content);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            showToast('Copied to clipboard', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            showToast('Failed to copy to clipboard', 'error');
        }
    };

    const handleDownload = () => {
        const blob = new Blob([transcription.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${transcription.title}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded successfully', 'success');
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeStyle: 'medium'
        }).format(new Date(timestamp));
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return 'N/A';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{transcription.title}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Copy to clipboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Download as TXT"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
            description={
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</div>
                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                                {formatDate(transcription.timestamp)}
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                                {formatDuration(transcription.duration)}
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">File Size</div>
                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                                {formatFileSize(transcription.metadata.fileSize || 0)}
                            </div>
                        </div>
                    </div>

                    {(transcription.metadata.model || transcription.metadata.language) && (
                        <div className="flex flex-wrap gap-2">
                            {transcription.metadata.model && (
                                <div className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Model:</span>
                                    <span className="ml-1.5">{transcription.metadata.model}</span>
                                </div>
                            )}
                            {transcription.metadata.language && (
                                <div className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Language:</span>
                                    <span className="ml-1.5">{transcription.metadata.language}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="relative">
                        {copySuccess && (
                            <div className="absolute right-3 top-3 px-2 py-1 bg-emerald-500 text-white text-xs rounded-md">
                                Copied!
                            </div>
                        )}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono">
                                {transcription.content}
                            </pre>
                        </div>
                    </div>
                </div>
            }
            confirmLabel="Close"
            onConfirm={onClose}
            hideCancel
        />
    );
} 