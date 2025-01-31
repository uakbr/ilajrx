import { useEffect } from 'react';
import { useTranscriptionHistory, RecordingStatus } from '../contexts/TranscriptionHistoryContext';
import { useSettings } from '../contexts/SettingsContext';

export function useRecordingState(recordingId: string | null) {
    const { updateRecordingStatus } = useTranscriptionHistory();
    const { settings } = useSettings();

    // Update recording status when component mounts/unmounts
    useEffect(() => {
        if (!recordingId) return;

        // Set initial status
        updateRecordingStatus(recordingId, 'recording');

        // Cleanup on unmount
        return () => {
            // If auto-save is enabled, mark as processing instead of failed
            if (settings.autoSaveTranscriptions) {
                updateRecordingStatus(recordingId, 'processing');
            } else {
                updateRecordingStatus(recordingId, 'failed');
            }
        };
    }, [recordingId, settings.autoSaveTranscriptions, updateRecordingStatus]);

    const updateStatus = (status: RecordingStatus) => {
        if (recordingId) {
            updateRecordingStatus(recordingId, status);
        }
    };

    return {
        updateStatus,
    };
} 