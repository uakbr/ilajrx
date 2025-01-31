import React, { createContext, useContext, useEffect, useState } from 'react';

export type SaveFormat = 'txt' | 'json' | 'srt';
export type Theme = 'light' | 'dark';

export interface Settings {
    theme: Theme;
    autoSaveTranscriptions: boolean;
    saveFormat: SaveFormat;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
    theme: 'light',
    autoSaveTranscriptions: true,
    saveFormat: 'txt'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('whisper-web-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('whisper-web-settings', JSON.stringify(settings));
        
        // Apply theme
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings]);

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
} 