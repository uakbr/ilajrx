import { useState } from 'react';
import { useTranscriptionHistory } from '../contexts/TranscriptionHistoryContext';
import TranscriptionDetail from '../components/TranscriptionDetail';

export default function History() {
    const { transcriptions } = useTranscriptionHistory();
    const [selectedTranscription, setSelectedTranscription] = useState<number | null>(null);

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date(timestamp));
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getPreviewText = (content: string) => {
        const words = content.split(' ');
        if (words.length <= 20) return content;
        return words.slice(0, 20).join(' ') + '...';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    Transcription History
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {transcriptions.length} transcription{transcriptions.length !== 1 ? 's' : ''}
                </div>
            </div>
            
            {transcriptions.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transcriptions yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Your transcription history will appear here once you start transcribing audio files.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {transcriptions.map((transcription, index) => (
                        <div
                            key={transcription.id}
                            onClick={() => setSelectedTranscription(index)}
                            className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {transcription.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            {formatDuration(transcription.duration)}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {formatDate(transcription.timestamp)}
                                        </span>
                                        {transcription.metadata.isAutoSaved && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-light/10 dark:bg-primary-dark/30 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                                                </svg>
                                                Auto-saved
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="View details"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 line-clamp-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-900/70 transition-colors">
                                {getPreviewText(transcription.content)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedTranscription !== null && (
                <TranscriptionDetail
                    transcription={transcriptions[selectedTranscription]}
                    isOpen={true}
                    onClose={() => setSelectedTranscription(null)}
                />
            )}
        </div>
    );
} 