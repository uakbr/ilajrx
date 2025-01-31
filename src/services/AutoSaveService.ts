import { SavedTranscription } from '../contexts/TranscriptionHistoryContext';

export interface AutoSaveData {
    timestamp: number;
    duration: number;
    content: string;
    metadata: SavedTranscription['metadata'];
}

class AutoSaveService {
    private static readonly AUTO_SAVE_KEY = 'whisper-web-autosave';
    private static readonly INTERVAL = 30000; // 30 seconds
    private intervalId: number | null = null;
    private onSave: (data: AutoSaveData) => void;

    constructor(onSave: (data: AutoSaveData) => void) {
        this.onSave = onSave;
        this.setupBeforeUnload();
    }

    private setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });
    }

    private saveCurrentState() {
        const currentData = this.getCurrentData();
        if (currentData) {
            localStorage.setItem(AutoSaveService.AUTO_SAVE_KEY, JSON.stringify(currentData));
            this.onSave(currentData);
        }
    }

    private getCurrentData(): AutoSaveData | null {
        // This should be implemented by the consumer to get current recording state
        return null;
    }

    startAutoSave(getCurrentData: () => AutoSaveData | null) {
        this.getCurrentData = getCurrentData;
        
        // Clear any existing interval
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
        }

        // Start new auto-save interval
        this.intervalId = window.setInterval(() => {
            this.saveCurrentState();
        }, AutoSaveService.INTERVAL);
    }

    stopAutoSave() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
        // Clear auto-save data
        localStorage.removeItem(AutoSaveService.AUTO_SAVE_KEY);
    }

    getLastAutoSave(): AutoSaveData | null {
        const saved = localStorage.getItem(AutoSaveService.AUTO_SAVE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    hasAutoSavedData(): boolean {
        return localStorage.getItem(AutoSaveService.AUTO_SAVE_KEY) !== null;
    }
}

export default AutoSaveService; 