export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
    return (
        <div className='mt-0.5 w-full relative text-sm bg-gray-200 dark:bg-gray-700 rounded-lg text-left overflow-hidden'>
            <div
                className='top-0 h-full bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-100 whitespace-nowrap px-2 transition-all duration-200'
                style={{ width: `${percentage}%` }}
            >
                {text} ({`${percentage.toFixed(2)}%`})
            </div>
        </div>
    );
}
