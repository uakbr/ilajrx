import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText?: string;
    submitEnabled?: boolean;
    title: string | JSX.Element;
    content: string | JSX.Element;
}

export default function Modal({
    show,
    onClose,
    onSubmit,
    title,
    content,
    submitText,
    submitEnabled = true,
}: Props) {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 sm:p-6'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-8 text-left shadow-2xl ring-1 ring-white/10 transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-2xl font-semibold leading-7 text-white mb-3'
                                >
                                    {title}
                                </Dialog.Title>
                                <div className='text-lg text-gray-300 mb-8'>
                                    {content}
                                </div>

                                <div className='flex flex-col-reverse sm:flex-row-reverse gap-3'>
                                    {submitText && (
                                        <button
                                            type='button'
                                            disabled={!submitEnabled}
                                            className={`w-full sm:w-auto inline-flex justify-center rounded-xl px-8 py-3.5 text-base font-medium ${
                                                submitEnabled
                                                    ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            } transition-all duration-200`}
                                            onClick={onSubmit}
                                        >
                                            {submitText}
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className='w-full sm:w-auto inline-flex justify-center rounded-xl bg-gray-800 px-8 py-3.5 text-base font-medium text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200'
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
