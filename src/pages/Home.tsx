import { AudioManager } from "../components/AudioManager";
import Transcript from "../components/Transcript";
import { useTranscriber } from "../hooks/useTranscriber";
import { useState, useEffect, useRef } from "react";
import { useTranscriptionHistory } from "../contexts/TranscriptionHistoryContext";
import { useSettings } from "../contexts/SettingsContext";

export default function Home() {
    const transcriber = useTranscriber();
    const [currentAudioData, setCurrentAudioData] = useState<AudioBuffer | undefined>();
    const { addTranscription, temporaryTranscription, setTemporaryTranscription, transcriptions } = useTranscriptionHistory();
    const { settings } = useSettings();
    const hasAutoSavedRef = useRef(false);

    // Restore temporary transcription state when component mounts
    useEffect(() => {
        if (temporaryTranscription.transcriptionData) {
            transcriber.output = temporaryTranscription.transcriptionData;
        }
        if (temporaryTranscription.audioData) {
            setCurrentAudioData(temporaryTranscription.audioData);
        }
    }, []);

    // Save current transcription state when it changes
    useEffect(() => {
        setTemporaryTranscription({
            audioData: currentAudioData,
            transcriptionData: transcriber.output,
        });
    }, [transcriber.output, currentAudioData]);

    // Auto-save on unmount if there's unsaved transcription data
    useEffect(() => {
        return () => {
            if (
                transcriber.output && 
                !transcriber.output.isBusy && 
                currentAudioData && 
                !hasAutoSavedRef.current
            ) {
                // Check if this transcription already exists by comparing content and timestamp
                const currentTime = Date.now();
                const existingTranscription = transcriptions.find(t => 
                    t.content === transcriber.output?.text &&
                    Math.abs(t.timestamp - currentTime) < 60000 // Within 1 minute
                );

                if (!existingTranscription) {
                    hasAutoSavedRef.current = true;
                    const title = `Transcription ${new Date().toLocaleString()}`;
                    addTranscription({
                        timestamp: currentTime,
                        title,
                        duration: currentAudioData.duration,
                        format: settings.saveFormat || 'txt',
                        content: transcriber.output.text,
                        status: 'completed',
                        metadata: {
                            model: transcriber.model,
                            language: transcriber.language,
                            isAutoSaved: true,
                            fileSize: currentAudioData.length * 4
                        }
                    });
                }
            }
        };
    }, [transcriber.output, currentAudioData, addTranscription, settings.saveFormat, transcriber.model, transcriber.language, transcriptions]);

    // Reset auto-save flag when new audio is loaded
    useEffect(() => {
        hasAutoSavedRef.current = false;
    }, [currentAudioData]);

    return (
        <div className="container mx-auto flex flex-col justify-start items-center px-4 pt-6 sm:pt-8 max-w-2xl">
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    Whisper Web
                </h1>
                <h2 className="mt-1 text-sm sm:text-base text-center text-gray-600 dark:text-gray-400">
                    ML-powered speech recognition directly in your browser
                </h2>
            </div>
            
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <AudioManager 
                    transcriber={transcriber} 
                    onAudioDataChange={setCurrentAudioData}
                />
                <div className="mt-12">
                    <Transcript 
                        transcribedData={transcriber.output} 
                        audioData={currentAudioData}
                    />
                </div>
            </div>
        </div>
    );
} 