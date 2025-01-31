import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 space-y-6">
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
} 