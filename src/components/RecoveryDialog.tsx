import React from 'react';
import Dialog from './Dialog';
import { AutoSaveData } from '../services/AutoSaveService';

interface RecoveryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRecover: () => void;
    onDiscard: () => void;
    autoSavedData: AutoSaveData;
}

function formatTimestamp(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(timestamp));
}

export default function RecoveryDialog({
    isOpen,
    onClose,
    onRecover,
    onDiscard,
    autoSavedData,
}: RecoveryDialogProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Recover Auto-saved Recording"
            description={
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        We found an auto-saved recording from {formatTimestamp(autoSavedData.timestamp)}.
                        Would you like to recover it?
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between mb-1">
                                <span>Duration:</span>
                                <span className="font-medium">{Math.round(autoSavedData.duration)}s</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Content Preview:</span>
                                <span className="font-medium truncate max-w-[200px]">
                                    {autoSavedData.content.slice(0, 50)}...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            confirmLabel="Recover"
            cancelLabel="Discard"
            onConfirm={onRecover}
        />
    );
} 