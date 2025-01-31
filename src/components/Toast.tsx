import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    show: boolean;
    message: string;
    type?: ToastType;
    onClose: () => void;
}

const typeConfig = {
    success: {
        icon: (
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        style: 'text-green-400 dark:text-green-300 bg-green-50 dark:bg-green-900/50',
    },
    error: {
        icon: (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        style: 'text-red-400 dark:text-red-300 bg-red-50 dark:bg-red-900/50',
    },
    info: {
        icon: (
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
        style: 'text-blue-400 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50',
    },
};

export default function Toast({ show, message, type = 'info', onClose }: ToastProps) {
    const config = typeConfig[type];

    return (
        <div className="fixed bottom-20 inset-x-0 z-50 px-4 pointer-events-none">
            <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="max-w-sm w-full mx-auto pointer-events-auto">
                    <div className={`rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4 ${config.style}`}>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {config.icon}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {message}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
} 