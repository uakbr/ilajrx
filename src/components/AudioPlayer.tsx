import { useEffect, useRef, useState } from "react";

export default function AudioPlayer(props: {
    audioUrl: string;
    mimeType: string;
}) {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Updates src when url changes
    useEffect(() => {
        if (audioPlayer.current && audioSource.current) {
            audioSource.current.src = props.audioUrl;
            audioPlayer.current.load();
        }
    }, [props.audioUrl]);

    // Handle time updates
    useEffect(() => {
        const audio = audioPlayer.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const togglePlayPause = () => {
        if (audioPlayer.current) {
            if (isPlaying) {
                audioPlayer.current.pause();
            } else {
                audioPlayer.current.play();
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - bounds.left) / bounds.width;
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = percent * duration;
        }
    };

    return (
        <div className='flex flex-col relative z-10 p-4 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg'>
            <div className='flex items-center justify-between w-full mb-3'>
                <button
                    onClick={togglePlayPause}
                    className='w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-lg shadow-blue-500/25'
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
                <div className='flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white'>
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div 
                className='relative w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer overflow-hidden shadow-inner'
                onClick={handleSeek}
            >
                {/* Progress bar with gradient */}
                <div 
                    className='absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150'
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                
                {/* Waveform-like decoration */}
                <div className='absolute inset-0 flex items-center justify-around opacity-40'>
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                            key={i}
                            className='w-1 bg-current transform transition-transform duration-200'
                            style={{ 
                                height: `${30 + Math.sin(i * 0.5) * 20}%`,
                                opacity: currentTime / duration > (i / 40) ? 1 : 0.3
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Hidden native audio element */}
            <audio
                ref={audioPlayer}
                className='hidden'
            >
                <source ref={audioSource} type={props.mimeType}></source>
            </audio>
        </div>
    );
}
