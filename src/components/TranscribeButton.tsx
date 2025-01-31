interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isModelLoading: boolean;
    isTranscribing: boolean;
}

export function TranscribeButton(props: Props): JSX.Element {
    const { isModelLoading, isTranscribing, onClick, ...buttonProps } = props;
    return (
        <button
            {...buttonProps}
            onClick={(event) => {
                if (onClick && !isTranscribing && !isModelLoading) {
                    onClick(event);
                }
            }}
            disabled={isTranscribing}
            className='relative group flex items-center justify-center px-6 py-3 text-white bg-primary hover:bg-primary-dark rounded-lg text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out'
        >
            {isModelLoading ? (
                <Spinner text={"Loading model..."} />
            ) : isTranscribing ? (
                <Spinner text={"Transcribing..."} />
            ) : (
                <div className='flex items-center gap-2.5'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 15c1.941 0 3.5-1.559 3.5-3.5V5c0-1.941-1.559-3.5-3.5-3.5S8.5 3.059 8.5 5v6.5c0 1.941 1.559 3.5 3.5 3.5zm7-3.5c0 3.859-3.141 7-7 7s-7-3.141-7-7h2c0 2.757 2.243 5 5 5s5-2.243 5-5h2z"/>
                    </svg>
                    <span>Transcribe Audio</span>
                </div>
            )}
        </button>
    );
}

function Spinner({ text }: { text: string }) {
    return (
        <div className='flex items-center gap-2.5'>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">{text}</span>
        </div>
    );
}
