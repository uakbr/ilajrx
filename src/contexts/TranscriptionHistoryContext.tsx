import React, { createContext, useContext, useEffect, useState } from 'react';
import { SaveFormat } from './SettingsContext';

export type RecordingStatus = 'recording' | 'processing' | 'completed' | 'failed';

export interface SavedTranscription {
    id: string;
    timestamp: number;
    title: string;
    duration: number;
    format: SaveFormat;
    content: string;
    status: RecordingStatus;
    metadata: {
        language?: string;
        model?: string;
        audioQuality?: string;
        fileSize?: number;
        deviceInfo?: string;
        isAutoSaved: boolean;
    }
}

interface TranscriptionHistoryContextType {
    transcriptions: SavedTranscription[];
    addTranscription: (transcription: Omit<SavedTranscription, 'id'>) => void;
    removeTranscription: (id: string) => void;
    updateTranscription: (id: string, updates: Partial<SavedTranscription>) => void;
    clearHistory: () => void;
    updateRecordingStatus: (id: string, status: RecordingStatus) => void;
    getActiveRecording: () => SavedTranscription | null;
    temporaryTranscription: {
        audioData?: AudioBuffer;
        transcriptionData?: {
            text: string;
            chunks: { text: string; timestamp: [number, number | null] }[];
            isBusy: boolean;
        };
    };
    setTemporaryTranscription: (data: {
        audioData?: AudioBuffer;
        transcriptionData?: {
            text: string;
            chunks: { text: string; timestamp: [number, number | null] }[];
            isBusy: boolean;
        };
    }) => void;
}

const TranscriptionHistoryContext = createContext<TranscriptionHistoryContextType | undefined>(undefined);

export function useTranscriptionHistory() {
    const context = useContext(TranscriptionHistoryContext);
    if (context === undefined) {
        throw new Error('useTranscriptionHistory must be used within a TranscriptionHistoryProvider');
    }
    return context;
}

export function TranscriptionHistoryProvider({ children }: { children: React.ReactNode }) {
    const [transcriptions, setTranscriptions] = useState<SavedTranscription[]>(() => {
        const saved = localStorage.getItem('whisper-web-transcriptions');
        return saved ? JSON.parse(saved) : [];
    });

    const [temporaryTranscription, setTemporaryTranscription] = useState<{
        audioData?: AudioBuffer;
        transcriptionData?: {
            text: string;
            chunks: { text: string; timestamp: [number, number | null] }[];
            isBusy: boolean;
        };
    }>({});

    // Persist transcriptions to localStorage
    useEffect(() => {
        localStorage.setItem('whisper-web-transcriptions', JSON.stringify(transcriptions));
    }, [transcriptions]);

    const addTranscription = (transcription: Omit<SavedTranscription, 'id'>) => {
        const newTranscription: SavedTranscription = {
            ...transcription,
            id: crypto.randomUUID(),
            metadata: {
                ...transcription.metadata,
                isAutoSaved: false, // Default value
            }
        };
        setTranscriptions(prev => [newTranscription, ...prev]);
    };

    const removeTranscription = (id: string) => {
        setTranscriptions(prev => prev.filter(t => t.id !== id));
    };

    const updateTranscription = (id: string, updates: Partial<SavedTranscription>) => {
        setTranscriptions(prev => prev.map(t => 
            t.id === id ? { ...t, ...updates } : t
        ));
    };

    const updateRecordingStatus = (id: string, status: RecordingStatus) => {
        setTranscriptions(prev => prev.map(t =>
            t.id === id ? { ...t, status } : t
        ));
    };

    const getActiveRecording = () => {
        return transcriptions.find(t => t.status === 'recording' || t.status === 'processing') || null;
    };

    const clearHistory = () => {
        setTranscriptions([]);
    };

    return (
        <TranscriptionHistoryContext.Provider value={{
            transcriptions,
            addTranscription,
            removeTranscription,
            updateTranscription,
            clearHistory,
            updateRecordingStatus,
            getActiveRecording,
            temporaryTranscription,
            setTemporaryTranscription,
        }}>
            {children}
        </TranscriptionHistoryContext.Provider>
    );
} 