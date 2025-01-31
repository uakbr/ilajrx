import { useState, useEffect, useRef } from "react";

import { formatAudioTimestamp } from "../utils/AudioUtils";
import { webmFixDuration } from "../utils/BlobFix";
import AudioPlayer from "./AudioPlayer";

function getMimeType() {
    const types = [
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
        "audio/aac",
    ];
    for (let i = 0; i < types.length; i++) {
        if (MediaRecorder.isTypeSupported(types[i])) {
            return types[i];
        }
    }
    return undefined;
}

export default function AudioRecorder(props: {
    onRecordingComplete: (blob: Blob) => void;
}) {
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            // Reset recording state
            setRecordedBlob(null);
            setAudioUrl(null);
            chunksRef.current = [];
            setDuration(0);

            // Get microphone access if we don't have it
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            }

            const mimeType = getMimeType();
            if (!mimeType) {
                throw new Error("No supported audio MIME type found");
            }

            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
            });

            mediaRecorderRef.current = mediaRecorder;
            const startTime = Date.now();

            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
                
                if (mediaRecorder.state === "inactive") {
                    const duration = Date.now() - startTime;
                    let blob = new Blob(chunksRef.current, { type: mimeType });

                    if (mimeType === "audio/webm") {
                        blob = await webmFixDuration(blob, duration, blob.type);
                    }

                    setRecordedBlob(blob);
                    setAudioUrl(URL.createObjectURL(blob));
                    props.onRecordingComplete(blob);
                    chunksRef.current = [];
                }
            });

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
            setRecording(false);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setRecording(false);
            
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    };

    useEffect(() => {
        if (recording) {
            const timer = setInterval(() => {
                setDuration(prevDuration => prevDuration + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [recording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleToggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className='flex flex-col justify-center items-center space-y-8 w-full py-6'>
            <button
                type='button'
                className={`group relative w-full sm:w-auto flex justify-center items-center rounded-2xl border-0 px-12 py-6 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ${
                    recording
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
                onClick={handleToggleRecording}
                disabled={recording && !mediaRecorderRef.current}
            >
                <span className="flex items-center gap-3">
                    {recording ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="12" height="16" rx="1" />
                            </svg>
                            <span className="text-xl whitespace-nowrap">Stop Recording ({formatAudioTimestamp(duration)})</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 15c1.941 0 3.5-1.559 3.5-3.5V5c0-1.941-1.559-3.5-3.5-3.5S8.5 3.059 8.5 5v6.5c0 1.941 1.559 3.5 3.5 3.5zm7-3.5c0 3.859-3.141 7-7 7s-7-3.141-7-7h2c0 2.757 2.243 5 5 5s5-2.243 5-5h2z"/>
                            </svg>
                            <span className="text-xl">Start Recording</span>
                        </>
                    )}
                </span>
            </button>

            {recordedBlob && audioUrl && (
                <div className="w-full">
                    <AudioPlayer 
                        audioUrl={audioUrl}
                        mimeType={recordedBlob.type}
                    />
                </div>
            )}
        </div>
    );
}
