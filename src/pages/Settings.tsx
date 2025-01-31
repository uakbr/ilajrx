import { useSettings } from '../contexts/SettingsContext';
import { SaveFormat } from '../contexts/SettingsContext';

export default function Settings() {
    const { settings, updateSettings } = useSettings();

    return (
        <div className="container mx-auto px-4 pt-6 sm:pt-8 max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h2>
                
                <div className="space-y-6">
                    {/* Theme Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.theme === 'dark'}
                                    onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Auto-save Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Auto-save</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Enable Auto-save</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.autoSaveTranscriptions}
                                    onChange={(e) => updateSettings({ autoSaveTranscriptions: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Save Format Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Save Format</h3>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={settings.saveFormat}
                            onChange={(e) => updateSettings({ saveFormat: e.target.value as SaveFormat })}
                        >
                            <option value="txt">Text (.txt)</option>
                            <option value="json">JSON (.json)</option>
                            <option value="srt">Subtitles (.srt)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
} 