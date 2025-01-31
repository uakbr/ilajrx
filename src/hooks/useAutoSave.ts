import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranscriptionHistory } from '../contexts/TranscriptionHistoryContext';
import AutoSaveService, { AutoSaveData } from '../services/AutoSaveService';
import { useToast } from './useToast';

export function useAutoSave() {
    const { settings } = useSettings();
    const { addTranscription, updateRecordingStatus } = useTranscriptionHistory();
    const { showToast } = useToast();
    const autoSaveRef = useRef<AutoSaveService | null>(null);

    useEffect(() => {
        if (!autoSaveRef.current) {
            autoSaveRef.current = new AutoSaveService((data: AutoSaveData) => {
                // This callback is called whenever auto-save occurs
                showToast('Recording auto-saved', 'info');
            });
        }

        return () => {
            if (autoSaveRef.current) {
                autoSaveRef.current.stopAutoSave();
            }
        };
    }, [showToast]);

    const startAutoSave = (getCurrentData: () => AutoSaveData | null) => {
        if (settings.autoSaveTranscriptions && autoSaveRef.current) {
            autoSaveRef.current.startAutoSave(getCurrentData);
        }
    };

    const stopAutoSave = () => {
        if (autoSaveRef.current) {
            autoSaveRef.current.stopAutoSave();
        }
    };

    const checkForAutoSaved = (): AutoSaveData | null => {
        return autoSaveRef.current?.getLastAutoSave() || null;
    };

    const hasAutoSavedData = (): boolean => {
        return autoSaveRef.current?.hasAutoSavedData() || false;
    };

    return {
        startAutoSave,
        stopAutoSave,
        checkForAutoSaved,
        hasAutoSavedData,
    };
} 