import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import { TranscriptionHistoryProvider } from './contexts/TranscriptionHistoryContext';
import Navigation from './components/Navigation';

function App() {
    return (
        <SettingsProvider>
            <TranscriptionHistoryProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                        <Navigation />
                        <Toaster position="bottom-right" />
                    </div>
                </Router>
            </TranscriptionHistoryProvider>
        </SettingsProvider>
    );
}

export default App;
